import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Cookies from 'js-cookie';

function LexicalAnalysisTable(props) {
    const data = props.data
        
    return (
        <>
            <h4 className='text-primary mt-3 p-3'>Lexical Analysis Table</h4>
            <div className='container' style={{ maxHeight: '700px', overflowY: 'auto' }}>
                <table className="table table-dark table-bordered border-primary table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Line</th>
                            <th scope="col">Token</th>
                            <th scope="col">Attribute</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((item) => (
                            <tr key={item.line}>
                                <td>{item.line}</td>
                                <td>{item.token}</td>
                                <td>{item.attribute}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default LexicalAnalysisTable;
