import auth from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { Request, Response } from 'express'

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
