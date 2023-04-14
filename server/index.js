import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import http from "http"
import mongoose from "mongoose"
import cron from 'node-cron'
import { Server } from 'socket.io'
import { corsOptions } from './config/corsOptions.js'
import { errorHandler } from './middlewares/errorHandler.js'
import discRoutes from './routes/discRoutes.js'
import token from './routes/tokenRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { checkDiscTime } from './controllers/discController.js'

const app = express()
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: '*' } });

export let onlineUsers = []

const addNewUser = (userId, socketId) => {
    !onlineUsers.some(user => user.userId === userId) && onlineUsers.push({ userId, socketId })
}

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
}

export const getUsers = (userId) => {
    console.log(onlineUsers)
    return onlineUsers.find(user => user.userId === userId)
}

io.on('connection', (socket) => {
    // console.log('connected');
    //new user
    socket.on('newUser', (userId) => {
        addNewUser(userId, socket.id)
    })

    //disconnect function
    socket.on("disconnect", () => {
        removeUser(socket.id)
    })
});

dotenv.config({ path: "./.env" })
mongoose.set('strictQuery', true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cookieParser())
app.use(cors(corsOptions))

app.use('/user', userRoutes)
app.use('/token', token)
app.use('/disc', discRoutes)

cron.schedule('*/30 * * * * *', () => {
    console.log('i am running a task every 30 seconds');
    checkDiscTime()
});

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database Connected');
        app.listen(PORT, () => { console.log(`Server started on port ${PORT}`); })
    })
    .catch((e) => {
        console.log(e.code, '=>', e.message);
    })

server.listen(5001, () => {
    console.log(`Server listening on port ${5001}`);
});



app.use(errorHandler)



// const corsOptions2 = {
//     origin: 'http://localhost:5173',
//     credentials: true,            //access-control-allow-credentials:true
//     // exposedHeaders: ['set-cookie'],
//     optionSuccessStatus: 200
// }

// app.get('/setcookie', (req, res) => {
//     res.cookie(`Cookie token name`, `encrypted cookie string Value`, {
//         maxAge: 5000,
//         // expires works the same as the maxAge
//         expires: new Date('01 12 2021'),
//         secure: true,
//         httpOnly: true,
//         sameSite: 'lax'
//     });
//     res.send('Cookie have been saved successfully');
// });