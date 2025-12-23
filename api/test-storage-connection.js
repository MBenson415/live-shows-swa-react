const { BlobServiceClient } = require('@azure/storage-blob');

const connectionString = "DefaultEndpointsProtocol=https;AccountName=squarespacemusic;AccountKey=7dKLWAigMS4a/AZ8dVSijILRCrhlsoXMln1KWZV13slUUFxnieqC4LGRotFahvk5czQumo3oHHHa+AStGDZkQA==;EndpointSuffix=core.windows.net";

async function test() {
    console.log("Testing connection string...");
    try {
        // This is expected to fail if the format is not a valid Connection String
        const client = BlobServiceClient.fromConnectionString(connectionString);
        console.log("BlobServiceClient created.");
        
        console.log("Attempting to list containers...");
        for await (const container of client.listContainers()) {
            console.log(`- ${container.name}`);
            break; // Just need one to prove connection
        }
        console.log("Connection successful!");
    } catch (err) {
        console.error("Connection failed:");
        console.error(err.message);
    }
}

test();
