import React from "react";
import "./LandingScreen.css";
import "./FileUploader";
import FileUploader from "./FileUploader";

function LandingScreen() {
    return (
        <>
            <div className="container">
                <h1>
                    Watt App
                </h1>
                <FileUploader/>
            </div>
        </>
    )   
}

export default LandingScreen;