import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { Progress, Input, Space, Button } from 'antd'

import './PdfComp.scss'; // Import your CSS file


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function ThesisPage({pdf}) {
    // const pdfLink = "https://react-bucket-iu175732-dev.s3.ap-southeast-2.amazonaws.com/public/2013Rubin-EssentialScrumAPracticalGuideToTheMostPopularAgileProcess.pdf"
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [percentage, setPercentage] = useState(0)

    function handleKeyDown(e) {
        const value = e.target.value
        if (e.key === 'Enter') {
            if (value > numPages) {
                setPageNumber(numPages)
                e.target.value = numPages
            } else if (value <= 0) {
                setPageNumber(1)
                e.target.value = 1
            } else {
                setPageNumber(parseInt(e.target.value))
            }
        }
    }
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function handleNext() {
        if (pageNumber < numPages) {
            setPageNumber((prevPage) => prevPage + 1);
        }
    }

    function handlePrev() {
        if (pageNumber > 1) {
            setPageNumber((prevPage) => prevPage - 1);
        }
    }

    function handleLoadProgress(loaded, total) {

        setPercentage(Math.floor(loaded / total * 100))
    }
    console.log('re-render');

    return (
        <div className="pdf-container">
            <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess} onLoadError={console.error}
                loading={<Progress percent={percentage} />}
                onLoadProgress={({ loaded, total }) => handleLoadProgress(loaded, total)}
            >
                <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
            <div>
                <p className='mb-2'>
                    Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
                </p>
                <button type="button" disabled={pageNumber <= 1} onClick={handlePrev}>
                    Previous
                </button>
                <button
                    type="button"
                    disabled={pageNumber >= numPages}
                    onClick={handleNext}
                >
                    Next
                </button>
            </div>
            {
                numPages && (
                    <Space.Compact style={{ width: '100%', marginTop: '10px' }}>
                        <Input className='text-center pl-24' type='number' onKeyDown={handleKeyDown} placeholder='Input the page number then hit enter' />
                        <Button type="primary">GO</Button>
                    </Space.Compact>
                )
            }

        </div>
    );

}

export default ThesisPage;
