const PDFViewer = ({ file, onClose }) => {
  return (
    <div onClick={onClose} className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
      <div className='relative bg-white rounded-lg w-[90%] max-w-5xl h-[100%] overflow-hidden'>
        {/* Iframe */}
        <iframe
          src={file}
          width='100%'
          height='100%'
          className='border-none'
          title='PDF Viewer'
        />
      </div>
    </div>
  );
};

export default PDFViewer;
