import React, { ChangeEvent, useRef } from 'react';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_MB } from '../constants';

interface FileUploadProps {
  onFileSelect: (base64: string) => void;
  selectedImage: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert('Only PNG, JPG, and WebP images are allowed.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File size must be less than ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onFileSelect(base64String);
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        1. 上传您的刺绣补丁图片
      </label>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={ALLOWED_FILE_TYPES.join(',')}
        className="hidden"
      />

      <div 
        onClick={triggerUpload}
        className={`
          relative w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200
          ${selectedImage 
            ? 'border-indigo-300 bg-gray-50' 
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }
        `}
      >
        {selectedImage ? (
          <div className="relative w-full h-full p-4 flex items-center justify-center">
             <img 
               src={selectedImage} 
               alt="Uploaded patch" 
               className="max-h-full max-w-full object-contain drop-shadow-md"
             />
             <div className="absolute bottom-2 right-2 bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-gray-600 shadow-sm border border-gray-200">
               点击更换
             </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">
              点击上传图片
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, WebP (最大 5MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};