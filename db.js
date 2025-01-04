const mongoose = require('mongoose');
require('dotenv').config();

//define mongodb connection url
const mongoUrl = process.env.MONGODB_URL_LOCAL 
//const mongoUrl = process.env.MONGODB_URL;


//set up mongodb connection
mongoose.connect(mongoUrl,{
    useUnifiedTopology:true
})

//get default connection
const db = mongoose.connection;

//define event listeners for db connection
//mongoose maintains a default connection object representing the mongodb connection
db.on('connected',()=>{
    console.log('connected to mongodb server');
})

db.on('error',(err)=>{
    console.log('mongodb connection error',err);
})

db.on('disconnected',()=>{
    console.log('mongodb disconnected');
})

//export db connection
module.exports = db;
