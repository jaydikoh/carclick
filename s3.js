const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Upload file to S3
async function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME, // S3 bucket name
    Key: `${Date.now()}-${path.basename(file.originalname)}`, // Unique file name
    Body: fileStream,
    ContentType: file.mimetype,
  };

  const result = await s3.upload(uploadParams).promise();
  return result;
}

// Delete file from S3
async function deleteFile(key) {
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  await s3.deleteObject(deleteParams).promise();
}

module.exports = { uploadFile, deleteFile };
