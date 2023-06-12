require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routes/userCredentials')
const cors = require('cors')

// express server
const server = express()

// db connection to the database name 'coreqDB' 
main().catch(err => console.log(err))
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/coreqDB')
  console.log('database connected')
}


// db connection to mongo atlas
// const { MongoClient, ServerApiVersion } = require('mongodb')
// const uri = process.env.MONGO_URL
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// })
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

// body parsers
server.use(express.json())
server.use('/api', cors(), userRouter.router)


// server listen port
server.listen(8080, ()=>{
    console.log('server started')
})