import { pdfjs } from 'react-pdf';
import { Spin } from 'antd'

// import './PdfPage2.scss'; // Import your CSS file
import { useFetch } from '../hooks/useFetch';
import { thesisService } from '../services/thesis.service';
import { useParams } from 'react-router-dom';
import PdfComponent from '../components/PdfComp/PdfComp'

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function ThesisPage() {
    // const pdfLink = "https://react-bucket-iu175732-dev.s3.ap-southeast-2.amazonaws.com/public/2013Rubin-EssentialScrumAPracticalGuideToTheMostPopularAgileProcess.pdf"
    const {id} = useParams()
    const { data: resGetThesis, loading: loadingGetThesis } = useFetch(() => thesisService.getThesisById({id}),[])
    if (loadingGetThesis) {
        return <Spin fullscreen={true} size='large'/>
    } else {
        console.log(resGetThesis);
        console.log(resGetThesis.thesis.path)
        return <PdfComponent pdf={resGetThesis.thesis.path}/>
    }
}

export default ThesisPage;
