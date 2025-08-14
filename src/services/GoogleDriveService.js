class GoogleDriveService {
    constructor() {
        this.isAuthenticated = false;
        this.accessToken = null;
    }

    // Initialize with Google's JavaScript SDK
    async initialize() {
        try {
            // Load Google API script dynamically
            await this.loadGoogleAPI();

            // Initialize the API
            await window.gapi.load('auth2', async () => {
                await window.gapi.auth2.init({
                    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID
                });

                this.isAuthenticated = true;
                console.log('Google Drive initialized successfully');
            });

            return true;
        } catch (error) {
            console.error('Failed to initialize Google Drive:', error);
            return false;
        }
    }

    // Load Google API script
    loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Google API'));
            document.head.appendChild(script);
        });
    }

    // Authenticate user
    async authenticate() {
        try {
            const authInstance = window.gapi.auth2.getAuthInstance();
            const user = await authInstance.signIn();
            this.accessToken = user.getAuthResponse().access_token;
            return true;
        } catch (error) {
            console.error('Authentication failed:', error);
            return false;
        }
    }

    // Upload note using REST API
    async uploadNote(fileName, content) {
        if (!this.accessToken) {
            throw new Error('Not authenticated');
        }

        try {
            // Create file metadata
            const fileMetadata = {
                name: `${fileName}.txt`
            };

            // Upload file
            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'multipart/related; boundary="foo_bar_baz"'
                },
                body: this.createMultipartBody(fileMetadata, content)
            });

            return await response.json();
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    }

    // Helper to create multipart body
    createMultipartBody(metadata, content) {
        const delimiter = 'foo_bar_baz';
        let body = `--${delimiter}\r\n`;
        body += 'Content-Type: application/json\r\n\r\n';
        body += JSON.stringify(metadata) + '\r\n';
        body += `--${delimiter}\r\n`;
        body += 'Content-Type: text/plain\r\n\r\n';
        body += content;
        body += `\r\n--${delimiter}--`;
        return body;
    }

    // List files
    async listNotes() {
        if (!this.accessToken) {
            throw new Error('Not authenticated');
        }

        try {
            const response = await fetch(
                `https://www.googleapis.com/drive/v3/files?q=mimeType='text/plain'&orderBy=modifiedTime desc`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                }
            );

            const data = await response.json();
            return data.files || [];
        } catch (error) {
            console.error('Failed to list files:', error);
            throw error;
        }
    }
}

export default new GoogleDriveService();
