import express from 'express';
import mongoose from 'mongoose';
import authRouter from'./routes/authRoutes'

if(process.env.TS_NODE_DEV)
	require('dotenv').config();

const app = express();

//const authRouter = require('./src/routes/authRoutes');

app.use(express.json());

app.use('/auth', authRouter);

try{
	 if(process.env.DATABASE_URL)
		mongoose.connect(process.env.DATABASE_URL);

	const db = mongoose.connection;

	db.once('open', ()=> console.log('Connected wiwth DB'));
	db.on('error', error =>  console.log(error));

	// Generic routes
	app.get('/', (req,res)=>{
		res.send('HEY THERE!! Holaaa');
	});

	app.post('/', (req,res)=>{
		console.log(req?.body || 'No Body');
		res.send(' Post HEY THERE!! Holaaa');
	});
	app.listen(3000, ()=> console.log('App is listening @3000'));
}catch(error){
	console.log(error);
}
