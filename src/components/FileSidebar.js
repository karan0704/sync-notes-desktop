import React from 'react';
import './FileSidebar.css';

function FileSidebar({
                         files,
                         activeFile,
                         onFileSelect,
                         onCreateNew,
                         onDeleteFile
                     }) {
    return (
        <div className="file-sidebar">
            {/* Header with new file button */}
            <div className="sidebar-header">
                <h3>My Notes</h3>
                <button onClick={onCreateNew} className="new-file-btn">
                    + New
                </button>
            </div>

            {/* File list */}
            <div className="file-list">
                {files.length === 0 ? (
                    <div className="no-files">
                        <p>No notes yet</p>
                        <p>Click "New" to create your first note</p>
                    </div>
                ) : (
                    files.map((file) => (
                        <div
                            key={file.id}
                            className={`file-item ${activeFile?.id === file.id ? 'active' : ''}`}
                            onClick={() => onFileSelect(file)}
                        >
                            <div className="file-info">
                                <div className="file-name">{file.name}</div>
                                <div className="file-preview">
                                    {file.content.slice(0, 50)}
                                    {file.content.length > 50 ? '...' : ''}
                                </div>
                                <div className="file-date">
                                    {new Date(file.lastModified).toLocaleDateString()}
                                </div>
                            </div>
                            <button
                                className="delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteFile(file.id);
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default FileSidebar;
