import { twMerge } from 'tailwind-merge';

export const Button = ({ children, className, onClick, rounded = false }) => {
  const baseClasses = `py-2 w-full font-bold cursor-pointer hover:bg-red-400 transition ${
    rounded ? 'rounded-3xl' : 'rounded-lg'
  } bg-shade-red text-white`;

  return (
    <button className={twMerge(baseClasses, className)} onClick={onClick}>
      {children}
    </button>
  );
};
