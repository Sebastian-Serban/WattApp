import React from "react";
import "./LandingScreen.css"; 
import FileUploader from "./FileUploader"; 
import Navbar from "./Navbar";

function LandingScreen() {
    return (
        <div className="container">
            <Navbar/>
            <FileUploader />
        </div>
    );
}

export default LandingScreen;
