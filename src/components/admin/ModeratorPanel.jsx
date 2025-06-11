import {
  faChartLine,
  faFileInvoice,
  faMessage,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SidebarButton from '../ui/SidebarButton';

export default function ModeratorPanel({ activeItem, onSelect }) {
  return (
    <div>
      <h1 className="bg-[#ff366895] text-lg font-bold text-white h-[70px] flex items-center justify-center gap-2 px-4">
        <FontAwesomeIcon icon={faPlus} className="text-2xl" />
        MODERATOR PANEL
      </h1>

      <SidebarButton
        title="Статистики"
        icon={<FontAwesomeIcon icon={faChartLine} />}
        onClick={() => onSelect('Статистики')}
        isActive={activeItem === 'Статистики'}
      />

      <SidebarButton
        title="Звіти"
        icon={<FontAwesomeIcon icon={faFileInvoice} />}
        onClick={() => onSelect('Звіти')}
        isActive={activeItem === 'Звіти'}
      />

      <SidebarButton
        title="Управління відгуками"
        icon={<FontAwesomeIcon icon={faMessage} />}
        onClick={() => onSelect('Управління відгуками')}
        isActive={activeItem === 'Управління відгуками'}
      />
    </div>
  );
}
