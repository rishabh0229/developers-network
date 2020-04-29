const express=require('express');
const connectDB=require('./config/db');

const app=express();

//connecting to database
connectDB();

app.get('/',(req,res)=>res.send('API is Running'));

//const PORT=process.env.PORT || 5445;


app.listen(6666, () => console.log("server started on port"));