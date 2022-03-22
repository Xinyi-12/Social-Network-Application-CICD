require('dotenv').config()
const dbConfig = require("../model/config");
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')
// const keys = require('../config/dev');

const bucketName = dbConfig.AWS_BUCKET_NAME
const region = dbConfig.AWS_BUCKET_REGION
const accessKeyId = dbConfig.AWS_ACCESS_KEY
const secretAccessKey = dbConfig.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

//uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }

  return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile


// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream = getFileStream
