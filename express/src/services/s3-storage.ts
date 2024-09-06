import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import dotenv from 'dotenv'

dotenv.config()

const endpoint = process.env.BUCKET_ENDPOINT ?? ''
const region = process.env.BUCKET_REGION ?? ''
const accessKeyId = process.env.BUCKET_ACCESS_KEY_ID ?? ''
const secretAccessKey = process.env.BUCKET_SECRET_ACCESS_KEY ?? ''
export const bucketName = process.env.BUCKET_NAME ?? 'radiobucket'

export const s3 = new S3Client({
    endpoint: endpoint,
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
})

export const createPresignedUrlWithClient = async () => {
    const command = new PutObjectCommand({ Bucket: bucketName, Key: 'filename' })
    return getSignedUrl(s3, command, { expiresIn: 3600 })
}
