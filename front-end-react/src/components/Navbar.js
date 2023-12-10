import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { changeTab, selectTab } from '../features/tabs/tabsSlicer';
import { useState } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const tab = useSelector(selectTab)
  const dispatch = useDispatch()
  const tabKey = {
    "lexical-analysis": "Lexical Analysis Table",
    "doc_generator": "Lexical Documentation"
  }
  return (
    <nav className = "navbar navbar-expand-lg navbar-dark bg-dark">
      <div className = "container-fluid">
        <a style={{cursor:'pointer'}} className = "navbar-brand" onClick={() => dispatch(changeTab("code_input"))}> Lexical Analysis Toolkit </a>
        <button className = "navbar-toggler" type = "button" data-bs-toggle = "collapse" data-bs-target = "#navbarNav" aria-controls = "navbarNav" aria-expanded = "false" aria-label = "Toggle navigation">
          <span className = "navbar-toggler-icon"></span>
        </button>
        <div className = "collapse navbar-collapse" id = "navbarNav">
          <ul className = "navbar-nav">
            <li className = "nav-item">
             {tab !== 'code_input' && <a className = "nav-link border-bottom border-success"> {tabKey[tab]} <FontAwesomeIcon style={{cursor:'pointer', marginLeft: "10px"}} icon={faXmark} onClick={() => {
                dispatch(changeTab("code_input"))
              }} /></a> }
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
