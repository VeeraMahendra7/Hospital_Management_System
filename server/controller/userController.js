import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js'
import ErrorHandler from '../middlewares/errorMiddleware.js';
import { User } from '../models/userSchema.js';
import { generateToken } from '../utils/jwtToken.js'
import cloudinary from 'cloudinary';


export const patientRegister = catchAsyncErrors( async(req,res,next) => {
    const {firstName,lastName,email,phone,passwd,gender,dob,nic,role} = req.body;
    if(!firstName || !lastName || !email || !phone || !passwd || !gender || !dob || !nic || !role){
        return next(new ErrorHandler("Please Fill Full Form", 400));
    }
    const user = await User.findOne({email});
    if(user){
        return next(new ErrorHandler("User Already Registered !", 400));
    }
    user = await User.create({
        firstName,lastName,email,phone,passwd,gender,dob,nic,role
    });
    generateToken(user, "User Registered" , 200, res);
});

export const login = catchAsyncErrors( async(req,res,next) => {
    const { email,passwd, confirmPasswd,role } = req.body;

    if(!email || !passwd || !confirmPasswd || !role){
        return next(new ErrorHandler("Please Provide All Details !",400));
    }
    if(passwd !== confirmPasswd){
        return next(new ErrorHandler("Not Matched Passwords !!!",400));
    }
    const user = await User.findOne({email}).select("+passwd");
    if(!user){
        return next(new ErrorHandler("Invalid Email !",400));
    }
    const isPasswordMatched = await user.comparePassword(passwd);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password !",400));
    }
    if(role !== user.role){
        return next(new ErrorHandler("User Not Found !",400));
    }
    
    generateToken(user, "User LogedIn" , 200, res);
})


export const addNewAdmin = catchAsyncErrors( async(req,res,next) => {
    const { firstName,lastName,email,phone,passwd,gender,dob,nic } = req.body;
    if(!firstName || !lastName || !email || !phone || !passwd || !gender || !dob || !nic){
        return next(new ErrorHandler("Please Fill Full Form", 400));
    }
    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email already exists`,400));
    }
    const admin = await User.create({
        firstName,lastName,email,phone,passwd,gender,dob,nic, role: "Admin"
    })
    res.status(201).json({
        success: true,
        message: "New Admin registered !",
    })

});

export const getAllDoctors = catchAsyncErrors( async(req,res,next) => {
    const doctors = await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctors,
    })
})

export const getUserDetails = catchAsyncErrors( async(req,res,next) => {
    const user = req.user;
    res.status(200).json({
        success: true,  
        user,
    })
})

export const getAdminLogout = catchAsyncErrors( async(req,res,next) => {
    res
    .status(200)
    .cookie("adminToken", "" ,{
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        mesaage: "Admin LoggedOut Successfully !",
    })
})

export const getPatientLogout = catchAsyncErrors( async(req,res,next) => {
    res
    .status(200)
    .cookie("patientToken", "" ,{
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        mesaage: "Patient LoggedOut Successfully !",
    })
})

export const addDoctor = catchAsyncErrors( async(req,res,next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Doctor Avator required !", 400));
    }
    const {docAvatar} = req.files;
    const allowedFormats = ["image/png","image/jpeg"];
    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("File Format Not Supported",400));
    }
    const {firstName,lastName,email,phone,passwd,gender,dob,nic,docDept} = req.body;
    if(!firstName || !lastName || !email || !phone || !passwd || !gender || !dob || !nic || !docDept){
        return next(new ErrorHandler("Please Fill Full Form !", 400));
    }
    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} already registered with email`, 400));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath);
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.log("Cloudinary Error", cloudinaryResponse.error || "unknown cloudinary error");
    }
    const doctor = await User.create({
        firstName,lastName,email,phone,passwd,gender,dob,nic,docDept,role:"Doctor",
        docAvatar:{
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    })
    res.status(200).json({
        success: true,
        message: "New Doctor Added Successfully",
        doctor,
    })
})