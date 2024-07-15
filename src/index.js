const express = require('express')
const { config } = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
config()

const bookRoutes = require('./routes/book.routes')

const app = express();
app.use(bodyParser.json());

// Conectar base de datos con Mongoose
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection;

app.use('/books', bookRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})