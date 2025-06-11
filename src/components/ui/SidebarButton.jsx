export default function SidebarButton({ title, onClick, isActive, icon }) {
  return (
    <span>
      <button
        onClick={onClick}
        className={`w-full px-4 py-3 text-left font-semibold cursor-pointer flex justify-start gap-4 items-center transition-colors ${
          isActive
            ? 'text-white bg-[#5084ffc5]'
            : 'text-[#999a9c] hover:text-white hover:bg-[#88acffc5]'
        }`}
      >
        {icon && <span className="text-lg">{icon}</span>}
        <span className="uppercase tracking-wider">{title}</span>
      </button>
    </span>
  );
}
