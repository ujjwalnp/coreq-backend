require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./docs/swagger-output.json')

const authRouter = require('./routes/auth')
const artcileRouter = require('./routes/articles')
const projectRouter = require('./routes/projects')
const archiveRouter = require('./routes/archives')
const queryRouter = require('./routes/queries')
const usersRouter = require('./routes/users')
const feedRouter = require('./routes/feed')
const featureRouter = require('./routes/features')

/* EXPRESS SERVER  */
const server = express()

/* DB CONNECTION TO MONGO ATLAS */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database Connected')
  })
  .catch((err) => {
    console.log(err)
  })

/* BODY PARSERS */
server.use(express.json())

/* ROUTES */
server.use(cors())
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
server.use('/auth', authRouter.router)
server.use('/article', artcileRouter.router)
server.use('/project', projectRouter.router)
server.use('/archive', archiveRouter.router)
server.use('/query', queryRouter.router)
server.use('/user', usersRouter.router)
server.use('/feed', feedRouter.router)
server.use('/feature', featureRouter.router)

/* SERVER LISTEN */
server.listen(process.env.PORT, () => {
  console.log(`Server Started on PORT ${ process.env.PORT }`)
})
