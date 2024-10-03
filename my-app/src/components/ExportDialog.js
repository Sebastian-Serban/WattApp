import React, { useState } from 'react';
import "./ExportDialog.css";

const ExportDialog = () => {
    return (
        <div className="import-export-wrapper">
            <h2>Daten exportieren</h2>
        <form className='file-uploader-container'>
            <div>
                <label>Datentyp: </label>
                <select>
                    <option value="sdat">CSV</option>
                    <option value="esl">JSON</option>
                </select>
            </div>

            <div>

                <input
                    id="file-upload"
                    type="file"
                    className="file-input"
                    multiple
                />
            </div>

            <div>
                <button type="submit" className='btn-outline'>
                    Exportieren
                </button>
            </div>
        </form>
        </div>
        )
};

export default ExportDialog;
