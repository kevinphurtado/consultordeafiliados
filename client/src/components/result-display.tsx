import { useState } from 'react';
import { Affiliate } from '@/types/affiliate';
import { PrintableProof } from './printable-proof';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

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

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export function ResultDisplay({ affiliate, notFound, onClearSearch }: ResultDisplayProps) {
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [ingresoDate, setIngresoDate] = useState(getTodayDateString());
  const [egresoDate, setEgresoDate] = useState(getTodayDateString());
  const [diagnostico, setDiagnostico] = useState('');

  const handleSetUpPrint = () => {
    setIsPrintDialogOpen(false);
    setTimeout(() => {
      window.print();
    }, 50);
  };

  const commonExportLogic = async (element: HTMLElement) => {
    // Guardamos las clases originales para restaurarlas después
    const originalClasses = element.className;
    // Eliminamos las clases de gradiente y aseguramos un fondo blanco
    element.className = originalClasses
      .replace('bg-gradient-to-br', '')
      .replace('from-green-50', '')
      .replace('to-white', '') + ' bg-white';

    try {
      const canvas = await window.html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      return canvas;
    } finally {
      // Restauramos las clases originales sin importar si hubo un error
      element.className = originalClasses;
    }
  };
  
  const exportToPDF = async () => {
    if (!affiliate) return;
    const resultCard = document.getElementById('result-card');
    if (!resultCard) return;

    try {
      const canvas = await commonExportLogic(resultCard);
      let jsPDFClass = window.jsPDF || (window.jspdf && window.jspdf.jsPDF);
      if (!jsPDFClass) {
        alert('La librería PDF no está disponible.');
        return;
      }
      
      const pdf = new jsPDFClass({ orientation: 'portrait', unit: 'mm', format: 'a4' });
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
      alert('Error al generar el PDF.');
    }
  };

  const exportToImage = async () => {
    if (!affiliate) return;
    const resultCard = document.getElementById('result-card');
    if (!resultCard) return;

    try {
      const canvas = await commonExportLogic(resultCard);
      const link = document.createElement('a');
      link.download = `afiliado-${affiliate.DOC}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error al generar imagen:', error);
      alert('Hubo un error al generar la imagen.');
    }
  };

  if (notFound) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-slide-down no-print">
        <i className="fas fa-user-times text-4xl text-red-500 mb-4"></i>
        <h3 className="text-lg font-semibold text-red-700 mb-2">Afiliado no encontrado</h3>
        <p className="text-red-600 mb-4">No se encontró ningún registro con el documento proporcionado.</p>
        <button onClick={onClearSearch} className="text-primary hover:text-primary-dark font-medium">
          <i className="fas fa-search mr-2"></i> Realizar nueva búsqueda
        </button>
      </div>
    );
  }

  if (!affiliate) return null;

  const currentTimestamp = new Date().toLocaleString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <>
      <div className="hidden print:block">
        {affiliate && (
          <PrintableProof 
            affiliate={affiliate}
            ingresoDate={ingresoDate}
            egresoDate={egresoDate}
            diagnostico={diagnostico}
          />
        )}
      </div>

      <div id="result-card" className="bg-gradient-to-br from-green-50 to-white border border-primary rounded-xl p-6 animate-slide-down no-print">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-primary-dark flex items-center">
            <i className="fas fa-user-check text-primary mr-3"></i>
            Información del Afiliado
          </h3>
          <div className="flex flex-wrap gap-2 justify-end">
            <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Imprimir Comprobante</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Configurar Impresión</DialogTitle>
                  <DialogDescription>Ajusta los detalles antes de imprimir.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ingreso" className="text-right">Ingreso</Label>
                    <Input id="ingreso" type="date" value={ingresoDate} onChange={(e) => setIngresoDate(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="egreso" className="text-right">Egreso</Label>
                    <Input id="egreso" type="date" value={egresoDate} onChange={(e) => setEgresoDate(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="diagnostico" className="text-right">Diagnóstico</Label>
                    <Input id="diagnostico" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} className="col-span-3" placeholder="(Opcional)" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSetUpPrint}><i className="fas fa-print mr-2"></i>Imprimir</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={exportToPDF} variant="destructive" className="flex items-center gap-2">
              <i className="fas fa-file-pdf"></i> PDF
            </Button>
            <Button onClick={exportToImage} className="bg-secondary hover:bg-primary-dark flex items-center gap-2">
              <i className="fas fa-image"></i> Imagen
            </Button>
          </div>
        </div>
        
        <div className="result-grid">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center"><i className="fas fa-user text-primary mr-2"></i>Datos Personales</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Tipo Doc:</span><span className="font-medium">{affiliate.TIP_DOC || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Documento:</span><span className="font-medium">{affiliate.DOC || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Nombres:</span><span className="font-medium">{`${affiliate.PRIMER_NOM || ''} ${affiliate.SEGUNDO_NOM || ''}`.trim() || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Apellidos:</span><span className="font-medium">{`${affiliate.PRIMER_APE || ''} ${affiliate.SEGUNDO_APE || ''}`.trim() || 'N/A'}</span></div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center"><i className="fas fa-birthday-cake text-primary mr-2"></i>Información Demográfica</h4>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Fecha Nacimiento:</span><span className="font-medium">{affiliate.FEC_NAC || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Edad:</span><span className="font-medium">{affiliate.EDAD ? `${affiliate.EDAD} años` : 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Sexo:</span><span className="font-medium">{affiliate.SEXO || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Teléfono:</span><span className="font-medium">{affiliate.TELEFONO || 'N/A'}</span></div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center"><i className="fas fa-hospital text-primary mr-2"></i>Información de Afiliación</h4>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Prestador:</span><span className="font-medium">{affiliate.PRESTADOR || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Categoría:</span><span className="font-medium">{affiliate.CATEGORIA || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Cuota Moderadora:</span><span className="font-medium">{affiliate['CUOTA MOD'] || 'N/A'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}