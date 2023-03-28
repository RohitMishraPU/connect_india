import express from 'express';
import mongoose from 'mongoose';
import authRouter from'./routes/authRoutes';
import session from 'express-session';
import passport from 'passport';
import flash from 'express-flash';
import cors from 'cors';

const allowedOrigins = ['http://localhost:3001']; // add your allowed origin here

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};


if(process.env.TS_NODE_DEV)
	require('dotenv').config();

const app = express();

//const authRouter = require('./src/routes/authRoutes');
app.use(cors(corsOptions));

app.use(express.json());
app.use(flash());
app.use(session({
	secret : process.env.SESSION_SECRET,
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());

try{
	 if(process.env.DATABASE_URL)
		mongoose.connect(process.env.DATABASE_URL);

	const db = mongoose.connection;

	db.once('open', ()=> console.log('Connected wiwth DB'));
	db.on('error', error =>  console.log(error));

	app.use('/auth',checkNotAuthenticated, authRouter);

	// Generic routes
	app.get('/', checkAuthenticated, (req,res)=>{
		res.send('HEY THERE!! Holaaa');
	});

	app.listen(3000, ()=> console.log('App is listening @3000'));

	function checkAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			console.log(req);
		  return next()
		}
	  
		res.status(401).json({message : 'Unauthorized'});
	  }

	  function checkNotAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return res.status(400).json({message : 'User is already logged in'});
		}
	  	return next()
	  }

}catch(error){
	console.log(error);
}
