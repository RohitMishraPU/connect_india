import { Schema, Types, model } from "mongoose";

interface IVECHILE{
	brand : string;
	model : string;
	mfgYear : string;
	registrationNumber : string;
	capacity : string;
	mileage : string;
	totalKmsRun : number;
	totalTripsCompleted : number;
	maintenanceLogs : {
		logId : Types.ObjectId;
		date : Date;
		description : string;
		cost: number;
	}[];
	driverId : Types.ObjectId;
	orgId : Types.ObjectId;

}

const vehicleSchema = new Schema<IVECHILE>({
	brand: {
		type:String,
	},
	model : {
		type:String,
	},
	mfgYear : {
		type: String,
	},
	registrationNumber : {
		type:String,
		required :true
	},
	capacity : {
		type:String,
		required:true
	},
	mileage:{
		type:String
	},
	totalKmsRun : {
		type:Number
	},
	totalTripsCompleted : {
		type : Number
	},
	maintenanceLogs:{
		type : [Object]

	},
	driverId : {
		type: Schema.Types.ObjectId,
		ref : 'Employee'
	},
	orgId : {
		type: Schema.Types.ObjectId,
		ref:'Orgnaisation',
		required : true
	}


});

const Vehicle = model<IVECHILE>('Vehicle', vehicleSchema);

export default Vehicle;
