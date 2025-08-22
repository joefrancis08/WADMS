const ModalLayout = ({ 
  onClose, 
  header, 
  body, 
  footer,
  bodyMargin,
  bodyPosition, 
  footerMargin,
  footerPosition 
}) => {
  const handleContentClick = (e) => {
    e.stopPropagation();
  }

  return (
    <div onClick={() => { onClose?.() }} className="h-full fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs overflow-hidden">
      <div onClick={handleContentClick} className="w-full md:max-w-xl bg-gradient-to-r from-gray-100 to-white rounded shadow-2xl px-6 pt-6 animate-fadeIn">
        <div className='flex text-gray-700 justify-between items-center max-md:items-center'>
          {header}
          <button className='hidden' onClick={() => { onClose?.() }}></button>
        </div>
        <hr className='text-gray-300 mt-2 w-[50%] mx-auto'></hr>

        <div className={`w-full flex flex-col ${bodyMargin || 'my-4'} ${bodyPosition || 'justify-center items-center'}`}>
          {body}
        </div>

        <div className={`flex items-center ${footerMargin} ${footerPosition || 'justify-evenly'}`}>
          {footer}
        </div>
      </div>
    </div>
  );
};

export default ModalLayout;
