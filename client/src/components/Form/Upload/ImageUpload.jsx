import { Pen, Plus, Upload, X } from "lucide-react";
import { useState } from "react";

const ImageUpload = ({ onChange }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      if (onChange) onChange(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative flex flex-col items-center space-y-2 border border-gray-400 rounded-lg p-2 mb-4 shadow">
      {/* Preview */}
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-40 object-cover p-4 rounded-full border-4 border-green-600 shadow-lg transition-all"
          />
          <button
            title="Remove"
            onClick={() => setPreview(null)}
            className="absolute top-0 right-2 bg-white rounded-full p-1 shadow hover:bg-white cursor-pointer"
          >
            <X className="text-slate-800 w-5 h-5 opacity-70 hover:opacity-100" />
          </button>
        </div>
      ) : (
        <div className="w-40 h-40 flex items-center justify-center rounded-full border border-dashed text-gray-400">
          Profile Picture
        </div>
      )}

      {/* Upload Button */}
      <label className="flex items-center gap-2 bg-gradient-to-br from-green-800 to-green-500 px-5 py-2 rounded-full text-slate-100 cursor-pointer hover:bg-gradient-to-tr hover:from-green-800 hover:to-green-500 hover:shadow-lg active:opacity-50">
        {preview 
          ? (
              <>
                <Pen size={20}/>
                Change
              </>
            ) 
          : (
              <>
                <Upload size={20}/>
                Upload
              </>
            )
        }
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default ImageUpload;
