import { useState, useRef, type DragEvent } from 'react';

interface UploadZoneProps {
  onFiles?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
  hint?: string;
  className?: string;
}

export function UploadZone({
  onFiles,
  accept = 'image/*',
  multiple = true,
  maxSizeMB = 10,
  label = 'Arraste arquivos aqui',
  hint = 'ou clique para selecionar',
  className = '',
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.size <= maxSizeMB * 1024 * 1024
    );
    if (files.length > 0) onFiles?.(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) onFiles?.(files);
    e.target.value = '';
  };

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-2xl p-8
        flex flex-col items-center justify-center gap-3 cursor-pointer
        transition-all duration-200
        ${isDragging
          ? 'border-primary bg-primary-light scale-[1.01]'
          : 'border-gray-300 bg-gray-50 hover:border-primary/50 hover:bg-primary-light/30'
        }
        ${className}
      `}
      onDragOver={handleDrag}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-colors ${isDragging ? 'bg-primary/10' : 'bg-gray-100'}`}>
        📁
      </div>
      <div className="text-center">
        <p className={`text-sm font-semibold ${isDragging ? 'text-primary' : 'text-gray-700'}`}>{label}</p>
        <p className="text-xs text-gray-400 mt-1">{hint}</p>
        <p className="text-[10px] text-gray-400 mt-1">Máx. {maxSizeMB}MB por arquivo</p>
      </div>
    </div>
  );
}
