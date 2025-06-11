import { useState } from 'react';
import ManagerPanel from '../components/admin/ManagerPanel';
import ModeratorPanel from '../components/admin/ModeratorPanel';
import ContentArea from '../components/ui/ContentArea';
import { useNavigate } from 'react-router-dom';
export function AdminPanelPage({ handleLogout }) {
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();

  const role = localStorage.getItem('userRole');

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 relative">
      <div className="flex flex-1">
        <aside className="w-60 bg-white border-r border-gray-200 relative">
          {role === 'manager' ? (
            <ManagerPanel activeItem={activeItem} onSelect={setActiveItem} />
          ) : (
            <ModeratorPanel activeItem={activeItem} onSelect={setActiveItem} />
          )}
        </aside>
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <ContentArea activeItem={activeItem} />
        </main>
      </div>

      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={handleLogoutClick}
          className="rounded-md px-4 py-2 bg-[#ff366895] text-white cursor-pointer"
        >
          Вийти з акаунту
        </button>
      </div>
    </div>
  );
}
