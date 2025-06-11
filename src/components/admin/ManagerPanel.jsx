import SidebarSection from '../layout/SidebarSection';
import SidebarButton from '../ui/SidebarButton';

import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import {
  faAddressBook,
  faPen,
  faPlus,
  faUserDoctor,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function ManagerPanel({
  activeItem,
  onSelect,
  horizontal = false,
}) {
  return (
    <div className={`${horizontal ? 'flex gap-4  ' : ''}`}>
      <h1 className="bg-[#ff366895] text-lg font-bold text-white h-[70px] flex items-center justify-center gap-2 px-4">
        <FontAwesomeIcon icon={faPlus} className="text-2xl " />
        MANAGER PANEL
      </h1>

      <SidebarSection
        title="Управляння акаунтами лікарів"
        icon={<FontAwesomeIcon icon={faUserDoctor} />}
        items={['Створення акаунтів', 'Видалення акаунтів']}
        activeItem={activeItem}
        onSelect={onSelect}
        horizontal={horizontal}
      />
      <SidebarButton
        title="Управління графіками лікаря"
        icon={<FontAwesomeIcon icon={faCalendarDays} />}
        onClick={() => onSelect('Управління графіками лікаря')}
        isActive={activeItem === 'Управління графіками лікаря'}
      />
      <div className="">
        <SidebarButton
          title="Контроль записів клієнта"
          icon={<FontAwesomeIcon icon={faPen} />}
          onClick={() => onSelect('Контроль записів')}
          isActive={activeItem === 'Контроль записів'}
        />
      </div>
      <div className="">
        <SidebarButton
          title="Перегляд контактів клієнта"
          icon={<FontAwesomeIcon icon={faAddressBook} />}
          onClick={() => onSelect('Перегляд контактів')}
          isActive={activeItem === 'Перегляд контактів'}
        />
      </div>
    </div>
  );
}
