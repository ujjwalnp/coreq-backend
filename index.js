require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routes/userCredentials')
const cors = require('cors')

// express server
const server = express()

// db connection to the local database name 'coreqDB' 
// main().catch(err => console.log(err))
// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/coreqDB')
//   console.log('database connected')
// }


// db connection to mongo atlas
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
  console.log('database connected')
})
.catch((err)=>{
  console.log(err)
})

// body parsers
server.use(express.json())
server.use('/api', cors(), userRouter.router)


// server listen port
server.listen(8080, ()=>{
    console.log('server started')
})