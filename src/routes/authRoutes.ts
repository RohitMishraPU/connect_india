import express from 'express';
import { Request, Response, NextFunction } from 'express';
import Users from '../models/Users';
import bcrypt from 'bcrypt';
import passport from 'passport';
import createPassportLocalStrategy from '../passportConfig';


const router = express.Router();


export const fetchUserByEmail = async (email : string) =>{
	try{
		return await Users.findOne({email : email});
	}catch(err){
		throw err.message;
	}
};

export const fetchUserByID = async (id : string) =>{
	try{
		return await Users.findById(id);
	}catch(err){
		throw err.message;
	}
};


createPassportLocalStrategy(passport, fetchUserByEmail, fetchUserByID);


router.post('/signup', async(req : Request,res : Response)=>{
	if(!(req.body.email && req.body.password)) res.status(400).json({ message : 'Email and Password are mandatory'});
	const hashedPassword = await bcrypt.hash(req.body.password, 10); 

	const user = new Users({
		name : req.body.username,
		password:hashedPassword,
		role: req.body.role,
		email:req.body.email,
	});
	try{
		const newUser = await user.save();
		res.status(201).json(newUser);
	}catch(err){
		res.status(400).json({message : err?.message || 'Something went wrong'});
	}
});


router.post('/login', (req : Request, res : Response, next : NextFunction)=>{
	const { email, password } = req.body;

  	if (!email || !password) 
    	return res.status(400).json({ error: 'Email and password are required' });

	return next();
},(req : Request, res : Response, next : NextFunction)=> {
	passport.authenticate('local', (err, user, info) => {
	  if (err) {
		return next(err);
	  }
	  if (!user) {

		return res.status(401).json({ error: info.message });
	  }
	  (req as any).logIn(user, (err) => {
		if (err) {
		  return next(err);
		}
		return res.status(200).json(user);
	  });
	})(req, res, next);
  });

export default router;
