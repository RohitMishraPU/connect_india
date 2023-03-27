import express from 'express';
import Users from '../models/Users';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/', (req, res)=>{
	res.send('Hollaaa from auth');
});

router.post('/signup', async(req,res)=>{
	if(!(req.body.username && req.body.password)) res.status(400).json({ message : 'Username and Password are mandatory'});
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

export default router;
