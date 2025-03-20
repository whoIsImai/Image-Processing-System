import auth, {firebase} from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { Request, Response } from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import s3Client from '../config/aws'
import { doc, setDoc, updateDoc, arrayUnion, getFirestore, collection, query, where, getDocs, arrayRemove } from 'firebase/firestore'


export const register = async(req : Request,res : Response)=> {
    const { email, password } = req.body
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
              contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file, cb)=> {
                cb(null, file.originalname)
            }
        })
    })

export const uploadFile = async(req: Request, res: Response) : Promise<any>=> {
    const user = auth.currentUser
    if (!user) return res.status(401).json({message: 'Unauthorized'})
     
    if(req.file) {
        const file = req.file as Express.MulterS3.File
        const fileLocation = file.location
        
        const db = getFirestore(firebase)
        const userRef = doc(db, 'users', user.email)

        try {
            await updateDoc(userRef, {
                links: arrayUnion(fileLocation),
                email: user.email
            })
            res.status(201).json({message: 'File uploaded successfully'})
        } catch (error) {
           if(error.code === 'not-found') {
            //incase the user is not in the db we set the user
            await setDoc(userRef, {
                links: arrayUnion(fileLocation),
                email: user.email
            }, {merge: true})
            return res.status(201).json({message: 'File uploaded successfully'})
           } else{
            return res.status(500).json({error: error})
           }
        }

    }
    else {
        res.status(400).send('No file uploaded')
    }
}

export const getUploads = async(req: Request, res: Response) : Promise<any> => {
    const user = auth.currentUser
    if (!user) return res.status(401).json({message: 'Unauthorized'})
    const db = getFirestore(firebase)
 
    const fileRef = collection(db, 'users')
    const q = query(fileRef, where('email', '==', user.email))

    try {
        const querySnapshot = await getDocs(q)
        const fileLinks = querySnapshot.docs.map(doc => doc.data().links)
        return res.status(200).json({links: fileLinks})
    } catch (error) {
        res.json({error: error})
    }
}

export const removeFile = async(req: Request, res: Response) : Promise<any> => {
    
    const {link} = req.query
    const user = auth.currentUser
    if (!user) return res.status(401).json({message: 'Unauthorized'})
    const db = getFirestore(firebase)

    const userRef = doc(db, "users", user.email)
    
    try {
        await updateDoc(userRef, {
            links: arrayRemove(link)
          })
       
          res.status(200).json({message: "File deleted."})
       
    } catch (error) {
        res.status(500).json({error: error.message})
    }



}
