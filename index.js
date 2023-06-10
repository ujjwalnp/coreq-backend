const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routes/user')
const cors = require('cors')

// express server
const server = express()

// db connection to the database name 'coreq-backend' 
main().catch(err => console.log(err))
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/coreq-backend')
  console.log('database connected')
}

// body parsers
server.use(express.json())
server.use('/api', cors(), userRouter.router)


// server listen port
server.listen(8080, ()=>{
    console.log('server started')
})