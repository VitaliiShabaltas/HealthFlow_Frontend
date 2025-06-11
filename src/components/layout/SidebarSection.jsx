import { useEffect, useState } from 'react';
import SidebarItem from '../ui/SidebarItem';

export default function SidebarSection({
  title,
  items,
  activeItem,
  onSelect,
  horizontal = false,
  icon,
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (items.includes(activeItem)) {
      setOpen(true);
    }
  }, [activeItem, items]);

  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        className={`group w-full px-4 py-3 text-left font-semibold cursor-pointer flex justify-between items-center transition-colors ${
          open
            ? 'text-white bg-[#5084ffc5]'
            : 'text-[#999a9c] hover:text-white hover:bg-[#88acffc5]'
        }`}
      >
        <span className="flex items-center gap-2 uppercase tracking-wider text-lg">
          {icon && <span>{icon}</span>}
          {title}
        </span>

        <span
          className={`text-xs ${
            open ? 'text-white' : 'text-[#999a9c] group-hover:text-white'
          }`}
        >
          {open ? '▼' : '▶'}
        </span>
      </div>

      {open && (
        <div className="bg-white">
          {items.map((item) => (
            <SidebarItem
              key={item}
              label={item}
              isActive={activeItem === item}
              onClick={() => onSelect(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
