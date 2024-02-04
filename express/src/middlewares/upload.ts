import multer from 'multer'
import { Request } from 'express'

import multers3 from 'multer-s3'
import { bucketName, s3 } from '../services/backblaze'

const upload = multer({
    storage: multers3({
        s3: s3,
        bucket: bucketName,
        acl: 'public-read',
        key: function (req: Request, file: Express.Multer.File, cb: any) {
            cb(null, `${Date.now().toString()}_${file.originalname}`)
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // limit file size to 5MB
    },
    fileFilter: (req, file, cb) => {
        const mimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp']
        cb(null, mimeTypes.includes(file.mimetype))
    },
})

export type IExpressMulerFile = {
    location: string
} & Express.Multer.File

export default upload
