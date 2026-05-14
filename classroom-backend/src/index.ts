import express from 'express'
import cors from 'cors'
import subjectsRouter from './routes/subjects'

const app = express()
const PORT = 8000
app.use(express.json())
app.use(cors({
    // origin:[process.env.FRONTEND_URL!, process.env.FIREBASE_URL!],
    origin:process.env.FRONTEND_URL,
    methods:['GET', 'PUT', 'POST', 'DELETE'],
    credentials:true
}))
app.use('/api/subjects', subjectsRouter)

app.get('/', (req, res) => {
    res.send('Hello, welcome to the Classroom API!')
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})