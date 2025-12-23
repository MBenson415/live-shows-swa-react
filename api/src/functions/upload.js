const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');

const connectionString = process.env.AzureWebJobsStorage;
const containerName = '$web';

app.http('upload', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Upload request received');
        try {
            if (!connectionString) {
                context.log('Error: AzureWebJobsStorage connection string not found.');
                return { status: 500, body: "AzureWebJobsStorage connection string not found." };
            }

            const formData = await request.formData();
            const file = formData.get('image');
            const overwrite = request.query.get('overwrite') === 'true';

            if (!file) {
                context.log('Error: No file uploaded.');
                return { status: 400, body: "No file uploaded. Please send a file with key 'image'." };
            }
            context.log(`File received: ${file.name}, Size: ${file.size}, Type: ${file.type}`);

            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient(containerName);

            // Create container if it doesn't exist
            context.log(`Checking container: ${containerName}`);
            try {
                await containerClient.createIfNotExists({
                    access: 'blob' // Allow public read access to blobs
                });
            } catch (err) {
                context.log(`Warning: Could not create container ${containerName}. It might already exist or be a system container. Error: ${err.message}`);
                // Continue, as it might just be that we can't create it but can write to it
            }

            const blobName = file.name;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            if (!overwrite && await blockBlobClient.exists()) {
                context.log(`File ${blobName} already exists and overwrite is false.`);
                return { status: 409, body: "File already exists" };
            }

            // Convert file to ArrayBuffer/Buffer for upload
            context.log(`Uploading blob: ${blobName}`);
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            await blockBlobClient.upload(buffer, buffer.length, {
                blobHTTPHeaders: { blobContentType: file.type }
            });
            context.log(`Upload successful: ${blockBlobClient.url}`);

            return {
                jsonBody: {
                    url: blockBlobClient.url,
                    name: blobName
                }
            };

        } catch (error) {
            context.error('Error uploading file:', error);
            return { status: 500, body: error.message };
        }
    }
});
