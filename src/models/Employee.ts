import { Schema, Types, model } from "mongoose";
import { Address } from "../common";
import { addressSchema } from "./Organisation";


interface IEMP{
	name : string;
	phone : string;
	email: string;
	address: Address;
	role: 'driver' | 'dispatcher' | 'manager' | 'administrator';
	position: string;
	hireDate : Date;
	salary : number;
	skills : string[];
	manager : Types.ObjectId;
	directReports : Types.ObjectId[];
	drivingLicenseNumber : string| number;
	assignedVehicle : object;
	orgId : Types.ObjectId;
}
const employeeSchema = new Schema<IEMP>({
	name: {
		type: String,
		required:true
	},
	phone:{
		type:String,
		required:true
	},
	email : String,
	address : addressSchema,
	role: {
		type: String,
		enum: ['driver', 'dispatcher', 'manager'],
		required: true
	  },
	position:String,
	hireDate : {
		type: Date,
		max: new Date().setHours(23, 59, 59, 999)
	},
	salary : {
		type: Number,
		//match: /^[0-9]+$/
	},
	skills : {
		type: [String]
	},
	manager : {
		type : Schema.Types.ObjectId, ref:'Employee'
	},
	directReports: {
		type: [Schema.Types.ObjectId], ref: 'Employee'
	},
	drivingLicenseNumber:{
		type: String,
		required : true
	},
	assignedVehicle : {
		type : Object
	},
	orgId:{
		type:Schema.Types.ObjectId, ref:'Organisation'
	}
});


const Employee = model<IEMP>('Employee', employeeSchema);

export default Employee;
