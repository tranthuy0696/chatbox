const mongoose = require('mongoose') 
let retries = 10 

mongoose.Promise = global.Promise 

const connect = () => { 
    mongoose.connect(process.env.DB_URI, {useMongoClient: true, poolSize: 10}) 
    .catch(() => {}) 
} 
mongoose.connection.on('error', (err) => { 
    if (retries-- !== 0) { 
        setTimeout(connect, 1000)
    } 
}) 

mongoose.connection.on('connected', () => { 
    console.log('Database connected') 
}) 

process.on('SIGINT', function() { 
    mongoose.disconnect() 
    process.exit() 
}) 

connect()