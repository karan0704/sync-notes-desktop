import React, { useState, useEffect } from 'react';
import GoogleDriveService from '../services/GoogleDriveService';
import './SyncStatus.css';

function SyncStatus({ onSyncComplete }) {
    const [syncStatus, setSyncStatus] = useState('disconnected');
    const [lastSync, setLastSync] = useState(null);

    useEffect(() => {
        initializeGoogleDrive();
    }, []);

    const initializeGoogleDrive = async () => {
        setSyncStatus('connecting');
        try {
            const success = await GoogleDriveService.initialize();
            if (success) {
                setSyncStatus('ready'); // Ready to authenticate
            } else {
                setSyncStatus('disconnected');
            }
        } catch (error) {
            console.error('Google Drive initialization failed:', error);
            setSyncStatus('disconnected');
        }
    };

    const handleConnect = async () => {
        setSyncStatus('connecting');
        try {
            const authenticated = await GoogleDriveService.authenticate();
            if (authenticated) {
                setSyncStatus('connected');
                // Start auto-sync
                setInterval(syncNotes, 60000); // Every minute
            } else {
                setSyncStatus('ready');
            }
        } catch (error) {
            console.error('Authentication failed:', error);
            setSyncStatus('ready');
        }
    };

    const syncNotes = async () => {
        if (syncStatus !== 'connected') return;

        setSyncStatus('syncing');
        try {
            const driveNotes = await GoogleDriveService.listNotes();
            onSyncComplete(driveNotes);
            setLastSync(new Date());
            setSyncStatus('connected');
        } catch (error) {
            console.error('Sync failed:', error);
            setSyncStatus('connected');
        }
    };

    const getStatusText = () => {
        switch (syncStatus) {
            case 'disconnected': return 'Google Drive unavailable';
            case 'connecting': return 'Connecting...';
            case 'ready': return 'Ready to connect to Google Drive';
            case 'connected': return 'Connected to Google Drive';
            case 'syncing': return 'Syncing notes...';
            default: return 'Unknown status';
        }
    };

    const getStatusColor = () => {
        switch (syncStatus) {
            case 'disconnected': return '#dc3545';
            case 'connecting': return '#ffc107';
            case 'ready': return '#17a2b8';
            case 'connected': return '#28a745';
            case 'syncing': return '#007bff';
            default: return '#6c757d';
        }
    };

    return (
        <div className="sync-status">
            <div className="sync-indicator">
                <div
                    className={`sync-dot ${syncStatus}`}
                    style={{ backgroundColor: getStatusColor() }}
                />
                <span className="sync-text">{getStatusText()}</span>
            </div>

            {syncStatus === 'ready' && (
                <button onClick={handleConnect} className="connect-btn">
                    Connect to Google Drive
                </button>
            )}

            {syncStatus === 'connected' && (
                <>
                    {lastSync && (
                        <div className="last-sync">
                            Last sync: {lastSync.toLocaleTimeString()}
                        </div>
                    )}
                    <button onClick={syncNotes} className="manual-sync-btn">
                        Sync Now
                    </button>
                </>
            )}
        </div>
    );
}

export default SyncStatus;
