const express=require('express');
const connectDB=require('./config/db');
const cors=require ('cors');

const app=express();
app.use(cors());

//connecting to database
connectDB();

//init middlewere
app.use(express.json({extended:false}));

app.get('/',(req,res)=>res.send('API is Running'));

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//const PORT=process.env.PORT || 5445;


app.listen(7777, () => console.log("server started on port"));