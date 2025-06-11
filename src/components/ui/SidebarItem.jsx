export default function SidebarItem({ label, onClick, isActive }) {
  return (
    <div
      onClick={onClick}
      className={`text-left pl-8 pr-4 py-2 text-sm cursor-pointer transition-colors ${
        isActive
          ? 'bg-[#88acffc5] text-white border-l-3 border-white]'
          : 'text-[#999a9c] hover:text-white hover:bg-[#88acffc5]'
      }`}
    >
      <span className=" uppercase tracking-wider">{label}</span>
    </div>
  );
}
