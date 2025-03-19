import auth from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { Request, Response } from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import s3Client from '../config/aws'
//import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

export const register = async(req : Request,res : Response)=> {
    const { email, password, username } = req.body
    try {
       const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
       const user = userCredentials.user
       res.status(201).send(user) 
    } catch (error) {
        res.json({error: error})
    }
}

export const login = async(req: Request, res: Response)=> {
    const {email, password} = req.body
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredentials.user
       res.status(200).send(user)
    } catch (error) {
        res.json({error: error})
    }
}

export const logout = async(req: Request, res: Response)=> {
    try {
        await signOut(auth)
        res.status(200).json({message: 'logout successful'})
    } catch (error) {
        res.json({error: error})
    }
}


export const upload = multer({
        storage: multerS3({
            s3: s3Client,
            bucket: process.env.AWS_BUCKET_NAME,
            acl: 'public-read',
            metadata: (req, file, cb) => {
                cb(null, { fieldName: file.fieldname });
              },
            key: (req, file, cb)=> {
                cb(null, file.originalname)
            }
        })
    })

export const uploadFile = async(req: Request, res: Response)=> {
    if(req.file) {
        const file = req.file as Express.MulterS3.File
        console.log(file.location);  
        res.status(200).json({file: req.file})
    }
    else {
        res.status(400).send('No file uploaded')
    }
}
