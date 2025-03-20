import { Router } from 'express'
import { register, login, logout, upload, uploadFile, getUploads, removeFile } from '../controller/user'
const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/upload', upload.single('file'), uploadFile)
router.post('/logout', logout)

router.get('/uploads', getUploads)

router.delete('/delete', removeFile)
export default router