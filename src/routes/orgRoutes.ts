import express, {  NextFunction, Response } from 'express';
import Organisation from '../models/Organisation';
import { AuthorisedRequest } from '../common';
import Users from '../models/Users';
import mongoose from 'mongoose';
import Vehicle from '../models/Vehicle';
import Employee from '../models/Employee';
import { warn } from 'console';

const router = express.Router();

export const checkOrgID = (req : AuthorisedRequest, res:Response, next: NextFunction)=>{
	console.log('OrgID checking');
	const orgID = req.params.orgID;
	if(!mongoose.Types.ObjectId.isValid(orgID))
		res.status(400).json({message : 'Bad Data'});
	else{
		if(!req.user.organisation.includes(new mongoose.Types.ObjectId(orgID)))
			res.status(403).json({message : 'Not Allowed to view the organisation detail'});
		else	next();
	}
}
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

router.get('/:orgID', checkOrgID, async(req : AuthorisedRequest, res : Response)=>{
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

router.get('/:orgID/vehicles', checkOrgID, async(req :AuthorisedRequest, res: Response)=>{
	const orgID = req.params.orgID;
	try{
		const org = await Vehicle.find({orgId : orgID});

		if(org.length) res.status(200).json(org);
		
		else res.status(200).json({message : 'There are no vehicles no found. Please create vehicles for your org'})
		
	}catch(error){
		console.error(error);

		res.status(500).json({message : 'something went wrong', detail : error});
	}
})

router.get('/:orgID/roles',checkOrgID, (req : AuthorisedRequest, res : Response)=>{
	res.status(200).json(['driver', 'dispatcher', 'manager']);
})
//
router.get('/:orgID/employees', checkOrgID, async(req : AuthorisedRequest, res:Response) => {
	const orgID = req.params.orgID;
	try{
		const employeeList = await Employee.find({OrgId : orgID});

		res.status(200).json(employeeList);

	}catch(err){
		console.error(err);
		res.status(500).json({message : 'Something went wrong'});
	}
})

router.post('/:orgID/vehicles/new',checkOrgID, async(req : AuthorisedRequest, res : Response)=>{
	const orgID = req.params.orgID;
	try{
		if(req.body){
			
			if(req.user.role === 'manager' || req.user.role ==='admin'){

				const vehicle = await Vehicle.create({...req.body, orgId : orgID});

				res.status(201).json(vehicle);
			}else res.status(403).json({message : 'Unauthorized to create vehicles'});

		}else res.status(400).json({message : 'Bad Data'});
	}catch(err){
		console.error(err);
		res.status(200).json({ message : 'Something went wrong', detail : err});
	}
})

router.post('/:orgID/employees/new',checkOrgID, async(req : AuthorisedRequest, res : Response)=>{
	const orgID = req.params.orgID;
	try{
		if(req.body){
			
			if(req.user.role === 'manager' || req.user.role ==='admin'){

				const employee = await Employee.create({...req.body, orgId : orgID});

				res.status(201).json(employee);
			}else res.status(403).json({message : 'Unauthorized to create vehicles'});

		}else res.status(400).json({message : 'Bad Data'});
	}catch(err){
		console.error(err);
		res.status(200).json({ message : 'Something went wrong', detail : err});
	}
})

export default router;
