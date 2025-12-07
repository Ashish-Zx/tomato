const Imagekit = require("imagekit");
const dotenv = require("dotenv");
dotenv.config();

const imagekit = new Imagekit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFileToImageKit(file, fileName) {
  const uploadResponse = await imagekit.upload({
    file: file.buffer,
    fileName: fileName,
  });
  return uploadResponse;
}

module.exports = { uploadFileToImageKit };
