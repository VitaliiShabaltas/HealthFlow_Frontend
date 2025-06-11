import { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { fetchDoctorsWithSpecializations, fetchAllAppointments } from '../../api/statistic';

ChartJS.register(...registerables);

const getDoctorInitials = (doctor) => {
  const surname = doctor.user.surname || '';
  const name = doctor.user.name ? doctor.user.name.charAt(0) + '.' : '';
  const middlename = doctor.user.middlename ? doctor.user.middlename.charAt(0) + '.' : '';
  return `${surname} ${name}${middlename}`;
};

export default function Statistic() {
  const [doctorsByAppointments, setDoctorsByAppointments] = useState([]);
  const [doctorsByReviews, setDoctorsByReviews] = useState([]);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctors, appointments] = await Promise.all([
          fetchDoctorsWithSpecializations(),
          fetchAllAppointments()
        ]);

        const doctorAppointmentsCount = {};
        appointments.forEach(appointment => {
          const doctorId = appointment.doctor_id;
          doctorAppointmentsCount[doctorId] = (doctorAppointmentsCount[doctorId] || 0) + 1;
        });

        const doctorsWithAppointments = doctors.map(doctor => ({
          ...doctor,
          appointmentsCount: doctorAppointmentsCount[doctor.doctor_id] || 0
        }));

        const topDoctorsByAppointments = doctorsWithAppointments
          .sort((a, b) => b.appointmentsCount - a.appointmentsCount)
          .slice(0, 5)
          .map(doctor => ({
            doctorName: `${getDoctorInitials(doctor)} (${doctor.specialization})`,
            appointments: doctor.appointmentsCount
          }));

        setDoctorsByAppointments(topDoctorsByAppointments);

        const topDoctorsByRating = doctors
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5)
          .map(doctor => ({
            doctorName: `${getDoctorInitials(doctor)} (${doctor.specialization})`,
            rating: doctor.rating
          }));

        setDoctorsByReviews(topDoctorsByRating);

        const monthlyAppointments = {};
        appointments.forEach(appointment => {
          const date = new Date(appointment.appointment_date);
          const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
          monthlyAppointments[monthYear] = (monthlyAppointments[monthYear] || 0) + 1;
        });

        const months = [
          'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 
          'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 
          'Листопад', 'Грудень'
        ];

        const currentDate = new Date();
        const last5Months = [];
        for (let i = 4; i >= 0; i--) {
          const date = new Date();
          date.setMonth(currentDate.getMonth() - i);
          last5Months.push({
            month: months[date.getMonth()],
            appointments: monthlyAppointments[`${date.getFullYear()}-${date.getMonth() + 1}`] || 0
          });
        }

        setAppointmentsData(last5Months);
      } catch (error) {
        console.error('Error loading statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const topDoctorsChartData = {
    labels: doctorsByAppointments.map(d => d.doctorName),
    datasets: [
      {
        label: 'Кількість записів',
        data: doctorsByAppointments.map(d => d.appointments),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const topReviewsChartData = {
    labels: doctorsByReviews.map(d => d.doctorName),
    datasets: [
      {
        label: 'Рейтинг',
        data: doctorsByReviews.map(d => d.rating),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const appointmentsChartData = {
    labels: appointmentsData.map(d => d.month),
    datasets: [
      {
        label: 'Кількість записів',
        data: appointmentsData.map(d => d.appointments),
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="min-h-210 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Статистика</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Топ-5 лікарів за кількістю записів</h3>
          <div className="h-64">
            <Bar 
              data={topDoctorsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Кількість записів'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Топ лікарів за рейтингом</h3>
          <div className="h-64">
            <Bar 
              data={topReviewsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    min: 0,
                    max: 5,
                    title: {
                      display: true,
                      text: 'Рейтинг'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Кількість записів всіх лікарів</h3>
        <div className="h-64">
          <Line 
            data={appointmentsChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Кількість записів'
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}