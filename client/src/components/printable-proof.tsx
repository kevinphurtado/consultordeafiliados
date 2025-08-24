import { Affiliate } from '@/types/affiliate';

interface PrintableProofProps {
  affiliate: Affiliate;
  ingresoDate: string;
  egresoDate: string;
  diagnostico: string;
}

const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export function PrintableProof({ affiliate, ingresoDate, egresoDate, diagnostico }: PrintableProofProps) {
  const fullName = `${affiliate.PRIMER_NOM || ''} ${affiliate.SEGUNDO_NOM || ''} ${affiliate.PRIMER_APE || ''} ${affiliate.SEGUNDO_APE || ''}`.replace(/\s+/g, ' ').trim();

  const styles = {
    page: {
      backgroundColor: 'white', color: 'black', fontFamily: 'Arial, sans-serif',
      display: 'flex', flexDirection: 'column', height: '26.5cm',
    } as React.CSSProperties,
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    } as React.CSSProperties,
    title: {
      textAlign: 'center' as const, fontWeight: 'bold' as const, fontSize: '14px',
      margin: '1rem 0', color: '#026937',
    },
    p: { fontSize: '11px', lineHeight: '1.5', marginBottom: '1rem' },
    fieldRow: {
      display: 'flex', alignItems: 'flex-end', marginBottom: '0.5rem', maxWidth: '85%',
    },
    fieldLabel: {
      width: '220px', flexShrink: 0, fontWeight: 'bold' as const, fontSize: '11px',
    },
    fieldValue: {
      borderBottom: '1px solid black', width: '100%', paddingLeft: '8px',
      fontSize: '11px', minHeight: '20px',
    },
    signatureBlock: {
      marginTop: '2.5rem', fontSize: '11px',
    },
    signatureLine: {
      borderBottom: '1px solid black', height: '25px', marginBottom: '4px', maxWidth: '320px'
    },
    footer: {
      position: 'absolute', bottom: '43px', left: '1.6cm', right: '1.6cm',
      textAlign: 'center' as const, fontSize: '8px', lineHeight: '1.2',
      borderTop: '1px solid black', paddingTop: '8px',
    },
  };

  return (
    <div id="printable-area" style={styles.page}>
      <header style={styles.header}>
        <img src="https://comfachoco.com/comfachocoepsweb/public/portalWebEps/img/core-img/logotipoo153.png" alt="Logo COMFACHOCÓ" style={{ width: '130px' }} />
        <div style={{ textAlign: 'right', fontSize: '9px', lineHeight: '1.1' }}>
          Caja de Compensación Familiar del Chocó, Comfachoco<br/>
          NIT: 891 600 091–8
        </div>
      </header>

      <main style={{ flexGrow: 1 }}>
        <h1 style={styles.title}>
          FORMATO DE PRESTACIÓN DE SERVICIOS DE SALUD SEGÚN RESOLUCIÓN 3047 DE 2008
        </h1>
        <p style={styles.p}>
          Por medio del presente documento se certifica que en la IPS de COMFACHOCÓ se prestaron los servicios de salud al paciente relacionado a continuación:
        </p>
        
        <div style={{ fontSize: '11px', lineHeight: '2.5' }}>
          <div style={styles.fieldRow}>
            <strong style={styles.fieldLabel}>Nombre Completo:</strong>
            <span style={styles.fieldValue}>{fullName}</span>
          </div>
          <div style={styles.fieldRow}>
            <strong style={styles.fieldLabel}>Documento de Identificación No:</strong>
            <span style={styles.fieldValue}>{affiliate.DOC}</span>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginTop: '1rem' }}>
            <tbody>
            <tr>
                <td style={{ fontWeight: 'bold', width: '220px' }}>Fecha de ingreso:</td>
                <td style={{ width: '150px', border: '1px solid black', textAlign: 'center', padding: '4px' }}>{formatDateForDisplay(ingresoDate)}</td>
                <td></td>
            </tr>
            <tr style={{ height: '0.5rem' }}><td colSpan={3}></td></tr>
            <tr>
                <td style={{ fontWeight: 'bold', width: '220px' }}>Fecha de egreso:</td>
                <td style={{ width: '150px', border: '1px solid black', textAlign: 'center', padding: '4px' }}>{formatDateForDisplay(egresoDate)}</td>
                <td></td>
            </tr>
            <tr style={{ height: '0.5rem' }}><td colSpan={3}></td></tr>
            
            {/* === LÍNEA DE DIAGNÓSTICO CORREGIDA === */}
            <tr>
                <td style={{ fontWeight: 'bold', verticalAlign: 'bottom', paddingBottom: '4px', width: '220px' }}>Diagnóstico:</td>
                <td style={{ borderBottom: '1px solid black', height: '24px', paddingLeft: '8px', width: '100px' }}> 
                  {diagnostico}
                </td>
                <td></td>
            </tr>

            </tbody>
        </table>
        
        <p style={{ fontSize: '11px', fontWeight: 'bold', margin: '1.5rem 0' }}>Empresa Aseguradora: COMFACHOCÓ EPS S</p>
        <p style={{ fontSize: '11px', fontStyle: 'italic' }}>
          Así se da cumplimiento al trámite definido en el Decreto 4747 de 2007 y a la reglamentación definida en la Resolución 3047 de 2008.
        </p>
        
        <div style={styles.signatureBlock}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={styles.signatureLine}></div>
              <strong>Firma del paciente o del responsable:</strong>
              <p style={{ margin: '4px 0 0 0' }}>No. de identificación:</p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={styles.signatureLine}></div>
              <strong>Parentesco:</strong>
            </div>
            <div>
              <div style={styles.signatureLine}></div>
              <strong>Facturación:</strong>
            </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <strong>Calle 23 No. 4-31 Calle las Águilas. PBX:</strong> (094) 670 8747. <strong>Comfachocó IPS:</strong> 671 1313, <strong>Comfachocó EPS-s:</strong> 672 3536.<br/>
        <strong>Centro Vacacional:</strong> 671 3326. <strong>Complejo Educativo Comfachocó</strong>: 6719181. <strong>Centro Hospital Día:</strong> 671 0148<br/>
        <strong>FAX:</strong> 671 2396 - 670 8986 · <strong>Página Web:</strong> www.comfachoco.com.co
      </footer>
    </div>
  );
}