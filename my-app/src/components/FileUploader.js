import React, { useState } from 'react';
import axios from 'axios';

const FileUploader = () => {
    const [files, setFiles] = useState([]); 
    const [uploading, setUploading] = useState(false); 

    const handleFileChange = (event) => {
        setFiles(event.target.files);  
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (files.length === 0) {
            alert('Please select at least one file.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        
        Array.from(files).forEach(file => {
            formData.append('files', file); 
        });

        try {
            const response = await axios.post('http://localhost:4000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert(response.data);  
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Error uploading files');
        } finally {
            setUploading(false); 
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" multiple onChange={handleFileChange} /> 
            <button type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </form>
    );
};

export default FileUploader;
