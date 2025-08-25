import { Pen, Upload, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { showErrorToast } from "../../../utils/toastNotification";

const ImageUpload = (
  { 
    onChange = () => {}, 
    setProfilePic = () => {}, 
    setUpdatedProfilePic,
    imageValue,
    allowRemove = true // Default true for Add User
  }
) => {
  const fileRef = useRef();
  const profile_pic_path = import.meta.env.VITE_PROFILE_PIC_PATH;

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (imageValue) {
      setPreview(`${profile_pic_path}/${imageValue}`); // Show existing image from props
    }
  }, [imageValue, profile_pic_path]);

  const handleFileChange = (e) => {
    const MAX_MB = 5; // 5 MB limit
    const file = e.target.files[0];
    if (!file) return;

    // Limit file to 5 MB
    if (file.size > MAX_MB * 1024 * 1024) {
      return showErrorToast(`Image should not exceed ${MAX_MB} MB.`);
    }
    
    // Allowed only image
    if (!file.type.startsWith('image/')) {
      return showErrorToast('Only image files are allowed.');
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      if (onChange) onChange(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setProfilePic(null);
    setUpdatedProfilePic?.(null);
    if (fileRef.current) fileRef.current.value = null; // Reset image input
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex flex-col w-1/2 items-center space-y-2 border border-gray-400 rounded-lg p-2 mb-4 shadow">
        {/* Image Preview */}
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full border-4 border-green-600 shadow transition-all"
            />
            {allowRemove && ( // Show remove button only if allowed
              <button
                title="Remove"
                onClick={handleRemove}
                className="absolute top-0 right-0 bg-slate-100 border border-slate-600/20 rounded-full p-1 shadow hover:bg-slate-50 cursor-pointer transition-all"
              >
                <X className="text-slate-800 w-4 h-4 opacity-80 hover:opacity-100" />
              </button>
            )}
          </div>
        ) : (
          <div className="w-32 h-32 flex items-center justify-center rounded-full border border-dashed text-gray-400">
            Profile Picture
          </div>
        )}

        {/* Upload Button */}
        <label className="flex items-center gap-2 bg-gradient-to-br from-green-800 to-green-500 px-5 py-2 rounded-full text-slate-100 cursor-pointer hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500 hover:shadow-lg active:opacity-50">
          {preview ? (
            <>
              <Pen size={20} />
              Change
            </>
          ) : (
            <>
              <Upload size={20} />
              Upload
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileRef}
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
