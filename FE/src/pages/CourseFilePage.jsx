import { pdfjs } from 'react-pdf';
import { Spin } from 'antd'

// import './PdfPage2.scss'; // Import your CSS file
import { useFetch } from '../hooks/useFetch';
import { thesisService } from '../services/thesis.service';
import { fileService } from '../services/file.service'
import { useParams } from 'react-router-dom';
import PdfComponent from '../components/PdfComp/PdfComp'

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function CourseFilePage() {
    // const pdfLink = "https://react-bucket-iu175732-dev.s3.ap-southeast-2.amazonaws.com/public/2013Rubin-EssentialScrumAPracticalGuideToTheMostPopularAgileProcess.pdf"
    const { id } = useParams()
    console.log(id);
    const { data: resGetFile, loading: loadingGetFile } = useFetch(() => fileService.getFileById(id), [])
    if (loadingGetFile) {
        return <Spin fullscreen={true} size='large' />
    } else {
        console.log(resGetFile);
        return <PdfComponent pdf={resGetFile.file.path} />
    }
}

export default CourseFilePage;
