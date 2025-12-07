const Imagekit = require("imagekit");
const dotenv = require("dotenv");
dotenv.config();

let imagekit;

try {
  if (process.env.IMAGEKIT_PUBLIC_KEY) {
    imagekit = new Imagekit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  } else {
    console.warn("ImageKit keys missing in environment variables");
  }
} catch (error) {
  console.error("Error initializing ImageKit:", error);
}

async function uploadFileToImageKit(file, fileName) {
  if (!imagekit) {
    throw new Error("ImageKit not initialized (check env vars)");
  }

  // Convert buffer to base64 string for ImageKit
  const base64File = file.toString('base64');

  const uploadResponse = await imagekit.upload({
    file: base64File,
    fileName: fileName,
    useUniqueFileName: true,
    folder: '/food-videos',
    tags: ['food', 'video', 'with-audio']
  });

  console.log('Video uploaded to ImageKit:', uploadResponse.url);
  return uploadResponse;
}

module.exports = { uploadFileToImageKit };
