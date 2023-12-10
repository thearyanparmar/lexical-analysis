import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react'
import axios from 'axios'
import LexicalAnalysisTable from './LexicalAnalysisTable';
import LexicalDocumentation from './LexicalDocumentation';
import { Backdrop, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { changeTab, selectTab } from '../features/tabs/tabsSlicer';
import { changeCode, selectCode } from '../features/tabs/codeSlicer';

function CodeInput() {
    const [server_response, setResponse] = useState(null)
    const [open, setOpen] = useState(false);
    const tab = useSelector(selectTab)
    const code = useSelector(selectCode)
    const [endPoint, setEndPoint] = useState("code_input")
    const dispatch = useDispatch()

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    function code_input(e) {
        dispatch(changeCode(e.target.value))
    }

    console.log(tab)

    function http_request(end_point) {
        handleOpen()
        axios.post(`http://localhost:3002/${end_point}`, { code: code })
            .then(response => {
                setResponse(response.data)
                setEndPoint(end_point)
                handleClose()
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        dispatch(changeTab(endPoint))
    }, [server_response])

    function codeFileHandler(event) {
        const codeFile = event.target.files[0];

        if (codeFile) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const codeContent = e.target.result;
                dispatch(changeCode(codeContent))
            };

            reader.readAsText(codeFile);
        }
    }

    var code_style = { backgroundImage: `url('code-back.svg')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }

    return (
        <>
            <div className='container'>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                {tab === 'code_input' && (<>
                    <textarea onChange={code_input} value={code} className="form-control border-primary bg-dark text-light mt-5" rows="25" style={!code ? code_style : null}></textarea>
                    <div class="btn-group d-flex mt-3" role="group" aria-label="Basic outlined example">

                        <button type="button" className="btn btn-outline-primary" onClick={() => {
                            http_request("lexical-analysis")
                        }}> Lexical Analysis Table </button>

                        <button type="button" className="btn btn-outline-primary" onClick={() => {
                            http_request("doc_generator")
                        }}> Doc Generator </button>

                        <input type="file" onChange={codeFileHandler} className="btn btn-outline-primary" />
                    </div>
                </>)}

                {tab === 'lexical-analysis' && <LexicalAnalysisTable data={server_response} />}
                {tab === 'doc_generator' && <LexicalDocumentation data={server_response} />}
            </div>
        </>
    )
}

export default CodeInput