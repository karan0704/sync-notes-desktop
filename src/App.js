import React, { useState, useEffect } from 'react';
import TextEditor from './components/TextEditor';
import FileSidebar from './components/FileSidebar';
import './App.css';

function App() {
    const [files, setFiles] = useState([]);
    const [activeFile, setActiveFile] = useState(null);

    // Load files from localStorage on app start
    useEffect(() => {
        const savedFiles = localStorage.getItem('syncNotes');
        if (savedFiles) {
            const parsedFiles = JSON.parse(savedFiles);
            setFiles(parsedFiles);
            if (parsedFiles.length > 0) {
                setActiveFile(parsedFiles[0]);
            }
        }
    }, []);

    // Save files to localStorage whenever files change
    useEffect(() => {
        localStorage.setItem('syncNotes', JSON.stringify(files));
    }, [files]);

    // Create new file
    const createNewFile = () => {
        const newFile = {
            id: Date.now().toString(),
            name: `Note ${files.length + 1}`,
            content: '',
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };

        setFiles(prev => [newFile, ...prev]);
        setActiveFile(newFile);
    };

    // Select file
    const selectFile = (file) => {
        setActiveFile(file);
    };

    // Delete file
    const deleteFile = (fileId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            setFiles(prev => prev.filter(file => file.id !== fileId));

            // If deleted file was active, select another or none
            if (activeFile?.id === fileId) {
                const remainingFiles = files.filter(file => file.id !== fileId);
                setActiveFile(remainingFiles.length > 0 ? remainingFiles[0] : null);
            }
        }
    };

    // Save file
    const saveFile = (updatedFile) => {
        setFiles(prev =>
            prev.map(file =>
                file.id === updatedFile.id ? updatedFile : file
            )
        );
        setActiveFile(updatedFile);
    };

    // Update file content in real-time
    const updateFileContent = (content) => {
        if (activeFile) {
            const updatedFile = {
                ...activeFile,
                content,
                lastModified: new Date().toISOString()
            };
            setActiveFile(updatedFile);
        }
    };

    // Update file name in real-time
    const updateFileName = (name) => {
        if (activeFile) {
            const updatedFile = {
                ...activeFile,
                name,
                lastModified: new Date().toISOString()
            };
            setActiveFile(updatedFile);
        }
    };

    return (
        <div className="app">
            <FileSidebar
                files={files}
                activeFile={activeFile}
                onFileSelect={selectFile}
                onCreateNew={createNewFile}
                onDeleteFile={deleteFile}
            />
            <TextEditor
                currentFile={activeFile}
                onSave={saveFile}
                onContentChange={updateFileContent}
                onFileNameChange={updateFileName}
            />
        </div>
    );
}

export default App;
