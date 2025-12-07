const fs = require('fs').promises;
const path = require('path');

async function uploadFileLocally(file, fileName) {
    const uploadDir = path.join(__dirname, '../../uploads/videos');

    // Create directory if it doesn't exist
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName + '.mp4');
    await fs.writeFile(filePath, file);

    // Return URL accessible from frontend
    const publicUrl = `http://localhost:8000/uploads/videos/${fileName}.mp4`;

    console.log('Video uploaded locally:', publicUrl);
    return { url: publicUrl };
}

module.exports = { uploadFileLocally };
