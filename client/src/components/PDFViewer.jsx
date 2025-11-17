import { useEffect } from 'react';

const PDFViewer = ({ file, onClose = () => {} }) => {
  useEffect(() => {
    if (!file) return;

    let objectUrl = null;
    const isString = typeof file === 'string';

    if (!isString && (file instanceof Blob || (typeof File !== 'undefined' && file instanceof File))) {
      try {
        objectUrl = URL.createObjectURL(file);
      } catch (e) {
        console.error('PDFViewer: createObjectURL failed', e);
        objectUrl = null;
      }
    }

    const fileUrl = isString ? file : objectUrl;
    if (!fileUrl) {
      try { onClose(); } catch (_) {}
      return;
    }

    const lower = String(fileUrl).toLowerCase();
    const isLocal = lower.includes('localhost') || lower.includes('127.0.0.1') || lower.startsWith('file:') || lower.startsWith('blob:');
    const isDocLike = /\.(pdf|docx|doc|pptx|ppt|xls|xlsx)$/i.test(lower);
    const googleDocsUrl = !isLocal && isDocLike
      ? `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`
      : null;

    const urlToOpen = googleDocsUrl ?? fileUrl;

    try {
      const w = window.open(urlToOpen, '_blank', 'noopener,noreferrer');
      if (w) {
        try { w.focus(); } catch (_) {}
      }
    } catch (err) {
      console.error('PDFViewer: window.open failed', err);
    } finally {
      // close the modal immediately — no overlay
      try { onClose(); } catch (_) {}
    }

    return () => {
      if (objectUrl) {
        try { URL.revokeObjectURL(objectUrl); } catch (_) {}
      }
    };
  }, [file, onClose]);

  return null;
};

export default PDFViewer;