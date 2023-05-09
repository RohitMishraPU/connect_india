import express, {  Response } from 'express';
import Organisation from '../models/Organisation';
import { AuthorisedRequest } from '../common';
import Users from '../models/Users';
import mongoose from 'mongoose';
import Vehicle from '../models/Vehicle';

const router = express.Router();

router.get('/', async (req : AuthorisedRequest, res : Response) => {
	try{
		if(req.user.role === 'super admin'){
			const orgList = await Organisation.find();
			res.status(200).json(orgList);
		}
		else if(req.user.role === 'admin'){
			const orgList = await Organisation.find({ orgOwner : req.user._id});
			res.status(200).json(orgList);
		}else res.status(403).json({message : 'Only Admin can view list of all org'});
	}catch(error){
		console.error(error);
		res.status(500).json({message : 'Something went wrong', detail : error});
	}
})


router.post('/new', async(req : AuthorisedRequest, res : Response)=>{
	try{
		if(req.user.role === 'admin'){
			const newOrg = await Organisation.create({...req.body, orgOwner : req.user._id});
			const user = await Users.findById(req.user._id);
			if (!user.organisation || user.organisation.length === 0) {
				user.defaultOrg = newOrg._id;
			  }
			  user.organisation.push(newOrg._id);
			const updatedUser = await user.save();
			res.status(201).json(newOrg);
		}else res.status(403).json({message : 'Only Admin can create an organisation'});
	}catch(error){
		console.error(error);
		res.status(500).json({message : 'Something went wrong', detail : error});
	}
})

router.get('/:orgID', async(req : AuthorisedRequest, res : Response)=>{
	const orgID = req.params.orgID;
	try{
		if(!mongoose.Types.ObjectId.isValid(orgID))
			res.status(400).json({message : 'Bad Data'});
		else{
			if(!req.user.organisation.includes(new mongoose.Types.ObjectId(orgID))){
			res.status(403).json({message : 'Not Allowed to view the organisation detail'});
			}else{
				const org = await Organisation.findById(orgID);

				if(org) res.status(200).json(org);
				
				else res.status(404).json({message : 'Organisation not found'});
			}
		}
		
		
	}catch(error){
		console.error(error);

		res.status(500).json({message : 'something went wrong', detail : error});
	}
})

router.get('/:orgID/vehichles', async(req :AuthorisedRequest, res: Response)=>{
	const orgID = req.params.orgID;
	try{
		if(!mongoose.Types.ObjectId.isValid(orgID))
			res.status(400).json({message : 'Bad Data'});
		else{
			if(!req.user.organisation.includes(new mongoose.Types.ObjectId(orgID))){
			res.status(403).json({message : 'Not Allowed to view the organisation detail'});
			}else{
				const org = await Vehicle.find({orgId : orgID});

				if(org) res.status(200).json(org);
			}
		}
		
		
	}catch(error){
		console.error(error);

		res.status(500).json({message : 'something went wrong', detail : error});
	}
})

export default router;
