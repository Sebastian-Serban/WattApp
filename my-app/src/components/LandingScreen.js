import React from "react";
import "./LandingScreen.css"; 
import FileUploader from "./FileUploader"; 
import Navbar from "./Navbar";
import Charts from "./charts"
import ExportDialog from "./ExportDialog";

function LandingScreen() {
    return (
        <div className="container">
            <Navbar/>
            <Charts/>
            <div className="import-export">
            <FileUploader />
            <ExportDialog/>
            </div>

        </div>
    );
}

export default LandingScreen;
