const Dropdown = ({ children, width, border, position}) => {
  return (
    <div 
      className={`absolute left-0 mt-1 bg-gradient-to-r from-gray-100 to-white shadow z-10 transition ${width} ${border ?? 'border border-gray-400'} ${position ?? 'top-full'}`}>
      {children}
    </div>
  );
};

export default Dropdown;
