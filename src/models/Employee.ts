import { Schema, Types, model } from "mongoose";
import { Address } from "../common";


interface IEMP{
	name : string;
	phone : string;
	email: string;
	address: Address;
	department : string;
	position: string;
	hireDate : Date;
	salary : number;
	skills : string[];
	manager : Types.ObjectId;
	directReports : Types.ObjectId[];
	drivingLicenseNumber : string| number;
	assignedVehicle : object;
	OrgId : Types.ObjectId;
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
	address : { type :Object, required:true},
	department:String,
	position:String,
	hireDate : {
		type: Date,
		max: new Date().setHours(23, 59, 59, 999);
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
	}
});
