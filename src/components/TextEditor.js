import React, {useState, useEffect} from "react";
import './TextEditor.css';

function TextEditor() {
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState('Untitled');
    const [isModified, setIsModified] = useState(false);

    const handleSave = () => {
        setIsModified(false);
        console.log('Saved:', fileName, content);
    }

    const handleContentChange = (event) => {
        setContent(event.target.value);
        setIsModified(true);
    };

    useEffect(() => {
        const autoSave = setTimeout(() => {
            handleSave();
        }, 30000);
        return () => clearTimeout(autoSave);
    }, [isModified, content]);
    return (
        <div className="text-editor">
            {/* Header with filename and save button */}
            <div className="editor-header">
                <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="filename-input"
                />
                <div className="header-buttons">
                    {isModified && <span className="modified-indicator">●</span>}
                    <button className="save-button" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>

            {/* Main text area */}
            <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Start typing your note..."
                className="text-area"
            />

            {/* Status Bar*/}
            <div className="status-bar">
                <span>Characters: {content.length}</span>
                <span>Words:{content.split(' ').filter(word => word).length}</span>
            </div>
        </div>
    );
}

export default TextEditor;