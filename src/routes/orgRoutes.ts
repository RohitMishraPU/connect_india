import express, {  Response } from 'express';
import Organisation from '../models/Organisation';
import { AuthorisedRequest } from '../common';
import Users from '../models/Users';

const router = express.Router();

router.get('/', async (req : AuthorisedRequest, res : Response) => {
	try{
		if(req.user.role === 'admin'){
			const orgList = await Organisation.find();
			res.status(200).json(orgList);
		}else res.status(403).json({message : 'Only Admin can view list of all org'});
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
			res.status(201).json(newOrg);
		}else res.status(403).json({message : 'Only Admin can create an organisation'});
	}catch(error){
		console.error(error);
		res.status(500).json({message : 'Something went wrong'});
	}
})

router.get('/:orgID', async(req : AuthorisedRequest, res : Response)=>{
	const orgID = req.params.orgID;
	try{
		const org = await Organisation.findById(orgID);

		if(org) res.status(200).json(org);
		
		else res.status(404).json({message : 'Organisation not found'});
	}catch(error){
		console.error(error);

		res.status(500).json({message : 'something went wrong', detail : error});
	}
})
export default router;
