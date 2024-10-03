import React, {useState} from 'react';
import "./ExportDialog.css";
import axios from "axios";


const ExportDialog = () => {
    const [filetype, setFiletype] = useState('csv');  // default to CSV

    const handleSubmitExport = async (event) => {
        event.preventDefault()

        try {
            if (filetype === "csv") {
                const response = await axios.get(`http://localhost:4000/export`, {
                    responseType: 'blob'
                })

                const blob = new Blob([response.data], { type: 'application/zip' })
                const downloadUrl = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = downloadUrl
                link.setAttribute('download', 'data.zip')
                document.body.appendChild(link)
                link.click()
                link.remove()
            } else if (filetype === "json") {
                const response = await axios.get(`http://localhost:4000/data`, {
                    responseType: 'blob'
                })

                const blob = new Blob([response.data], { type: 'application/json' })
                const downloadUrl = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = downloadUrl
                link.setAttribute('download', 'data.json')
                document.body.appendChild(link)
                link.click()
                link.remove()
            }
        } catch (error) {
            console.error('Error exporting file:', error)
            alert('Fehler beim Exportieren der Datei.')
        }
    }



    return (
        <div className="import-export-wrapper">
            <h2>Daten exportieren</h2>
            <form onSubmit={handleSubmitExport} className='file-uploader-container'>
                <div>
                    <label>Datentyp: </label>
                    <select
                        name="filetypeSelect"
                        value={filetype}
                        onChange={(e) => setFiletype(e.target.value)}
                    >
                        <option value="csv">CSV</option>
                        <option value="json">JSON</option>
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
