import { Schema, Types, model } from "mongoose";
import { Address } from "../common";

type OrgReg = {
	orgType : 'Sole Proprietorship' | 'Partner Firm' | 'LLP' | 'Private Limited';
	registrationNumber : string | number;
	license ?: object;
	permits ?: string | object;
}
type OrgInsurance = {
	insuranceID :  string | number;
	insuranceCompanyName : string;
	insuranceCompanyAddress : Address;
}

export type Contact = {
	primary : string,
	secondary : string
}

interface IORG {
	orgName : string;
	orgRegistration : OrgReg;
	orgTAN : string | number;
	orgPAN : string |number;
	orgInsurance : OrgInsurance;
	address : Address;
	contact : Contact; 
	orgOwner : Types.ObjectId;
}

export const contactSchema = new Schema<Contact>({
	primary : {type: String, required: true},
	secondary : String
})

export const addressSchema = new Schema<Address>({
	street : { type : String},
	city : { type : String},
	state : { type : String },
	zip : { type : String},
	country : {type: String}
})

const orgRegisrationSchema = new Schema<OrgReg>({
		orgType : { type : String, required:true},
		registrationNumber : {type : String, required:true},
		license : {type : Object},
		permits : { type : Object}
	});

const orgInsuranceSchema = new Schema<OrgInsurance>({
	insuranceID : { type : String, required : true},
	insuranceCompanyName : { type : String, required : true},
	insuranceCompanyAddress : { type: addressSchema}

})

const orgSchema =  new Schema<IORG>({
	orgName : { type:String, required : true},
	orgRegistration : { type : orgRegisrationSchema, required:true},
	orgPAN : {type : String},
	orgTAN : {type :String},
	orgInsurance: { type : orgInsuranceSchema},
	address : { type: addressSchema, required:true},
	contact : { type: contactSchema, required:true},
	orgOwner : { type : Schema.Types.ObjectId, ref : 'User', required: true, unique : true }
});

const Organisation = model<IORG>('Organisation', orgSchema);

export default Organisation;
