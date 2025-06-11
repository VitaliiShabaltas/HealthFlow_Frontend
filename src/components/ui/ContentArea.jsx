import CreateDoctorAccount from '../admin/CreateDoctorAccount';
import DeleteDoctorAccount from '../admin/DeleteDoctorAccount';
import DoctorScheduleManager from '../admin/DoctorScheduleManager';
import Report from '../admin/Report';
import Review from '../admin/Review';
import Statistic from '../admin/Statistic';
import ClientAppointmentsControl from '../patients/ClientAppointmentsControl';
import ClientContactsView from '../patients/ClientContactsView';

export default function ContentView({ activeItem }) {
  switch (activeItem) {
    case 'Створення акаунтів':
      return <CreateDoctorAccount />;
    case 'Видалення акаунтів':
      return <DeleteDoctorAccount />;
    case 'Управління графіками лікаря':
      return <DoctorScheduleManager />;
    case 'Контроль записів':
      return <ClientAppointmentsControl />;
    case 'Перегляд контактів':
      return <ClientContactsView />;
    case 'Статистики':
      return <Statistic />;
    case 'Звіти':
      return <Report />;
    case 'Управління відгуками':
      return <Review />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Оберіть пункт меню для роботи
        </div>
      );
  }
}
