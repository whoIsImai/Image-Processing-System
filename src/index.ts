import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import router from './router/router'
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(router)

app.listen(process.env.PORT, () => {console.log(`Server is running on port http://localhost:${process.env.PORT}`)})
