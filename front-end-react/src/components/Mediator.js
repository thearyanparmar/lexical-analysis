import { useEffect, useState } from "react"
import LexicalDocumentation from "./LexicalDocumentation"
import axios from 'axios'
function Mediator(){
    const [data, setData] = useState(null)

    useEffect(() =>{
        axios.post("http://localhost:3002/document", { doc_id: window.location.pathname.split("/")[1] })
            .then(response => setData(response.data))
    }, [])
    
    return (
        <>
            {data && <LexicalDocumentation data= {data}/>}
        </>
    )
}

export default Mediator