//https://www.youtube.com/watch?v=NZElg91l_ms

const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')

    const bucketName = process.env.AWS_BUCKET_NAME
    const region = process.envAWS_BUCKET_REGION
    const accessKeyId = process.envAWS_ACCESS_KEY
    const secretAccessKey = process.envAWS_SECRET_KEY

const s3 = new S3({
    bucketName,
    region,
    accessKeyId,
    secretAccessKey
})


//uploads a file to s3
export function uploadFile(file){
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile

//downloads a file from s3