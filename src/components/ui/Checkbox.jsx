export const Checkbox = ({ checked, onClick }) => (
  <div
    className={`w-5 h-5 flex items-center justify-center rounded mr-3 border-2 ${
      checked ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
    }`}
    onClick={onClick}
  >
    {checked && (
      <svg
        className="w-4 h-4 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
      </svg>
    )}
  </div>
);
