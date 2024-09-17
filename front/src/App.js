import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./components/Pages/home";
import ImporterCSV from "./components/Pages/importerCSV";
import Navbar from "./components/Pages/navbar";
import Connexion from "./components/Pages/connexion";
import Inscription from "./components/Pages/inscription";
import Messagerie from "./components/Pages/messagerie";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ImporterCSV" element={<ImporterCSV />} />
          <Route path="/Connexion" element={<Connexion />} />
          <Route path="/Inscription" element={<Inscription />} />
          <Route path="/messagerie" element={<Messagerie />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
