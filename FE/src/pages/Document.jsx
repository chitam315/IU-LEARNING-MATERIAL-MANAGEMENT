// import React from 'react'
// // import ReactPDF, { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
// import { Worker, Viewer } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// // Create styles
// // const styles = StyleSheet.create({
// //   page: {
// //     flexDirection: 'row',
// //     backgroundColor: '#E4E4E4'
// //   },
// //   section: {
// //     margin: 10,
// //     padding: 10,
// //     flexGrow: 1
// //   }
// // });

// // Create Document Component
// const MyDocument = () => {


// }

// export default MyDocument
// ---------------------------------------------------------------


import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// import { worker } from 'pdfjs-dist/build/pdf.worker.entry';

const PdfViewer = ({ pdfUrl }) => {
  return (
    <div style={{ height: '500px', width: '70vw' }}>
      <Worker workerUrl={"https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"}>
        <Viewer fileUrl={pdfUrl} />
      </Worker>
    </div>
  )
}

export default PdfViewer;
// ---------------------------------------------------------------
