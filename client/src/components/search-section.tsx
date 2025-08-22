import { useState } from 'react';

interface SearchSectionProps {
  enabled: boolean;
  onSearch: (documento: string) => void;
}

export function SearchSection({ enabled, onSearch }: SearchSectionProps) {
  const [documento, setDocumento] = useState('');

  const handleSearch = () => {
    onSearch(documento);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div 
      className={`transition-all duration-400 ${
        enabled 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-50 pointer-events-none'
      }`}
      data-testid="search-section"
    >
      <h2 className="text-lg font-semibold text-primary-dark mb-4 flex items-center">
        <i className="fas fa-search text-primary mr-2"></i>
        Buscar Afiliado
      </h2>
      
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <input 
            type="text" 
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            placeholder="Digite el número de documento del afiliado"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
            onKeyPress={handleKeyPress}
            data-testid="input-documento"
          />
          <i className="fas fa-id-card absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        <button 
          onClick={handleSearch}
          disabled={!enabled}
          className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 hover:transform hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
          data-testid="button-search"
        >
          <i className="fas fa-search"></i>
          Consultar
        </button>
      </div>
    </div>
  );
}
