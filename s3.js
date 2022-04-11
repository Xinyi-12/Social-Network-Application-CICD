require('dotenv').config()
const dbConfig = require("../model/config");
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')
// const keys = require('../config/dev');

const bucketName = "encryptedbucket01-info6255-userpic.dev.xinyapp.me"
const region = "us-east-1"
const accessKeyId = "AKIA2EQZ22PO56Q33A37"
const secretAccessKey = "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"

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
