import React, { useState, useEffect } from 'react';
import './TextEditor.css';

function TextEditor({
                        currentFile,
                        onSave,
                        onContentChange,
                        onFileNameChange
                    }) {
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState('Untitled');
    const [isModified, setIsModified] = useState(false);

    // Update editor when file changes
    useEffect(() => {
        if (currentFile) {
            setContent(currentFile.content);
            setFileName(currentFile.name);
            setIsModified(false);
        }
    }, [currentFile]);

    // Handle text changes
    const handleContentChange = (event) => {
        const newContent = event.target.value;
        setContent(newContent);
        setIsModified(true);
        onContentChange(newContent);
    };

    // Handle filename changes
    const handleFileNameChange = (event) => {
        const newName = event.target.value;
        setFileName(newName);
        setIsModified(true);
        onFileNameChange(newName);
    };

    // Save function
    const handleSave = () => {
        if (currentFile && onSave) {
            onSave({
                ...currentFile,
                name: fileName,
                content: content,
                lastModified: new Date().toISOString()
            });
            setIsModified(false);
        }
    };

    // Auto-save every 10 seconds when modified
    useEffect(() => {
        if (isModified && currentFile) {
            const autoSave = setTimeout(() => {
                handleSave();
            }, 10000); // 10 seconds for better UX

            return () => clearTimeout(autoSave);
        }
    }, [isModified, content, fileName]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                handleSave();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSave]);

    if (!currentFile) {
        return (
            <div className="no-file-selected">
                <h2>Welcome to Sync Notes</h2>
                <p>Select a note from the sidebar or create a new one to get started.</p>
            </div>
        );
    }

    return (
        <div className="text-editor">
            {/* Header with filename and save button */}
            <div className="editor-header">
                <input
                    type="text"
                    value={fileName}
                    onChange={handleFileNameChange}
                    className="filename-input"
                />
                <div className="header-buttons">
                    <span className={`save-status ${isModified ? 'modified' : ''}`}>
                        {isModified ? 'Unsaved changes' : 'All changes saved'}
                    </span>
                    <button onClick={handleSave} className="save-button">
                        Save (Ctrl+S)
                    </button>
                </div>
            </div>

            {/* Main text area */}
            <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Start typing your notes here..."
                className="text-area"
                autoFocus
            />

            {/* Status bar */}
            <div className="status-bar">
                <span>Characters: {content.length}</span>
                <span>Words: {content.split(' ').filter(word => word.trim()).length}</span>
                <span>Auto-save: Every 10 seconds</span>
            </div>
        </div>
    );
}

export default TextEditor;
