import express, { Response } from 'express';
import { AuthorisedRequest } from '../common';
import Employee from '../models/Employee';

const router = express.Router();


router.get('/', async(req : AuthorisedRequest, res :Response)=>{
	try{
         	if(req.user.role === 'super admin'){
        		const allEmployeeList = await Employee.find();
        		res.status(200).json(allEmployeeList);
        	}else if(req.user.role === 'admin' || req.user.role === 'manager'){
        		const allOrgsEmployeeList = await Employee.find({ orgId : { $in : req.user.organisation}});
        		res.status(200).json(allOrgsEmployeeList);
        	}
	}catch(err){
		console.error(err);
		res.status(500).json({message : 'Something went wrong'});
	}
})

router.post('/new', async(req : AuthorisedRequest, res : Response)=>{
	try{
		if(req.body){
			
			if(req.user.role === 'manager' || req.user.role ==='admin'){

				const vehicle = await Employee.create({...req.body, ...(req.body.orgId ? {} : {orgId : req.user.defaultOrg})});

				res.status(201).json(vehicle);
			}else res.status(403).json({message : 'Unauthorized to create vehicles'});

		}else res.status(400).json({message : 'Bad Data'});
	}catch(err){
		console.error(err);
		res.status(200).json({ message : 'Something went wrong', detail : err});
	}
})

export default router;


// const employee = {
// 	"name" : "TY UI",
// 	"phone" : "8789906754",
// 	"email": "",
// 	"address": {
// 		"street": "ghgf",
// 		"city": "bng",
// 		"state": "ka",
// 		"zip": "769012"
// 	  },
// 	"role": "driver",
// 	"salary" : 30000,
// 	"drivingLicenseNumber" : "KLPD",
// }