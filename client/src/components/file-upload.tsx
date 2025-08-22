import { useState, useRef, useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  currentFile: File | null;
  onRemoveFile: () => void;
  recordsCount: number;
}

export function FileUpload({ onFileSelect, currentFile, onRemoveFile, recordsCount }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  if (currentFile) {
    // File info display when file is loaded
    return (
      <div 
        className="bg-green-50 border border-primary rounded-xl p-4 mb-6"
        data-testid="file-info-section"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-check-circle text-success-color mr-3"></i>
            <div>
              <p className="font-medium text-primary-dark">Archivo cargado exitosamente</p>
              <p 
                className="text-sm text-gray-600"
                data-testid="file-name"
              >
                {currentFile.name}
              </p>
              <p 
                className="text-xs text-gray-500"
                data-testid="records-count"
              >
                {recordsCount.toLocaleString()} registros encontrados
              </p>
            </div>
          </div>
          <button 
            onClick={onRemoveFile}
            className="text-error-color hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
            data-testid="button-remove-file"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
        
      </div>
    );
  }

  // File upload area
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
        <i className="fas fa-file-excel text-primary mr-2"></i>
        Cargar Base de Datos
      </h2>
      
      <label 
        className={`block border-3 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer ${
          isDragOver 
            ? 'border-primary bg-green-50' 
            : 'border-medium-gray hover:border-primary hover:bg-green-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        data-testid="file-drop-area"
      >
        <div className="text-center">
          <i className="fas fa-cloud-upload-alt text-4xl text-primary mb-4"></i>
          <p className="text-lg font-medium text-text-color mb-2">
            Arrastra y suelta un archivo Excel aquí
          </p>
          <p className="text-sm text-gray-500">o haz clic para seleccionarlo</p>
          <p className="text-xs text-gray-400 mt-2">Formatos admitidos: .xlsx, .xls</p>
        </div>
      </label>
      
      <input 
        ref={fileInputRef}
        type="file" 
        accept=".xlsx,.xls" 
        className="hidden"
        onChange={handleFileChange}
        data-testid="input-file"
      />
    </div>
  );
}
