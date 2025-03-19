import { Router } from 'express'
import { register, login, logout, upload, uploadFile } from '../controller/user'
const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/upload', upload.single('file'), uploadFile)
router.post('/logout', logout)
export default router