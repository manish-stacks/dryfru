import React, { useState } from "react";

const Upload = ({ label = "Upload Image", multiple = false }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previewFiles = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setUploadedFiles(previewFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      {/* Upload Input */}
      <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition duration-200">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <i className="fas fa-cloud-upload-alt text-blue-500 text-3xl mb-2"></i>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Drag & drop your files here or click to upload
          </span>
        </label>
      </div>

      {/* Preview Section */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Uploaded Images:
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
                {/* Remove Button */}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
