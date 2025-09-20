const Dropdown = ({ children, width, border, position}) => {
  return (
    <div 
      className={`p-2 absolute left-0 mt-1 bg-white z-10 transition ${width} ${border ?? 'border border-gray-400'} ${position ?? 'top-full'}`}>
      {children}
    </div>
  );
};

export default Dropdown;
