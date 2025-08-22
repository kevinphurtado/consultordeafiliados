import { useState } from 'react';
import { Affiliate } from '@/types/affiliate';

interface AdvancedSearchProps {
  enabled: boolean;
  affiliates: Affiliate[];
  onSearch: (results: Affiliate[]) => void;
  onToggleMode: () => void;
  isAdvanced: boolean;
}

export function AdvancedSearch({ enabled, affiliates, onSearch, onToggleMode, isAdvanced }: AdvancedSearchProps) {
  const [searchParams, setSearchParams] = useState({
    documento: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    prestador: '',
    categoria: ''
  });

  const handleAdvancedSearch = () => {
    const results = affiliates.filter(affiliate => {
      const matchesDocumento = !searchParams.documento || 
        affiliate.DOC?.toString().toLowerCase().includes(searchParams.documento.toLowerCase());
      
      const fullName = `${affiliate.PRIMER_NOM || ''} ${affiliate.SEGUNDO_NOM || ''}`.toLowerCase();
      const matchesNombres = !searchParams.nombres || 
        fullName.includes(searchParams.nombres.toLowerCase());
      
      const fullLastname = `${affiliate.PRIMER_APE || ''} ${affiliate.SEGUNDO_APE || ''}`.toLowerCase();
      const matchesApellidos = !searchParams.apellidos || 
        fullLastname.includes(searchParams.apellidos.toLowerCase());
      
      const matchesTelefono = !searchParams.telefono || 
        affiliate.TELEFONO?.toString().toLowerCase().includes(searchParams.telefono.toLowerCase());
      
      const matchesPrestador = !searchParams.prestador || 
        affiliate.PRESTADOR?.toLowerCase().includes(searchParams.prestador.toLowerCase());
      
      const matchesCategoria = !searchParams.categoria || 
        affiliate.CATEGORIA?.toLowerCase().includes(searchParams.categoria.toLowerCase());

      return matchesDocumento && matchesNombres && matchesApellidos && 
             matchesTelefono && matchesPrestador && matchesCategoria;
    });

    onSearch(results);
  };

  const handleClear = () => {
    setSearchParams({
      documento: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      prestador: '',
      categoria: ''
    });
  };

  const hasAnyFilter = Object.values(searchParams).some(value => value.trim() !== '');

  return (
    <div 
      className={`transition-all duration-400 ${
        enabled 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-50 pointer-events-none'
      }`}
      data-testid="advanced-search-section"
    >
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <i className="fas fa-search-plus text-primary mr-3 text-xl"></i>
            <h2 className="text-xl font-semibold text-primary-dark">Búsqueda Avanzada</h2>
            <p className="text-sm text-gray-600 ml-4">Busca por múltiples criterios</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onToggleMode}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !isAdvanced 
                  ? 'bg-success-color text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              data-testid="button-quick-search"
            >
              <i className="fas fa-bolt mr-2"></i>
              Búsqueda Rápida
            </button>
            <button 
              onClick={onToggleMode}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isAdvanced 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              data-testid="button-advanced-filters"
            >
              <i className="fas fa-filter mr-2"></i>
              Filtros Avanzados
            </button>
          </div>
        </div>

        {isAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Documento */}
            <div className="relative">
              <input 
                type="text" 
                value={searchParams.documento}
                onChange={(e) => setSearchParams(prev => ({ ...prev, documento: e.target.value }))}
                placeholder="Número de cédula"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="input-documento-advanced"
              />
              <i className="fas fa-id-card absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            {/* Nombres */}
            <div className="relative">
              <input 
                type="text" 
                value={searchParams.nombres}
                onChange={(e) => setSearchParams(prev => ({ ...prev, nombres: e.target.value }))}
                placeholder="Nombre completo"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="input-nombres"
              />
              <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            {/* Apellidos */}
            <div className="relative">
              <input 
                type="text" 
                value={searchParams.apellidos}
                onChange={(e) => setSearchParams(prev => ({ ...prev, apellidos: e.target.value }))}
                placeholder="Apellidos"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="input-apellidos"
              />
              <i className="fas fa-users absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            {/* Teléfono */}
            <div className="relative">
              <input 
                type="text" 
                value={searchParams.telefono}
                onChange={(e) => setSearchParams(prev => ({ ...prev, telefono: e.target.value }))}
                placeholder="Teléfono"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="input-telefono"
              />
              <i className="fas fa-phone absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            {/* Prestador */}
            <div className="relative">
              <input 
                type="text" 
                value={searchParams.prestador}
                onChange={(e) => setSearchParams(prev => ({ ...prev, prestador: e.target.value }))}
                placeholder="Prestador"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="input-prestador"
              />
              <i className="fas fa-hospital absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>

            {/* Categoría */}
            <div className="relative">
              <input 
                type="text" 
                value={searchParams.categoria}
                onChange={(e) => setSearchParams(prev => ({ ...prev, categoria: e.target.value }))}
                placeholder="Categoría"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                data-testid="input-categoria"
              />
              <i className="fas fa-tag absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isAdvanced && (
          <div className="flex gap-4">
            <button 
              onClick={handleAdvancedSearch}
              disabled={!enabled || !hasAnyFilter}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 hover:transform hover:-translate-y-1 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              data-testid="button-search-advanced"
            >
              <i className="fas fa-search"></i>
              Buscar Afiliado
            </button>
            <button 
              onClick={handleClear}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
              data-testid="button-clear-advanced"
            >
              <i className="fas fa-eraser"></i>
              Limpiar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}