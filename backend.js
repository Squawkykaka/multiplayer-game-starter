const { randomInt } = require('crypto')
const express = require('express')
const app = express()
const port = 3000

// socket.io setup
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(join(__dirname + '/index.html'))
})

const backEndPlayers = {}

io.on('connection', (socket) => {
  console.log('a user connected')
  backEndPlayers[socket.id] = {
    x: 500 * Math.random(),
    y: 500 * Math.random(),
    color: `hsl(${360 * Math.random()}, 100%, 50%)`
  }

  io.emit('updatePlayers', backEndPlayers)

  socket.on('disconnect', (reason) => {
    console.log(reason)
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers', backEndPlayers)
  })

  // console.log(players)
})

server.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
