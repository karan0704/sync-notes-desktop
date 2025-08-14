import React, { useState, useEffect } from 'react';
import TextEditor from './components/TextEditor';
import FileSidebar from './components/FileSidebar';
// import SyncStatus from './components/SyncStatus';  // COMMENTED OUT
// import GoogleDriveService from './services/GoogleDriveService';  // COMMENTED OUT
import './App.css';

function App() {
    const [files, setFiles] = useState([]);
    const [activeFile, setActiveFile] = useState(null);
    // const [syncEnabled, setSyncEnabled] = useState(false);  // COMMENTED OUT

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
            lastModified: new Date().toISOString(),
            // driveFileId: null // COMMENTED OUT - Google Drive sync field
        };

        setFiles(prev => [newFile, ...prev]);
        setActiveFile(newFile);
    };

    // Select file
    const selectFile = (file) => {
        setActiveFile(file);
    };

    // Delete file (simplified - no Google Drive)
    const deleteFile = async (fileId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            // const fileToDelete = files.find(f => f.id === fileId);  // COMMENTED OUT

            // COMMENTED OUT - Delete from Google Drive
            // if (syncEnabled && fileToDelete?.driveFileId) {
            //   try {
            //     await GoogleDriveService.deleteNote(fileToDelete.driveFileId);
            //   } catch (error) {
            //     console.error('Failed to delete from Google Drive:', error);
            //   }
            // }

            // Delete from local storage only
            setFiles(prev => prev.filter(file => file.id !== fileId));

            // If deleted file was active, select another or none
            if (activeFile?.id === fileId) {
                const remainingFiles = files.filter(file => file.id !== fileId);
                setActiveFile(remainingFiles.length > 0 ? remainingFiles[0] : null);
            }
        }
    };

    // Save file (simplified - no Google Drive sync)
    const saveFile = async (updatedFile) => {
        // Update local files
        setFiles(prev =>
            prev.map(file =>
                file.id === updatedFile.id ? updatedFile : file
            )
        );
        setActiveFile(updatedFile);

        // COMMENTED OUT - Google Drive sync
        // if (syncEnabled) {
        //   try {
        //     if (updatedFile.driveFileId) {
        //       // Update existing file in Google Drive
        //       await GoogleDriveService.updateNote(updatedFile.driveFileId, updatedFile.content);
        //     } else {
        //       // Upload new file to Google Drive
        //       const driveFile = await GoogleDriveService.uploadNote(updatedFile.name, updatedFile.content);
        //
        //       // Update local file with Google Drive ID
        //       const fileWithDriveId = { ...updatedFile, driveFileId: driveFile.id };
        //       setFiles(prev =>
        //         prev.map(file =>
        //           file.id === updatedFile.id ? fileWithDriveId : file
        //         )
        //       );
        //       setActiveFile(fileWithDriveId);
        //     }
        //   } catch (error) {
        //     console.error('Failed to sync to Google Drive:', error);
        //   }
        // }
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

    // COMMENTED OUT - Google Drive sync handler
    // const handleSyncComplete = async (driveNotes) => {
    //   try {
    //     console.log('Notes from Google Drive:', driveNotes);
    //     setSyncEnabled(true);
    //   } catch (error) {
    //     console.error('Sync completion failed:', error);
    //     setSyncEnabled(false);
    //   }
    // };

    return (
        <div className="app">
            <FileSidebar
                files={files}
                activeFile={activeFile}
                onFileSelect={selectFile}
                onCreateNew={createNewFile}
                onDeleteFile={deleteFile}
            />
            <div className="main-content">
                <TextEditor
                    currentFile={activeFile}
                    onSave={saveFile}
                    onContentChange={updateFileContent}
                    onFileNameChange={updateFileName}
                />
                {/* COMMENTED OUT - SyncStatus component */}
                {/* <SyncStatus onSyncComplete={handleSyncComplete} /> */}
            </div>
        </div>
    );
}

export default App;
