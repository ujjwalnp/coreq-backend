require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const authRouter = require("./routes/auth")
const artcileRouter = require('./routes/articles')
const projectRouter = require('./routes/projects')
const archiveRouter = require('./routes/archives')
const queryRouter = require('./routes/queries')
const usersRouter = require('./routes/users')
const feedRouter = require('./routes/feed')
const featureRouter = require('./routes/features')
const cors = require("cors")
const session = require("express-session")
const cookieParser = require("cookie-parser")

/* EXPRESS SERVER  */
const server = express()

/* db connection to the local database name 'coreqDB' */
// main().catch(err => console.log(err))
// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/coreqDB')
//   console.log('database connected')
// }

/* DB CONNECTION TO MONGO ATLAS */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database Connected")
  })
  .catch((err) => {
    console.log(err)
  })

/* BODY PARSERS */
server.use(express.json())

/* MIDDLEWARES */

// sessions and cookies are still under development
server.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
)

/* TEST API */
server.get("/test", (req, res) => {
  req.session.test ? req.session.test++ : (req.session.test = 1)
  res.send(req.session.test.toString())
});

/* ROUTES */
server.use(cors())
server.use("/auth", authRouter.router)
server.use('/article', artcileRouter.router)
server.use('/project', projectRouter.router)
server.use('/archive', archiveRouter.router)
server.use('/query', queryRouter.router)
server.use('/user', usersRouter.router)
server.use('/feed', feedRouter.router)
server.use('/feature', featureRouter.router)

/* SERVER LISTEN */
server.listen(process.env.SERVER_PORT, () => {
  console.log("Server Started")
})
