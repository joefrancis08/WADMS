const Dropdown = ({ children, width }) => {
  return (
    <div className={`absolute top-full left-0 border border-gray-400 mt-1 bg-white shadow z-10 transition ${width}`}>
      {children}
    </div>
  );
};

export default Dropdown;
