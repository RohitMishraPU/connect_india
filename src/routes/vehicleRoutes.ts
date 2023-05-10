import Vehicle from '../models/Vehicle';
import express, {  Response } from 'express';
import { AuthorisedRequest } from '../common';

const router = express.Router();

router.get('/', async(req : AuthorisedRequest, res : Response)=>{
	try{
		if(req.user.role === 'super admin'){
			const allVehicleList = await Vehicle.find();
			res.status(200).json(allVehicleList);
		}else if(req.user.role === 'admin' || req.user.role === 'manager'){
			const allOrgsVehicleList = await Vehicle.find({ orgId : { $in : req.user.organisation}});
			res.status(200).json(allOrgsVehicleList);
		}
	}catch(err){
		console.error(err);
		res.status(500).json({ message : 'Something went wrong', detail : err});
	}
})

router.post('/new', async(req : AuthorisedRequest, res : Response)=>{
	try{
		if(req.body){
			
			if(req.user.role === 'manager' || req.user.role ==='admin'){

				const vehicle = await Vehicle.create({...req.body, ...(req.body.orgId ? {} : {orgId : req.user.defaultOrg})});

				res.status(201).json(vehicle);
			}else res.status(403).json({message : 'Unauthorized to create vehicles'});

		}else res.status(400).json({message : 'Bad Data'});
	}catch(err){
		console.error(err);
		res.status(200).json({ message : 'Something went wrong', detail : err});
	}
})
export default router;
