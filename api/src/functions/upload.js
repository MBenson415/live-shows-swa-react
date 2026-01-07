// Polyfill crypto for Azure Static Web Apps managed functions
if (typeof globalThis.crypto === 'undefined') {
    const nodeCrypto = require('crypto');
    globalThis.crypto = nodeCrypto.webcrypto || nodeCrypto;
}

const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');

const containerName = '$web';

app.http('upload', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Upload request received');
        try {
            const connectionString = process.env.BLOB_STORAGE_CONNECTION_STRING;
            
            if (!connectionString) {
                context.log('Error: BLOB_STORAGE_CONNECTION_STRING not found.');
                return { status: 500, jsonBody: { error: "BLOB_STORAGE_CONNECTION_STRING not found." } };
            }
            context.log('Connection string found');

            // Parse JSON body with base64 encoded file
            let body;
            try {
                body = await request.json();
            } catch (parseError) {
                context.log('Error parsing JSON body:', parseError.message);
                return { status: 400, jsonBody: { error: "Invalid JSON body. Expected { fileName, fileType, fileData }" } };
            }

            const { fileName, fileType, fileData } = body;
            const overwrite = request.query.get('overwrite') === 'true';

            if (!fileName || !fileData) {
                context.log('Error: Missing fileName or fileData');
                return { status: 400, jsonBody: { error: "Missing fileName or fileData in request body." } };
            }
            context.log(`File received: ${fileName}, Type: ${fileType}`);

            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient(containerName);

            context.log(`Using container: ${containerName}`);

            const blobName = fileName;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            if (!overwrite) {
                try {
                    const exists = await blockBlobClient.exists();
                    if (exists) {
                        context.log(`File ${blobName} already exists and overwrite is false.`);
                        return { status: 409, jsonBody: { error: "File already exists" } };
                    }
                } catch (existsError) {
                    context.log(`Warning checking exists: ${existsError.message}`);
                }
            }

            // Decode base64 file data
            context.log(`Uploading blob: ${blobName}`);
            const buffer = Buffer.from(fileData, 'base64');

            await blockBlobClient.upload(buffer, buffer.length, {
                blobHTTPHeaders: { blobContentType: fileType || 'application/octet-stream' }
            });
            context.log(`Upload successful: ${blockBlobClient.url}`);

            return {
                jsonBody: {
                    url: blockBlobClient.url,
                    name: blobName
                }
            };

        } catch (error) {
            context.error('Error uploading file:', error.message, error.stack);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});
