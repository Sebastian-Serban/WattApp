import React, { useState } from 'react';
import axios from 'axios';
import "./FileUploader.css"; 

const FileUploader = () => {
    const [files, setFiles] = useState([]); 
    const [uploading, setUploading] = useState(false); 
    const [uploadType, setUploadType] = useState('sdat'); 

    const handleFileChange = (event) => {
        setFiles(event.target.files);  
    };

    const handleTypeChange = (event) => {
        setUploadType(event.target.value);  
    };

    const validateFileNames = () => {
        const fileNames = Array.from(files).map(file => file.name);
        
        if (uploadType === 'sdat') {
            const invalidFiles = fileNames.filter(fileName => !fileName.includes('LIPPUNEREM'));
            if (invalidFiles.length > 0) {
                alert(`Die folgenden Files passen nicht zum Namensmuster von sdat-Files (LIPPUNEREM):\n${invalidFiles.join(', ')}`);
                return false;
            }
        } else if (uploadType === 'esl') {
            const invalidFiles = fileNames.filter(fileName => !fileName.includes('EdmRegisterWertExport'));
            if (invalidFiles.length > 0) {
                alert(`Die folgenden Files passen nicht zum Namensmuster von Esl-Files (EdmRegisterWertExport):\n${invalidFiles.join(', ')}`);
                return false;
            }
        }
        return true; 
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (files.length === 0) {
            alert('Bitte wählen Sie mindestens 1 File.');
            return;
        }

        if (!validateFileNames()) {
            return; 
        }

        setUploading(true);
        const formData = new FormData();
        
        Array.from(files).forEach(file => {
            formData.append('files', file); 
        });

        try {
            const response = await axios.post(`http://localhost:4000/upload?type=${uploadType}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert(response.data);  
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Fehler beim Hochladen der Files.');
        } finally {
            setUploading(false); 
        }
    };

    return (
        <form onSubmit={handleSubmit} className='file-uploader-container'>
            <div>
                <label>Wähle Datentyp: </label>
                <select value={uploadType} onChange={handleTypeChange}> 
                    <option value="sdat">Sdat</option>
                    <option value="esl">Esl</option>
                </select>
            </div>

            <div>
                <label htmlFor="file-upload" className="custom-file-upload">
                    Dateien auswählen
                </label>
                <input
                    id="file-upload"
                    type="file"
                    className="file-input"
                    multiple
                    onChange={handleFileChange}
                />
            </div>

            <div>
                <button type="submit" disabled={uploading} className='btn-outline'>
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
        </form>
    );
};

export default FileUploader;
