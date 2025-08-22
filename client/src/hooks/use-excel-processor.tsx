import { useState, useCallback } from 'react';
import { Affiliate, REQUIRED_COLUMNS } from '@/types/affiliate';
import { toast } from '@/hooks/use-toast';

declare global {
  interface Window {
    XLSX: any;
  }
}

export function useExcelProcessor() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateExcelStructure = useCallback((data: any[]): boolean => {
    if (!data || data.length === 0) return false;
    
    const columns = Object.keys(data[0]);
    const missingColumns = REQUIRED_COLUMNS.filter(col => !columns.includes(col));
    
    if (missingColumns.length > 0) {
      toast({
        variant: "destructive",
        title: "Estructura de archivo incorrecta",
        description: `Columnas faltantes: ${missingColumns.join(', ')}`,
      });
      return false;
    }
    
    return true;
  }, []);

  const processFile = useCallback(async (file: File): Promise<void> => {
    if (!file) return;
    
    setIsLoading(true);
    setCurrentFile(file);

    try {
      const data = await file.arrayBuffer();
      const workbook = window.XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      
      if (!sheetName) {
        throw new Error("El archivo Excel no contiene hojas.");
      }
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = window.XLSX.utils.sheet_to_json(worksheet, { defval: "" }) as Affiliate[];
      
      if (!validateExcelStructure(jsonData)) {
        throw new Error('El archivo no tiene la estructura requerida');
      }
      
      setAffiliates(jsonData);
      
      toast({
        title: "Archivo procesado correctamente",
        description: `${jsonData.length} registros cargados. Ya puedes buscar afiliados.`,
      });
      
    } catch (error) {
      console.error("Error al procesar el archivo:", error);
      toast({
        variant: "destructive",
        title: "Error al procesar archivo",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
      setAffiliates([]);
      setCurrentFile(null);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [validateExcelStructure]);

  const removeFile = useCallback(() => {
    setAffiliates([]);
    setCurrentFile(null);
    toast({
      title: "Archivo eliminado",
      description: "Puedes cargar un nuevo archivo.",
    });
  }, []);

  const searchAffiliate = useCallback((documento: string): Affiliate | null => {
    if (!documento.trim()) {
      toast({
        variant: "destructive",
        title: "Documento requerido",
        description: "Por favor ingrese un número de documento",
      });
      return null;
    }

    const affiliate = affiliates.find(a => 
      a.DOC && a.DOC.toString().trim() === documento.trim()
    );

    if (!affiliate) {
      toast({
        variant: "destructive",
        title: "Afiliado no encontrado",
        description: "No se encontró ningún registro con el documento proporcionado.",
      });
    }

    return affiliate || null;
  }, [affiliates]);

  return {
    affiliates,
    currentFile,
    isLoading,
    processFile,
    removeFile,
    searchAffiliate,
    hasAffiliates: affiliates.length > 0,
  };
}
