import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { List, ListItem, ListItemText } from '@mui/material';
import axios from "axios";

function LexicalDocumentation(props) {
    const [data, setData] = useState(props.data)
    const [state, setState] = useState('package')
    const package_list = Object.keys(data.code_structure)
    const [package_name, setPackage] =useState(package_list[0])
    const [packageTab, setPackageTab] = useState("methods")
    const [classTab, setClassTab] = useState("class_data")
    const [edit, setEdit] = useState(false)
    const [description, setDescription] = useState("")
    const [doc_id, setDocId] = useState("")
    const [current_index, setCurrentIndex] = useState(null)
    const [bulk_edit, setBulkEdit] = useState({})
    const [bulk_flag, setBulkFlag] = useState(false)

    function http_firestore() {
        axios.post('http://localhost:3002/store', { code_structure: data })
            .then(response => setDocId(response.data._path.segments[1]))
            .catch(err => console.log(err))
    }

    return (<>{
        data && (<div className="container-fluid mt-5">
            {doc_id && (
                <div class="alert alert-success" role="alert">
                    Your code documentation stored successfully at <a href={`http://localhost:3000/${doc_id}`} target="blank" className="alert-link text-primary">http://localhost:3000/{doc_id}</a>. Give it a look if you like.
                    <FontAwesomeIcon size="2x" icon={faTimes} className="float-end" onClick={() => setDocId("")} />
                </div>
            )}

            <div className="btn-group d-flex" role="group">
                <button className={state === "package" ? "btn btn-primary" : "btn btn-outline-primary"} onClick={() => setState('package')} > Packages </button>
                <button className={state === "class" ? "btn btn-primary" : "btn btn-outline-primary"} onClick={() => setState('class')} > Class </button>
                <button className={state === "exception" ? "btn btn-primary" : "btn btn-outline-primary"} onClick={() => setState('exception')} > Exception </button>
                <button className={state === "public_method" ? "btn btn-primary" : "btn btn-outline-primary"} onClick={() => setState('public_method')} > Public Methods </button>
            </div>

            <div className="btn-group d-flex mt-3" role="group">
                <button className={`btn btn${doc_id ? '' : '-outline'}-info`} onClick={http_firestore}>
                    <span className="m-2"><FontAwesomeIcon icon={faCloudUploadAlt} /></span>
                    Store{doc_id && 'd'} on Cloud
                </button>

                <buton className={`btn btn${bulk_flag ? '' : '-outline'}-info`} onClick={() => setBulkFlag(!bulk_flag)}>
                    <span className="m-2"><FontAwesomeIcon icon={faEdit} /></span>
                    {bulk_flag ? "Save" : "Edit"}
                </buton>
            </div>
            {state === "package" && (<>
                <div className="mt-3 border border-primary" style={{ backgroundColor: "#131313", maxHeight: '700px', overflowY: 'auto' }}>
                    {state === 'package' && (<div className="p-3 btn-group d-flex">
                        {
                            package_list && package_list.map((item) => {
                                return <>
                                    <button className={package_name === item ? "btn btn-success" : "btn btn-outline-success"} onClick={() => setPackage(item)}>{item}</button>
                                </>
                            })
                        }
                    </div>)}
                    <div className="p-3 m-3 border border-primary">
                        <div className="container-fluid btn-group d-flex">
                            <button className={packageTab === "methods" ? "btn btn-warning" : "btn btn-outline-warning"} onClick={() => setPackageTab("methods")}>Methods</button>
                            <button className={packageTab === "objects" ? "btn btn-warning" : "btn btn-outline-warning"} onClick={() => setPackageTab("objects")}>Object</button>
                        </div>
                        <div className="container" style={{ maxHeight: '500px', overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollbarColor: 'transparent transparent' }}>
                            {
                                packageTab === "objects" && (<>

                                {Object.keys(data.code_structure[package_name]["objects"]).length === 0 && <div class="alert alert-danger mt-3" role="alert">
                                    There is no package objects in code.
                                </div>}

                                    <List component="ul">
                                        {Object.keys(data.code_structure[package_name]["objects"]).map((item) => [
                                            <List key={item} component="ul">
                                                <h4 className="text-warning">{item}</h4>,
                                                {data.code_structure[package_name]["objects"][item].map((arr) => (
                                                    <ListItem key={arr.id}>
                                                        <ListItemText primary={arr} style={{ color: 'white' }} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        ])}
                                    </List>
                                </>)
                            }{packageTab === "methods" && (<>
                                {Object.keys(data.code_structure[package_name]["methods"]).length === 0 && <div class="alert alert-danger mt-3" role="alert">
                                    There is no package methods in code.
                                </div>}
                            {
                                Object.keys(data.code_structure[package_name]["methods"]).map((item, index) => (
                                    <div className="card mt-3 text-light bg-dark" key={item}>
                                        <h5 className="card-header bg-secondary">{data.code_structure[package_name]["methods"][item]["type"]}</h5>
                                        <div className="card-body bg-dark">
                                            <h5 className="card-title">{item}</h5>
                                            <p className="card-text">{data.code_structure[package_name]["methods"][item]["description"]}</p>
                                            <div class="card-footer border-top border-warning">
                                                {
                                                    data.code_structure[package_name]["methods"][item]['parameters']
                                                }
                                            </div>


                                            {((!edit && !bulk_flag) && data.code_structure[package_name]["methods"][item]["description"] === 'no-description')
                                                &&
                                            (<button class="btn btn-primary" onClick={() => {setEdit(true); setCurrentIndex(index);}}>ADD DESCRIPTION</button>)}
                                            {(edit && current_index === index) && (<div className="mt-3">
                                                <input type="text" class="form-control" placeholder={`description for ${package_name}`} onChange={(e) => setDescription(e.target.value)} />
                                                <button className="btn btn-success mt-3 w-100" onClick={() => {
                                                    setEdit(false)
                                                    data.code_structure[package_name]["methods"][item]["description"] = description
                                                    setDescription("")
                                                    setCurrentIndex("")
                                                }} >Set</button>
                                            </div>)}
                                        </div>
                                    </div>
                                ))}
                            </>)}
                        </div>
                    </div>
                </div>
            </>)}

            {state === 'class' && (<>
                <div className=" mt-3 border border-primary p-3 container-fluid" style={{backgroundColor: "#131313", maxHeight: '700px', overflowY: 'auto' }}>
                    {
                        <div className="btn-group d-flex">
                            <button className={classTab === "class_data" ? "btn btn-danger" : "btn btn-outline-danger"} onClick={() => setClassTab("class_data")}>Class Data</button>
                            <button className={classTab === "ibm" ? "btn btn-danger" : "btn btn-outline-danger"} onClick={() => setClassTab("ibm")}>In Built Methods</button>
                        </div>
                    }
                        {Object.keys(data.class_data).length === 1 && (<div class="alert alert-danger mt-3" role="alert">
                            There is no class in code.
                        </div>)}
                    
                    {   
                        classTab === 'ibm' && (<>
                        {
                            Object.keys(data.class_data["in_buil_methods"]).map((item) => (
                                <div className="card mt-3 bg-dark text-light">
                                    <h5 className="card-header bg-secondary">{item}</h5>
                                    <div className="card-body bg-dark">
                                        <h5 className="card-title">{data.class_data["in_buil_methods"][item]}</h5>
                                    </div>
                                </div>
                            ))
                        }</>)
                    }
                    {
                        classTab === 'class_data' && (<>{
                            Object.keys(data.class_data).map((item) => {
                                if (item !== 'in_buil_methods') {
                                    return Object.keys(data.class_data[item]).map((member, index) => (
                                
                                        <div className="card mt-3 bg-dark text-light" key={member}>
                                            <h5 className="card-header bg-secondary"><span className="text-warning">Class: </span>{item}</h5>
                                            <h5 className="card-header bg-secondary"><span className="text-warning">
                                                {index === 0 ? "Constructor: " : "Class Method: "} </span>{data.class_data[item][member][index === 0 ? "constructor" : "class_method"]}
                                            </h5>
                                            <div className="card-body bg-dark">

                                                <h5 className="card-title">
                                                    <span className="text-info">{index === 0 ? "Constructor Parameters: " : "Class method parameters: "}</span>
                                                    {data.class_data[item][member][index === 0 ? "constructor_parameters" : "class_method_parameters"].join(", ")}
                                                </h5>

                                                <p class="card-text">
                                                    {data.class_data[item][member][index === 0 ? "construcor_description" : "class_method_description"]}
                                                </p>

                                                {((!edit && !bulk_flag) && data.class_data[item][member][index === 0 ? "construcor_description" : "class_method_description"] === 'no - description')
                                                    &&
                                                (<button class="btn btn-primary" onClick={() => {setEdit(true); setCurrentIndex(data.class_data[item][member]["id"])}}>ADD DESCRIPTION</button>)}

                                                {(!bulk_flag && !edit && bulk_edit[data.class_data[item][member]["id"]]) ? data.class_data[item][member][index === 0 ? "construcor_description" : "class_method_description"] = bulk_edit[data.class_data[item][member]["id"]] : null}

                                                {((edit && current_index === data.class_data[item][member]["id"]) || bulk_flag) && (
                                                    <div className="mt-3">

                                                        <input type="text" class="form-control" placeholder={`description for ${item} class`} onChange={(e) => {
                                                            const id = data.class_data[item][member]["id"]
                                                            setDescription(e.target.value); 
                                                            setBulkEdit(edit => ({
                                                                ...edit,
                                                                ...{[id]: e.target.value}
                                                            }))
                                                        }} />

                                                       {(!bulk_flag && edit) && 
                                                        <button className="btn btn-success mt-3 w-100" onClick={() => {
                                                            setEdit(false)
                                                            setDescription("")
                                                            setBulkFlag(false)
                                                            data.class_data[item][member][index === 0 ? "construcor_description" : "class_method_description"] = description
                                                        }} >Set</button>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ));
                                }
                            })}
                        </>
                        )
                    }
                </div>
            </>)}

            {state === 'exception' && (<>
                <div className="mt-3 border border-primary p-3 container-fluid" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                    {
                        Object.keys(data.exception_data).map((item) => (
                            <div className="card bg-dark mb-3">
                                <h5 className="card-header bg-info">{item}</h5>
                                <div className="card-body bg-dark">
                                    <h5 className="card-title text-light">{data.exception_data[item]}</h5>
                                </div>
                            </div>
                        ))
                    }

                    {Object.keys(data.exception_data).length === 0 && <div class="alert alert-danger" role="alert">
                        There is no exception in code.
                    </div>}
                </div>
            </>)}

            {state === 'public_method' && (<>
                <div className="mt-3 border border-primary p-3 container-fluid" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                    {Object.keys(data.public_methods).length === 0 && <div class="alert alert-danger" role="alert">
                            There is no public methods in code.
                    </div>}

                    {
                        Object.keys(data.public_methods).map((item) => (
                            <div className="card bg-dark mb-3">
                                <h5 className="card-header bg-info">{item.slice(0, item.indexOf("("))}</h5>
                                <div className="card-body bg-dark">
                                    <h5 className="card-title text-light"><span className="text-warning">Parameters: </span>{data.public_methods[item]["def_parameters"].join(", ")}</h5>
                                    <p class="card-text text-light">{data.public_methods[item]["description"]}</p>

                                    {(!edit && data.public_methods[item]["description"] === 'no - description') 
                                        && 
                                    (<button class="btn btn-primary" onClick={() => setEdit(true)}>ADD DESCRIPTION</button>)}

                                    {edit && (
                                        <div className="mt-3">
                                            <input type="text" class="form-control" placeholder={`description for ${item} method`} onChange={(e) => setDescription(e.target.value)} />
                                            <button className="btn btn-success mt-3 w-100" onClick={() => {
                                                setEdit(false)
                                                setDescription("")
                                                data.public_methods[item]["description"] = description
                                            }} >Set</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </>)}
        </div>
        )}
    </>);
}

export default LexicalDocumentation;