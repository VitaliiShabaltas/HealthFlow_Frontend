import { useState, useEffect } from 'react';
import { FiSearch, FiDownload } from 'react-icons/fi';
import FiltersBarAdmin from './FiltersBarAdmin';
import jsPDF from 'jspdf';
import '../../assets/fonts/Roboto.js';
import { Button } from '../ui/Button';
import {
  getAppointments,
  getDoctors,
  getDepartments,
  getDepartmentSpecializations,
} from '../../api/appointments';
import {
  format,
  subDays,
  subMonths,
  subYears,
  parseISO,
  differenceInDays,
} from 'date-fns';

export default function Report() {
  const [departmentId, setDepartmentId] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [timePeriod, setTimePeriod] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [allAppointments, setAllAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        setAllAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, []);

  const formatDate = (date) => {
    return format(new Date(date), 'dd.MM.yyyy');
  };

  const formatTime = (time) => {
    return format(parseISO(`2000-01-01T${time}`), 'HH:mm');
  };

  const generateReport = async () => {
    if (!departmentId) {
      setValidationError('Будь ласка, оберіть відділення');
      return;
    }
    if (!specialtyId) {
      setValidationError('Будь ласка, оберіть спеціальність');
      return;
    }
    if (!doctorId) {
      setValidationError('Будь ласка, оберіть лікаря');
      return;
    }
    if (timePeriod === 'custom' && (!startDate || !endDate)) {
      setValidationError('Будь ласка, оберіть початкову та кінцеву дату');
      return;
    }

    setValidationError('');
    setIsLoading(true);

    try {
      let filteredAppointments = allAppointments.filter(
        (app) => String(app.doctor_id) === String(doctorId)
      );

      let start, end;
      const now = new Date();

      switch (timePeriod) {
        case 'week':
          start = subDays(now, 7);
          end = now;
          break;
        case 'month':
          start = subMonths(now, 1);
          end = now;
          break;
        case 'year':
          start = subYears(now, 1);
          end = now;
          break;
        case 'custom':
          start = new Date(startDate);
          end = new Date(endDate);
          break;
        default:
          if (filteredAppointments.length > 0) {
            start = new Date(
              Math.min(
                ...filteredAppointments.map((app) =>
                  new Date(app.appointment_date).getTime()
                )
              )
            );
            end = now;
          } else {
            start = now;
            end = now;
          }
      }

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      filteredAppointments = filteredAppointments.filter((app) => {
        const appDate = new Date(app.appointment_date);
        return appDate >= start && appDate <= end;
      });

      const totalAppointments = filteredAppointments.length;
      const uniquePatients = new Set(
        filteredAppointments.map((app) => app.client_id)
      ).size;

      const days = Math.max(1, differenceInDays(end, start) + 1);

      const totalRevenue = filteredAppointments.reduce(
        (sum, app) => sum + (parseFloat(app.price) || 0),
        0
      );

      const doctors = await getDoctors();
      const doctor = doctors.find(
        (doc) => String(doc.doctor_id) === String(doctorId)
      );
      const doctorName = doctor
        ? `${doctor.user.surname} ${doctor.user.name} ${doctor.user.middlename}`.trim()
        : 'Невідомий лікар';

      const departments = await getDepartments();
      const department = departments.find(
        (dep) => String(dep.id) === String(departmentId)
      );
      const specialties = await getDepartmentSpecializations(departmentId);
      const specialty = specialties.find(
        (spec) => String(spec.id) === String(specialtyId)
      );

      const report = {
        doctor: doctorName,
        specialty: specialty?.label || 'Невідома спеціальність',
        hospital: department?.name || 'Невідоме відділення',
        period:
          timePeriod === 'custom'
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : timePeriod === 'all'
            ? 'За весь час'
            : `За останній ${
                timePeriod === 'week'
                  ? 'тиждень'
                  : timePeriod === 'month'
                  ? 'місяць'
                  : 'рік'
              } (${formatDate(start)} - ${formatDate(end)})`,
        stats: {
          totalAppointments,
          totalPatients: uniquePatients,
          averageAppointmentsPerDay: (totalAppointments / days).toFixed(1),
          averageRevenuePerDay: (totalRevenue / days).toFixed(2),
          totalRevenue: totalRevenue.toFixed(2),
        },
        appointments: filteredAppointments.map((app) => ({
          id: app.appointment_id,
          date: formatDate(app.appointment_date),
          time: formatTime(app.start_time),
          patient: `Пацієнт #${app.client_id}`,
          revenue: `${(parseFloat(app.price) || 0).toFixed(2)} грн`,
          status: 'Завершено',
        })),
        generatedAt: new Date().toLocaleString(),
      };

      setReportData(report);
    } catch (error) {
      console.error('Error generating report:', error);
      setValidationError('Помилка при генерації звіту');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPdfReport = () => {
    if (!reportData) return;
    const doc = new jsPDF();

    try {
      doc.addFont('Roboto-Regular-normal.ttf', 'Roboto', 'normal');
      doc.setFont('Roboto');

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = 20;
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text('МЕДИЧНИЙ ЗВІТ', pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;
      doc.setFontSize(12);
      doc.text(`Лікар: ${reportData.doctor}`, margin, yPos);
      yPos += 8;
      doc.text(`Спеціальність: ${reportData.specialty}`, margin, yPos);
      yPos += 8;
      doc.text(`Відділення: ${reportData.hospital}`, margin, yPos);
      yPos += 8;
      doc.text(`Період: ${reportData.period}`, margin, yPos);
      yPos += 15;
      doc.setFontSize(14);
      doc.text('Статистика', margin, yPos);
      yPos += 10;
      const drawTableRow = (label, value, y) => {
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(label.toString(), margin, y);
        doc.text(value.toString(), pageWidth - margin, y, { align: 'right' });
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        return y + 8;
      };
      const stats = [
        ['Всього записів', reportData.stats.totalAppointments.toString()],
        ['Унікальних пацієнтів', reportData.stats.totalPatients.toString()],
        [
          'Середня кількість записів/день',
          reportData.stats.averageAppointmentsPerDay.toString(),
        ],
        ['Всього доходу', `${reportData.stats.totalRevenue} грн`],
        ['Середній дохід/день', `${reportData.stats.averageRevenuePerDay} грн`],
      ];

      stats.forEach(([label, value]) => {
        yPos = drawTableRow(label, value, yPos);
        if (yPos > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yPos = 20;
        }
      });
      doc.save(
        `Звіт_${reportData.doctor.replace(' ', '_')}_${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`
      );
    } catch (error) {
      console.error('Помилка при генерації PDF:', error);
      alert(
        'Сталася помилка при генерації PDF. Перевірте консоль для деталей.'
      );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Звіти</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Профіль лікарів з кількістю записів
        </h3>

        <FiltersBarAdmin
          departmentId={departmentId}
          setDepartmentId={setDepartmentId}
          specialtyId={specialtyId}
          setSpecialtyId={setSpecialtyId}
          doctorId={doctorId}
          setDoctorId={setDoctorId}
        />

        <div className="mt-4 flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Період
            </label>
            <div className="flex items-center space-x-4">
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="all">За весь час</option>
                <option value="custom">Обраний період</option>
                <option value="week">За останній тиждень</option>
                <option value="month">За останній місяць</option>
                <option value="year">За останній рік</option>
              </select>

              {timePeriod === 'custom' && (
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                  <span className="text-gray-500">до</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {validationError && (
            <div className="text-red-500 text-sm">{validationError}</div>
          )}

          <Button
            onClick={generateReport}
            disabled={isLoading}
            className="self-start mt-4"
          >
            {isLoading ? 'Генерація...' : 'Згенерувати звіт'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Результати звіту</h3>
          {reportData && (
            <button
              onClick={downloadPdfReport}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <FiDownload /> Завантажити PDF
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Генерація звіту...</p>
          </div>
        ) : reportData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-500">Лікар</h4>
                <p className="text-xl font-semibold">{reportData.doctor}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-500">Спеціальність</h4>
                <p className="text-xl font-semibold">{reportData.specialty}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-500">Відділення</h4>
                <p className="text-xl font-semibold">{reportData.hospital}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-3">
                Період: {reportData.period}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <h5 className="text-sm text-gray-500">Всього записів</h5>
                  <p className="text-xl font-bold">
                    {reportData.stats.totalAppointments}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500">
                    Унікальних пацієнтів
                  </h5>
                  <p className="text-xl font-bold">
                    {reportData.stats.totalPatients}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500">
                    Середня к-сть записів/день
                  </h5>
                  <p className="text-xl font-bold">
                    {reportData.stats.averageAppointmentsPerDay}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500">Всього доходу</h5>
                  <p className="text-xl font-bold">
                    {reportData.stats.totalRevenue} грн
                  </p>
                </div>
                <div>
                  <h5 className="text-sm text-gray-500">Середній дохід/день</h5>
                  <p className="text-xl font-bold">
                    {reportData.stats.averageRevenuePerDay} грн
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Деталізація записів</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex justify-center">
                          <span>Дата</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex justify-center">
                          <span>Час</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex justify-center">
                          <span>Пацієнт</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex justify-center">
                          <span>Дохід</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {appointment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {appointment.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {appointment.patient}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {appointment.revenue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-sm text-gray-500 text-right">
              Звіт згенеровано: {reportData.generatedAt}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 py-8 text-center">
            Тут будуть відображатись результати звіту після генерації
          </div>
        )}
      </div>
    </div>
  );
}
