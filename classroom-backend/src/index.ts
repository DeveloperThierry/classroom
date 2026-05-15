import express from 'express'
import cors from 'cors'
import subjectsRouter from './routes/subjects'
import usersRouter from './routes/users'
import {toNodeHandler} from 'better-auth/node'
import { auth } from './lib/auth'
import classesRouter from './routes/classes'
const app = express()
const PORT = process.env.PORT || 8000

if(!process.env.FRONTEND_URL) throw new Error('FRONTEND_URL is not set in .env file.')

app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:['GET', 'PUT', 'POST', 'DELETE'],
    credentials:true
}))
app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json())
app.use('/api/subjects', subjectsRouter)
app.use('/api/users', usersRouter)
app.use('/api/classes', classesRouter)

app.get('/', (req, res) => {
    res.send('Hello, welcome to the Classroom API!')
})

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`)
    })
}

export default app;