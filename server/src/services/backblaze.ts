import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { escapeFilename } from '../helpers/escapeFilename'
import dotenv from 'dotenv'

dotenv.config()

const endpoint = process.env.BUCKET_ENDPOINT ?? ''
const region = process.env.BUCKET_REGION ?? ''
const accessKeyId = process.env.BUCKET_ACCESS_KEY_ID ?? ''
const secretAccessKey = process.env.BUCKET_SECRET_ACCESS_KEY ?? ''

export const bucketName = 'anime-ost'

export const s3 = new S3Client({
    endpoint: endpoint,
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
})

export async function uploadFile(key: string, buffer: Buffer) {
    const filename = escapeFilename(key)
    const uploadParams = {
        Bucket: bucketName,
        Key: filename,
        Body: buffer,
    }

    const response = await s3.send(new PutObjectCommand(uploadParams))
    const uniqueSuffix = `${Date.now() + '-' + Math.round(Math.random() * 1e9)}`
    console.log('weird', { bucketName, uniqueSuffix, filename, key })
    const url = `https://${bucketName}.${endpoint.replace('https://', '')}/${uniqueSuffix}-${filename}`
    return { url, response }
}
