import {Schema,model,models} from "mongoose";

const userSchema = new Schema({ 
 email: {
    type:String,
    unique:[true,'Email already exists'],
    required:[true,'Email is required'],
    match:[/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    'Please Provide Valid email'],
 },
 username: {
    type:String,
    required:[true,'Username is required'],
    min: 3,
 },
 
 password: {
    type:String,
    required:[true,'Password is required'],
    min: 5
 },

 profilePic: {
    type:String
 }
}) 

const User = models.User || model('User',userSchema)

export default User