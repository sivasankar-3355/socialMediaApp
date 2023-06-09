const express = require('express')
const app = express()
const connectDB = require('./database/connect')
require('dotenv').config()
const bodyParser = require('body-parser')
const socialMediaRouter = require('./routes/routes')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());
app.use('/api', socialMediaRouter);

app.get('/', (req, res) => {
    res.json({msg: 'hello'})
})

async function start(){
    try{
        await connectDB('mongodb+srv://siva:$iva@123@cluster0.mpbx2mt.mongodb.net/?retryWrites=true&w=majority')
        app.listen(3000, () => console.log('database connected successfully...'))
    }catch(error){
        console.log('error connecting database...')
    }
}

start()

module.exports = app

