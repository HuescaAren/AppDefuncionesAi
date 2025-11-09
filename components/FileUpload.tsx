
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  }, [onFileUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg h-full flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-100">Subir Documento</h2>
      <label
        htmlFor="file-upload"
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
                    ${isDragging ? 'border-cyan-400 bg-cyan-900/30' : 'border-gray-600 hover:border-blue-400 bg-gray-700/50 hover:bg-gray-700/80'}`}
      >
        <div 
          className="absolute inset-0"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon className={`w-10 h-10 mb-3 transition-colors ${isDragging ? 'text-cyan-300' : 'text-gray-400'}`} />
            <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
            </p>
            <p className="text-xs text-gray-500">Imágenes (JPG, PNG, WEBP, GIF)</p>
        </div>
        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/jpeg,image/png,image/webp,image/gif" disabled={isLoading} />
      </label>
      {isLoading && <p className="mt-4 text-center text-cyan-400 animate-pulse">Procesando con IA...</p>}
    </div>
  );
};

export default FileUpload;
