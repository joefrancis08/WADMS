const ConfirmationModalLayout = ({ 
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
  };

  return (
    <div onClick={() => { onClose?.() }} className="h-full fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div onClick={handleContentClick} className="w-[90%] md:max-w-xl bg-gradient-to-r from-gray-100 to-white rounded-lg shadow-2xl px-6 py-4 animate-fadeIn">
        <div className='flex text-gray-700 justify-end items-center max-md:items-center'>
          {header}
          <button className='hidden' onClick={() => { onClose?.() }}></button>
        </div>

        <div className={`w-full flex flex-col ${bodyMargin || 'my-4'} ${bodyPosition || 'justify-center items-center'}`}>
          {body}
        </div>

        <div className={`flex items-center gap-10 ${footerMargin} ${footerPosition || 'justify-evenly'}`}>
          {footer}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModalLayout;
