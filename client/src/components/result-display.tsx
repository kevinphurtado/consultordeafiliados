import { Affiliate } from '@/types/affiliate';

declare global {
  interface Window {
    html2canvas: any;
    jsPDF: any;
    jspdf: any;
  }
}

interface ResultDisplayProps {
  affiliate: Affiliate | null;
  notFound: boolean;
  onClearSearch: () => void;
}

export function ResultDisplay({ affiliate, notFound, onClearSearch }: ResultDisplayProps) {
  const exportToPDF = async () => {
    if (!affiliate) return;
    
    const resultCard = document.getElementById('result-card');
    if (!resultCard) return;

    try {
      // Wait a bit to ensure jsPDF is loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check multiple possible locations for jsPDF
      let jsPDFClass = null;
      if (window.jsPDF) {
        jsPDFClass = window.jsPDF;
      } else if (window.jspdf && window.jspdf.jsPDF) {
        jsPDFClass = window.jspdf.jsPDF;
      } else {
        alert('La librería PDF no está disponible. Por favor, recarga la página e intenta de nuevo.');
        return;
      }

      const canvas = await window.html2canvas(resultCard, { 
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const pdf = new jsPDFClass({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 10;
      
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`afiliado-${affiliate.DOC}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta de nuevo.');
    }
  };

  const exportToImage = async () => {
    if (!affiliate) return;
    
    const resultCard = document.getElementById('result-card');
    if (!resultCard) return;

    try {
      const canvas = await window.html2canvas(resultCard, { scale: 2 });
      const link = document.createElement('a');
      link.download = `afiliado-${affiliate.DOC}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error al generar imagen:', error);
    }
  };

  if (notFound) {
    return (
      <div 
        className="bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-slide-down"
        data-testid="error-message"
      >
        <i className="fas fa-user-times text-4xl text-red-500 mb-4"></i>
        <h3 className="text-lg font-semibold text-red-700 mb-2">Afiliado no encontrado</h3>
        <p className="text-red-600 mb-4">
          No se encontró ningún registro con el documento proporcionado.
        </p>
        <button 
          onClick={onClearSearch}
          className="text-primary hover:text-primary-dark font-medium"
          data-testid="button-clear-search"
        >
          <i className="fas fa-search mr-2"></i>
          Realizar nueva búsqueda
        </button>
      </div>
    );
  }

  if (!affiliate) return null;

  const currentTimestamp = new Date().toLocaleString('es-CO', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      id="result-card" 
      className="bg-gradient-to-br from-green-50 to-white border border-primary rounded-xl p-6 animate-slide-down"
      data-testid="result-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-primary-dark flex items-center">
          <i className="fas fa-user-check text-primary mr-3"></i>
          Información del Afiliado
        </h3>
        
        {/* Export Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={exportToPDF}
            className="bg-error-color text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
            data-testid="button-export-pdf"
          >
            <i className="fas fa-file-pdf"></i>
            PDF
          </button>
          <button 
            onClick={exportToImage}
            className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors duration-200 flex items-center gap-2"
            data-testid="button-export-image"
          >
            <i className="fas fa-image"></i>
            Imagen
          </button>
        </div>
      </div>

      {/* Affiliate Information Grid */}
      <div className="result-grid">
        {/* Personal Information */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-user text-primary mr-2"></i>
            Datos Personales
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo Doc:</span>
              <span 
                className="font-medium"
                data-testid="text-tip-doc"
              >
                {affiliate.TIP_DOC || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Documento:</span>
              <span 
                className="font-medium"
                data-testid="text-documento"
              >
                {affiliate.DOC || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nombres:</span>
              <span 
                className="font-medium"
                data-testid="text-nombres-completos"
              >
                {`${affiliate.PRIMER_NOM || ''} ${affiliate.SEGUNDO_NOM || ''}`.trim() || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Apellidos:</span>
              <span 
                className="font-medium"
                data-testid="text-apellidos-completos"
              >
                {`${affiliate.PRIMER_APE || ''} ${affiliate.SEGUNDO_APE || ''}`.trim() || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Demographic Information */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-birthday-cake text-primary mr-2"></i>
            Información Demográfica
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha Nacimiento:</span>
              <span 
                className="font-medium"
                data-testid="text-fecha-nacimiento"
              >
                {affiliate.FEC_NAC || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Edad:</span>
              <span 
                className="font-medium"
                data-testid="text-edad"
              >
                {affiliate.EDAD ? `${affiliate.EDAD} años` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sexo:</span>
              <span 
                className="font-medium"
                data-testid="text-sexo"
              >
                {affiliate.SEXO || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Teléfono:</span>
              <span 
                className="font-medium"
                data-testid="text-telefono"
              >
                {affiliate.TELEFONO || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Affiliation Information */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-hospital text-primary mr-2"></i>
            Información de Afiliación
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Prestador:</span>
              <span 
                className="font-medium"
                data-testid="text-prestador"
              >
                {affiliate.PRESTADOR || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Categoría:</span>
              <span 
                className="font-medium"
                data-testid="text-categoria"
              >
                {affiliate.CATEGORIA || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cuota Moderadora:</span>
              <span 
                className="font-medium"
                data-testid="text-cuota-mod"
              >
                {affiliate['CUOTA MOD'] || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Timestamp */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Consulta realizada el <span data-testid="text-timestamp">{currentTimestamp}</span>
        </p>
      </div>
    </div>
  );
}
