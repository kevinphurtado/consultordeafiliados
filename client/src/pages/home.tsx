import { useState } from 'react';
import { useExcelProcessor } from '@/hooks/use-excel-processor';
import { useSearchHistory } from '@/hooks/use-search-history';
import { FileUpload } from '@/components/file-upload';
import { SearchSection } from '@/components/search-section';
import { AdvancedSearch } from '@/components/advanced-search';
import { SearchHistory } from '@/components/search-history';
import { ResultDisplay } from '@/components/result-display';
import { Loader } from '@/components/loader';
import { Affiliate } from '@/types/affiliate';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Home() {
  const {
    currentFile,
    isLoading,
    processFile,
    removeFile,
    searchAffiliate,
    hasAffiliates,
    affiliates,
  } = useExcelProcessor();

  const { addToHistory } = useSearchHistory();

  const [searchResult, setSearchResult] = useState<{
    affiliate: Affiliate | null;
    affiliates: Affiliate[];
    notFound: boolean;
    isMultipleResults: boolean;
  }>({ affiliate: null, affiliates: [], notFound: false, isMultipleResults: false });

  const [searchMode, setSearchMode] = useState<'simple' | 'advanced'>('simple');
  const [isChangelogOpen, setIsChangelogOpen] = useState(false); // Estado para el popup

  const handleSearch = (documento: string) => {
    const result = searchAffiliate(documento);
    
    addToHistory({
      searchType: 'simple',
      searchParams: { documento },
      resultFound: !!result,
      resultData: result || undefined,
    });
    
    setSearchResult({
      affiliate: result,
      affiliates: result ? [result] : [],
      notFound: !result,
      isMultipleResults: false,
    });
  };

  const handleAdvancedSearch = (results: Affiliate[]) => {
    const hasResults = results.length > 0;
    
    addToHistory({
      searchType: 'advanced',
      searchParams: { resultCount: results.length },
      resultFound: hasResults,
      resultData: results[0] || undefined,
    });
    
    setSearchResult({
      affiliate: results.length === 1 ? results[0] : null,
      affiliates: results,
      notFound: !hasResults,
      isMultipleResults: results.length > 1,
    });
  };

  const toggleSearchMode = () => {
    setSearchMode(prev => prev === 'simple' ? 'advanced' : 'simple');
    handleClearSearch();
  };

  const handleClearSearch = () => {
    setSearchResult({ 
      affiliate: null, 
      affiliates: [], 
      notFound: false, 
      isMultipleResults: false 
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-light-gray">
      <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl animate-fade-in relative overflow-hidden">
        
        <Loader visible={isLoading} message="Procesando archivo..." />
        
        <header 
          className="text-center p-8 border-b border-gray-100"
          data-testid="header"
        >
          <img 
            src="https://i.imgur.com/bwIgn71.png" 
            alt="Logo" 
            className="max-w-48 mx-auto mb-4"
            data-testid="img-logo"
          />
          <h1 className="text-2xl font-bold text-primary-dark mb-2">
            CONSULTOR DE AFILIADOS
          </h1>
          <p className="text-text-color">
            Sistema de consulta de base de datos de afiliados en Excel
          </p>
        </header>

        <div className="p-8">
          
          <FileUpload 
            onFileSelect={processFile}
            currentFile={currentFile}
            onRemoveFile={removeFile}
            recordsCount={affiliates.length}
          />

          {hasAffiliates && <SearchHistory />}

          {searchMode === 'simple' ? (
            <SearchSection 
              enabled={hasAffiliates}
              onSearch={handleSearch}
            />
          ) : (
            <AdvancedSearch 
              enabled={hasAffiliates}
              affiliates={affiliates}
              onSearch={handleAdvancedSearch}
              onToggleMode={toggleSearchMode}
              isAdvanced={searchMode === 'advanced'}
            />
          )}

          {hasAffiliates && searchMode === 'simple' && (
            <div className="mb-6 text-center">
              <button
                onClick={toggleSearchMode}
                className="text-primary hover:text-primary-dark font-medium text-sm flex items-center justify-center mx-auto gap-2"
                data-testid="button-switch-advanced"
              >
                <i className="fas fa-search-plus"></i>
                Cambiar a búsqueda avanzada
              </button>
            </div>
          )}

          {(searchResult.affiliate || searchResult.affiliates.length > 0 || searchResult.notFound) && (
            <div data-testid="results-section">
              {searchResult.isMultipleResults ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 animate-slide-down" data-testid="multiple-results">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                      <i className="fas fa-users text-blue-600 mr-3"></i>
                      Múltiples Resultados Encontrados
                    </h3>
                    <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                      {searchResult.affiliates.length} resultados
                    </span>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {searchResult.affiliates.map((affiliate, index) => (
                      <div 
                        key={index}
                        className="bg-white p-4 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => setSearchResult({
                          affiliate,
                          affiliates: [affiliate],
                          notFound: false,
                          isMultipleResults: false
                        })}
                        data-testid={`result-item-${index}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {affiliate.PRIMER_NOM} {affiliate.SEGUNDO_NOM} {affiliate.PRIMER_APE} {affiliate.SEGUNDO_APE}
                            </p>
                            <p className="text-sm text-gray-600">Doc: {affiliate.DOC} | Tel: {affiliate.TELEFONO}</p>
                            <p className="text-xs text-gray-500">
                              {affiliate.PRESTADOR} - {affiliate.CATEGORIA}
                            </p>
                          </div>
                          <i className="fas fa-chevron-right text-blue-400"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button 
                      onClick={handleClearSearch}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      data-testid="button-clear-multiple-results"
                    >
                      <i className="fas fa-search mr-2"></i>
                      Realizar nueva búsqueda
                    </button>
                  </div>
                </div>
              ) : (
                <ResultDisplay 
                  affiliate={searchResult.affiliate}
                  notFound={searchResult.notFound}
                  onClearSearch={handleClearSearch}
                />
              )}
            </div>
          )}

        </div>

        <footer 
          className="px-8 py-6 border-t border-gray-100 bg-gray-50 text-center"
          data-testid="footer"
        >
          <div className="text-xs text-gray-500">
            © 2025 Desarrollado por el equipo de <a href="https://chococreativo.com.co/proyectos" target="_blank">Chocó Creativo 🖤</a> | 
            <button
              onClick={() => setIsChangelogOpen(true)}
              className="text-primary hover:underline font-medium ml-1"
            >
              Versión 4.0
            </button>
          </div>
        </footer>

        {/* Ventana emergente de Novedades */}
        <Dialog open={isChangelogOpen} onOpenChange={setIsChangelogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novedades de la Versión 4.0</DialogTitle>
              <DialogDescription>
                Aquí están las últimas mejoras y características que hemos añadido.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <h4 className="font-semibold">Búsqueda Avanzada Mejorada</h4>
              <p className="text-sm text-muted-foreground">
                Ahora puedes buscar afiliados por múltiples criterios a la vez, como
                nombres, apellidos, teléfono y más.
              </p>

              <h4 className="font-semibold">Exportación a PDF e Imagen</h4>
              <p className="text-sm text-muted-foreground">
                Exporta fácilmente los resultados de tus búsquedas a formatos PDF o
                PNG para compartir o archivar la información.
              </p>
              <h4 className="font-semibold">Interfaz Renovada</h4>
              <p className="text-sm text-muted-foreground">
                Hemos rediseñado la aplicación para que sea más intuitiva y agradable
                de usar.
              </p>
              <h4 className="font-semibold">Impresión de comprobante</h4>
              <p className="text-sm text-muted-foreground">
                Ahora puedes imprimir el comprobante de prestación de servicio,
                solo tienes que configurar la fecha y el diágnostico.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsChangelogOpen(false)}>Entendido</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
