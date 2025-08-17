const ModalLayout = ({ 
  onClose, 
  header, 
  body, 
  hasHR = true,
  footer,
  headerMargin, 
  headerPosition,
  bodyMargin,
  bodyPosition, 
  footerMargin,
  footerPosition 
}) => {

  return (
    <div className="h-full fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="relative w-full md:max-w-xl bg-gradient-to-r from-gray-100 to-white rounded-lg shadow-2xl px-8 pt-4 animate-fadeIn">

        {/* Close Button */}
        <button 
          onClick={() => {
            onClose?.();
          }}
        >
        </button>

        {/* Header */}
        <div className={`flex text-gray-700 ${headerMargin || 'mt-4'} ${headerPosition || 'justify-center items-center max-md:items-center md:flex-row flex-col'}`}>
          {header}
        </div>

        {/* Body */}
        <div className={`w-full flex flex-col ${bodyMargin || 'my-4 md:my-8'} ${bodyPosition || 'justify-center items-center'}`}>
          {body}
        </div>
        {hasHR && (<hr className='text-gray-300'></hr>)}

        {/* Footer */}
        <div className={`py-4 flex items-center ${footerMargin} ${footerPosition || 'justify-evenly'}`}>
          {footer}
        </div>
      </div>
    </div>
  );
};

export default ModalLayout;
