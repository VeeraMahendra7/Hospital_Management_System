import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength: [3, "First Name Must Contain At Least 3 characters"]
    },
    lastName:{
        type:String,
        required:true,
        minLength: [3, "Last Name Must Contain At Least 3 characters"]
    },
    email:{
        type:String,
        required:true,
        validate : [validator.isEmail, "Please Provide A Valid Email"]
    },
    phone:{
        type:String,
        required:true,
        minLength: [10, "Phone Number Must Contain Exact 10 digits"],
        maxLength: [10, "Phone Number Must Contain Exact 10 digits"]
    },
    nic:{
        type:String,
        required:true,
        minLength: [10, "NIC Must Contain Exact 10 digits"],
        maxLength: [10, "NIC Must Contain Exact 10 digits"]
    },
    dob:{
        type:Date,
        required:[true, "DOB is required"],
    },
    gender:{
        type:String,
        enum:["Male","Female"],
    },
    passwd:{
        type:String,
        minLength:[8,"Password contain atleast 8 characters"],
        required:true,
        select: false,
    },
    role:{
        type:String,
        enum:["Admin","Patient","Doctor"],
    },
    docDept:{
        type:String,
    },
    docAvatar:{
        public_id:String,
        url:String,
    }
})

userSchema.pre("save", async function(next){
    if(!this.isModified("passwd")){
        next();
    }
    this.passwd = await bcrypt.hash(this.passwd, 10);
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.passwd); 
}

userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    })
}

export const User = mongoose.model("User",userSchema);