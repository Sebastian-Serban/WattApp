import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingScreen from './components/LandingScreen'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingScreen />} /> 
      </Routes>
    </Router>
  );
}

export default App;
