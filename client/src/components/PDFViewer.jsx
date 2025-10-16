import { useEffect, useState } from "react";
import { X } from "lucide-react";

const PDFViewer = ({ file, onClose }) => {
  const [showClose, setShowClose] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!file) return null;

  // Detect type
  const lowerFile = file.toLowerCase();
  const isLocal = file.includes("localhost") || file.includes("127.0.0.1");
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(lowerFile);
  const isPDF = /\.pdf$/i.test(lowerFile);
  const isDocxOrPptx = /\.(docx|pptx)$/i.test(lowerFile);

  const useGoogleDocs = !isLocal && (isPDF || isDocxOrPptx);
  const googleDocsUrl = useGoogleDocs
    ? `https://docs.google.com/gview?url=${encodeURIComponent(file)}&embedded=true`
    : null;

  const renderContent = () => {
    if (isImage) {
      return (
        <img src={file} alt="Preview" className="w-full h-full object-contain bg-black" />
      );
    } else if (useGoogleDocs) {
      return (
        <iframe
          src={googleDocsUrl}
          width="100%"
          height="100%"
          className="border-none"
          title="Google Docs Viewer"
          allowFullScreen
        />
      );
    } else if (isPDF) {
      return (
        <iframe
          src={file}
          width="100%"
          height="100%"
          className="border-none"
          title="PDF Viewer"
          allowFullScreen
        />
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-600 text-center p-8 bg-white">
          <p>Preview not available for this file type.</p>
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-blue-600 underline"
          >
            Open file directly
          </a>
        </div>
      );
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/90 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-screen h-screen flex justify-center items-center overflow-hidden"
      >
        {/* Content */}
        {renderContent()}

        {/* Hover detector wrapper (no blocking clicks) */}
        <div className="absolute top-0 left-0 w-full h-20 pointer-events-none z-20">
          {/* Active sensor only in center */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 pointer-events-auto"
            onMouseEnter={() => setShowClose(true)}
            onMouseLeave={(e) => {
              if (!e.relatedTarget || !e.relatedTarget.closest("#close-btn")) {
                setShowClose(false);
              }
            }}
          />
        </div>

        {/* Center Close Button */}
        <button
          id="close-btn"
          onClick={onClose}
          onMouseEnter={() => setShowClose(true)}
          onMouseLeave={() => setShowClose(false)}
          className={`absolute top-6 left-1/2 -translate-x-1/2 text-white border border-slate-500 bg-black/50 hover:bg-black/70 transition-all p-3 rounded-full z-30 cursor-pointer ${
            showClose ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close preview"
        >
          <X size={22} />
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;
