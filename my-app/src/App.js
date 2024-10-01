import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingScreen from './components/LandingScreen';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path={"/"} exact Component={LoadingScreen}></Route>
        </Routes>
      </Router>
  </>);
}

export default App;
