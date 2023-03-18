const express = require('express')
const app = express()
const connectDB = require('./database/connect')
require('dotenv').config()
const bodyParser = require('body-parser')
const socialMediaRouter = require('./routes/routes')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())
app.use('/api', socialMediaRouter);

async function start(){
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(6969, () => console.log('database connected successfully...'))
    }catch(error){
        console.log('error connecting database...')
    }
}

start()

module.exports = app

