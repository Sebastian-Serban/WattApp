import React, { useState } from "react";
import "./FileUploader.css";

function FileUploader() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const fileArray = Array.from(files);
            console.log("Selected files:", fileArray);

            uploadFiles(fileArray);
        }
    };

    const uploadFiles = async (files) => {
        setIsUploading(true);
        setUploadStatus("Uploading...");

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file, file.name);
        });

        try {
            const response = await fetch("http://localhost:4000/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setUploadStatus("Hochladen erflogreich!");
                console.log("Hochladen erflogreich!");
            } else {
                setUploadStatus("Hochladen Fehlgeschlagen");
                console.error("Hochladen Fehlgeschlagen");
            }
        } catch (error) {
            setUploadStatus("Error beim Hochladen");
            console.error("Error beim Hochladen:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <div className="file-uploader">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    disabled={isUploading} 
                />
                <p>{uploadStatus}</p>
            </div>
        </>
    );
}

export default FileUploader;
