import { Schema, Types, model } from "mongoose";

type OrgReg = {
	type : 'Sole Proprietorship' | 'Partner Firm' | 'LLP' | 'Private Limited';
	registrationNumber : string | number;
	license : object;
	permits : string | object;
}
type OrgInsurance = {
	insuranceID :  string | number;
	insuranceCompany : object;
}
type Address = {
	street : string;
	city : string;
	state : string;
	postalCode : string;
	country : string;
}
interface IORG {
	orgName : string;
	orgRegistration : OrgReg;
	orgTAN : string | number;
	orgPAN : string |number;
	orgInsurance : OrgInsurance;
	address : Address;
	contact : {
		primary : string;
		secondary : string;
	}
	//orgOwner : Types.ObjectId;
}

const orgSchema =  new Schema<IORG>({
	orgName : {type:String, required : true},
	orgRegistration : { type : Object, required:true},
	orgPAN : String,
	orgTAN : String,
	orgInsurance: { type : Object},
	address : { type: Object, required:true},
	contact : { type: Object, required:true}
});

const Organisation = model<IORG>('Organisation', orgSchema);

export default Organisation;
