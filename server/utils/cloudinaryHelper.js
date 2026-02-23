const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (fileBuffer, publicId, mimetype = 'image/jpeg') => {
    try {
        if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
            throw new Error('Invalid file buffer');
        }

        if (fileBuffer.length === 0) {
            throw new Error('File buffer is empty');
        }

        console.log("Buffer validation passed");
        console.log("Buffer size:", fileBuffer.length, "bytes");

        // Detect correct MIME type
        let mimeType = mimetype || 'image/jpeg';
        
        // Convert buffer to base64 data URI
        const base64String = fileBuffer.toString('base64');
        const dataURI = `data:${mimeType};base64,${base64String}`;

        console.log("Data URI created, uploading to Cloudinary...");

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            public_id: publicId,
            folder: 'projects',
            resource_type: 'image',
            overwrite: true,
            invalidate: true // Clear CDN cache
        });

        console.log("Upload successful:", result.secure_url);
        return result;

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw error;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Delete from Cloudinary failed:", error);
        throw error;
    }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };