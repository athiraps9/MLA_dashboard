require('dotenv').config();
const cloudinary = require('./config/cloudinary');
const fs = require('fs');

async function testUpload() {
    try {
        // Read a test image
        const imageBuffer = fs.readFileSync('./road image.jpg'); // Add a test image
        const base64String = imageBuffer.toString('base64');
        const dataURI = `data:image/jpeg;base64,${base64String}`;

        console.log("Uploading test image...");
        
        const result = await cloudinary.uploader.upload(dataURI, {
            public_id: 'test-upload',
            folder: 'projects',
            resource_type: 'image'
        });

        console.log("Success!");
        console.log("URL:", result.secure_url);
        console.log("Public ID:", result.public_id);

    } catch (error) {
        console.error("Test failed:", error);
    }
}

testUpload();