import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface SearchHistoryItem {
  id: string;
  searchType: string;
  searchParams: any;
  resultFound: string;
  resultData?: any;
  timestamp: string;
}

export function SearchHistory() {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['/api/search-history'],
    queryFn: async () => {
      const response = await fetch('/api/search-history?limit=20');
      if (!response.ok) {
        throw new Error('Failed to fetch search history');
      }
      return response.json();
    },
  });

  const formatSearchParams = (searchType: string, params: any) => {
    if (searchType === 'simple') {
      return `Documento: ${params.documento}`;
    } else {
      const filters = [];
      if (params.documento) filters.push(`Doc: ${params.documento}`);
      if (params.nombres) filters.push(`Nombres: ${params.nombres}`);
      if (params.apellidos) filters.push(`Apellidos: ${params.apellidos}`);
      if (params.telefono) filters.push(`Tel: ${params.telefono}`);
      if (params.prestador) filters.push(`Prestador: ${params.prestador}`);
      if (params.categoria) filters.push(`Categoría: ${params.categoria}`);
      return filters.join(', ') || 'Sin filtros';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="bg-gray-50 rounded-xl border border-gray-200">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors rounded-xl"
          data-testid="button-toggle-history"
        >
          <div className="flex items-center">
            <i className="fas fa-history text-gray-600 mr-3"></i>
            <h3 className="font-semibold text-gray-700">Historial de Búsquedas</h3>
            <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
              {history.length}
            </span>
          </div>
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-600`}></i>
        </button>
        
        {isExpanded && (
          <div 
            className="border-t border-gray-200 max-h-80 overflow-y-auto"
            data-testid="history-list"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Cargando historial...
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {history.map((item: SearchHistoryItem) => (
                  <div 
                    key={item.id} 
                    className="p-4 hover:bg-gray-50 transition-colors"
                    data-testid={`history-item-${item.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-1 rounded ${
                            item.searchType === 'simple' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.searchType === 'simple' ? 'Rápida' : 'Avanzada'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            item.resultFound === 'true' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.resultFound === 'true' ? 'Encontrado' : 'No encontrado'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">
                          {formatSearchParams(item.searchType, item.searchParams)}
                        </p>
                        {item.resultFound === 'true' && item.resultData && (
                          <p className="text-xs text-gray-600">
                            Resultado: {item.resultData.PRIMER_NOM} {item.resultData.PRIMER_APE} (Doc: {item.resultData.DOC})
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 ml-4 text-right">
                        {formatTimestamp(item.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}