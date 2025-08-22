export interface Affiliate {
  TIP_DOC: string;
  DOC: string;
  PRIMER_APE: string;
  SEGUNDO_APE: string;
  PRIMER_NOM: string;
  SEGUNDO_NOM: string;
  FEC_NAC: string;
  EDAD: number;
  SEXO: string;
  TELEFONO: string;
  PRESTADOR: string;
  CATEGORIA: string;
  'CUOTA MOD': string;
}

export const REQUIRED_COLUMNS = [
  'TIP_DOC',
  'DOC', 
  'PRIMER_APE',
  'SEGUNDO_APE',
  'PRIMER_NOM',
  'SEGUNDO_NOM',
  'FEC_NAC',
  'EDAD',
  'SEXO',
  'TELEFONO',
  'PRESTADOR',
  'CATEGORIA',
  'CUOTA MOD'
];
