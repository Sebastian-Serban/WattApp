import React from "react";
import "./LandingScreen.css"; 
import FileUploader from "./FileUploader"; 
import Navbar from "./Navbar";
import Charts from "./charts"

function LandingScreen() {
    return (
        <div className="container">
            <Navbar/>
            <Charts/>
            <FileUploader />

        </div>
    );
}

export default LandingScreen;
