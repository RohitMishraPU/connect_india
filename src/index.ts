import express from 'express'
 
if(process.env.TS_NODE_DEV)
	require('dotenv').config();

const app = express();

// Generic routes
app.get('/', (req,res)=>{
	res.send('HEY THERE!! Holaaa');
});

app.listen(3000, ()=> console.log('App is listening @3000'));
