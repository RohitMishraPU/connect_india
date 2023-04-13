import { Request } from "express";
import { IUSER } from "./models/Users";
import { Types } from "mongoose";

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string; // optional property
}

export interface AuthorisedRequest extends Request{
  user : IUSER & { _id : Types.ObjectId}
}
