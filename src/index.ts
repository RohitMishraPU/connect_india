import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import flash from 'express-flash';
import cors from 'cors';
import MongoStore from 'connect-mongo';


import authRouter from'./routes/authRoutes';
import orgRouter from'./routes/orgRoutes';
//CORS config
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
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store:  MongoStore.create({
		mongoUrl: process.env.MONGO_SESSION_URL,
		ttl: 86400,
		autoRemove:'native'
	  })

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
	app.use('/orgs',checkAuthenticated, orgRouter);

	// Generic routes
	app.get('/', checkAuthenticated, (req,res)=>{
		res.send('HEY THERE!! Holaaa');
	});

	app.get('/logout', (req, res)=>{
		(req as any).logout(err =>{
			if(err) return res.status(500).json({message : 'Error While logging out',
				error : err
			})
			return res.status(200).send('Successfully Logged Out');
		});
	});
	app.listen(3000, ()=> console.log('App is listening @3000'));

	function checkAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
		  return next()
		}
	  
		res.status(401).json({error : 'Unauthorized'});
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
