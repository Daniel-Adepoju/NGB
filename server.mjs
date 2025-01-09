import {createServer} from 'node:http'
import next from 'next'
import {Server} from 'socket.io'

const dev = process.env.NODE_ENV !=='production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT || "3001", 10)

const app = next({dev,hostname,port})
const handle = app.getRequestHandler()

// app.prepare().then(() => {
    
    const server = createServer()
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization']
        }
    })
    io.on('connection', (socket) => {

        socket.on('likePost', (res) => {
         socket.broadcast.emit('likePost', res)
        })

        socket.on('commentPost', (res) => {
         socket.broadcast.emit('commentPost', res)
        })

        socket.on('deletePost', (res) => {
         socket.broadcast.emit('deletePost', res)
        })

        socket.on('createPost', (res) => {
         socket.broadcast.emit('createPost', res)
        })
    })

    


    io.on('disconnect', () => {
        console.log(`User disconnected ${socket.id}`)
    })
 
  server.listen(port, () => {
        console.log(`Server is running on http://${hostname}:${port}`)
    })
// })