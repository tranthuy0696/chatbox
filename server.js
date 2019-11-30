const express  = require('express')
const app      = express()
const http     = require('http')
const socketio = require('socket.io')
const passportSocketIo = require('passport.socketio')
const port     = process.env.PORT || 3000
const mongoose = require('mongoose')
const cors = require('cors')
const i18n = require('i18n')
const fileUpload = require('express-fileupload')
const logger = require('./modules/logger')

const cookieParser = require('cookie-parser')
const bodyParser   = require('body-parser')
const session      = require('express-session')
const MongoStore   = require('connect-mongo')(session)

const server   = http.createServer(app)
const io       = socketio.listen(server)

require('./config/db/connection')

const {passport} = require('./config/passport')

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
i18n.configure({
  directory: __dirname + '/locales',
})
app.use(fileUpload())
app.use(i18n.init)
app.use((req, res, next) => {
  i18n.setLocale(req, 'en-us')
  i18n.setLocale(res, 'en-us')
  req.query.page = req.query.page ? Number(req.query.page) : 1
  req.query.limit = req.query.limit ? Number(req.query.limit) : 1000000
  next()
})

app.set('view engine', 'ejs')
app.use(cors())

app.use((req, res, next) => {
  return session({
    name: 'psession',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: new MongoStore({mongooseConnection: mongoose.connection, ttl: 30 * 24 * 60 * 60})
  })(req, res, next)
})

app.use(passport.initialize())
app.use(passport.session())
global.passport = passport

app.use(express.static(__dirname + '/public'))

server.listen(port, function() {
    console.log('App running on port: ' + port)
    logger.info(`Listening HTTP requests on port ${port}`)
})

io.use(passportSocketIo.authorize({
    passport:     passport,
    cookieParser: cookieParser,
    key:          'psession',
    secret:       'secret',
    store:        new MongoStore({mongooseConnection: mongoose.connection, ttl: 30 * 24 * 60 * 60}),
    success:      onAuthorizeSuccess,
    fail:         onAuthorizeFail
}))

function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io')
  accept(null, true)
}

function onAuthorizeFail(data, message, error, accept){
  console.log('failed connection to socket.io:', data, message);
  accept(null, false)
  // if(error){
  //   accept(null, false)
  // }
}

io.sockets.on('connection', function(socket) {
    const date = new Date()
    const time = date.getHours() + ":" + date.getMinutes()
    socket.emit('message', {username: 'Server', message: 'welcome to the chat'})
    logger.debug(`socket connection - disconnected - client id = ${socket.id}`)
    socket.on('send', function(data) {
        io.sockets.emit('message', data)
    })
})

global.io = io


app.use('/auth', require('./modules/authenticator').router)
app.use('/api', require('./modules/gateway').router)
app.get('/:path', (req, res, next) => {
  console.log(req)
  res.sendFile(__dirname + '/public/' + req.params.path + ".html")
})
