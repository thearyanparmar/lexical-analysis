import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CodeInput from './components/CodeInput';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom'
import LexicalAnalysisTable from './components/LexicalAnalysisTable';
import LexicalDocumentation from './components/LexicalDocumentation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Mediator from './components/Mediator';

function App() {

  { document.body.style.backgroundColor = 'black' }

  return (
    <>
      <Router>
        <Navbar />
        <div className='container'>
          <Routes>
              <Route path="/" element={<CodeInput />} />
              <Route path="/*" element={<Mediator doc_id={window.location.pathname.split("/")[1]} />} />
              <Route path="/lexical-analysis-table" element={<LexicalAnalysisTable />} />
              <Route path="/lexical-documentation" element={<LexicalDocumentation />} />
          </Routes>
        </div>
      </Router>

      <Footer />
    </>
  );
}

export default App;