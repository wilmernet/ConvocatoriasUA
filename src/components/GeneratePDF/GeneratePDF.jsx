import React, { useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const GeneratePDF = ({ htmlElementId, header, footer }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      // Observador para detectar cambios en el elemento
      const observer = new MutationObserver(() => {
        if (element.offsetHeight > 0) { // Si el elemento tiene altura, está renderizado
          observer.disconnect(); // Detenemos la observación
          html2canvas(element)
            .then(canvas => {
              const imgData = canvas.toDataURL('image/png');
              const doc = new jsPDF();
              const imgWidth = doc.internal.pageSize.getWidth();
              const imgHeight = canvas.height * imgWidth / canvas.width;

              // Agregar encabezado y pie de página
              doc.setFontSize(12);
              doc.setTextColor(15, 15, 15);
              doc.text(header, 14, 15); // Ajustar posición si es necesario
              doc.text(footer, 14, doc.internal.pageSize.getHeight() - 10);

              doc.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
              doc.save('mi_documento.pdf');
            })
            .catch(error => {
              console.error('Error al convertir el HTML a PDF:', error);
            });
        }
      });

      observer.observe(element, { attributes: true, childList: true }); // Observar cambios en el elemento
    }
  }, [elementRef]);

  return (
    <div>
      <div ref={elementRef} id={htmlElementId}>
        {/* Aquí va el contenido HTML que deseas convertir a PDF */}
        <h3>xxxxxx</h3>
      </div>
      <button onClick={() => GeneratePDF()}>Generar PDF</button>
    </div>
  );
};

export default GeneratePDF;
