import { Schema, Types, model } from "mongoose";

interface IUSER{
	name:string;
	email:string;
	password:string;
	organization:Types.ObjectId;
	role: 'admin' | 'manager';
	createdAt: Date;
	updatedAt:Date
}

const userSchema = new Schema<IUSER>({
	name:{
		type:String,
		required:true,
	},
	email:{
		type:String,
		required:true,
		unique:true,
		match: /^\w+([.-]?\w+)*@\w+([._]?\w+)*(\.\w{2,3})+$/
	},
	password:{
		type: String,
		required:true
	},
	organization:{
		type:Schema.Types.ObjectId,
		ref:'Organisation'
	},
	role:{
		type:String,
		required:true
	},
	createdAt:{
		type:Date,
		default:Date.now
	},
	updatedAt:{
		type:Date,
		default:Date.now
	}
});

const Users = model<IUSER>('Users', userSchema);

export default Users;
