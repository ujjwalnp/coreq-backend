require('dotenv').config()
const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        title: 'COREQ API DOCUMENTATION',
        description: 'API Documentation',
    },
    host: 'http://localhost:8000',
}

const outputFile = './swagger-output.json'
const routes = [
    './routes/auth.js',
    './routes/archives.js',
    './routes/articles.js',
    './routes/features.js',
    './routes/feed.js',
    './routes/projects.js',
    './routes/queries.js',
    './routes/users.js',
]

swaggerAutogen(outputFile, routes, doc)