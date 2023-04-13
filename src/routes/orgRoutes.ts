import express, {  Response } from 'express';
import Organisation from '../models/Organisation';
import { AuthorisedRequest } from '../common';
import Users from '../models/Users';
import { log } from 'console';

const router = express.Router();

router.get('/', async (req : AuthorisedRequest, res : Response) => {
	try{
		if(req.user.role === 'admin'){
			const orgList = await Organisation.find();
			res.status(200).json(orgList);
		}else res.status(401).json({message : 'Only Admin can view list of all org'});
	}catch(error){
		console.error(error);
		res.status(500).json({message : 'Something went wrong'});
	}
})


router.post('/new', async(req : AuthorisedRequest, res : Response)=>{
	try{
		if(req.user.role === 'admin'){
			const newOrg = await Organisation.create({...req.body, orgOwner : req.user._id});
			const updatedUser = await Users.findByIdAndUpdate(req.user._id, {$push : {organization : newOrg._id}},{new : true});
			console.log(updatedUser);
			res.status(201).json(newOrg);
		}else res.status(401).json({message : 'Only Admin can create an organisation'});
	}catch(error){
		console.error(error);
		res.status(500).json({message : 'Something went wrong'});
	}
})


export default router;
