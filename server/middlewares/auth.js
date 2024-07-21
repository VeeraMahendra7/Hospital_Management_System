import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import jwt from 'jsonwebtoken';
import ErrorHandler from "./errorMiddleware.js";

export const isAdminAuthenticated = catchAsyncErrors( async(req,res,next) => {
    const token = req.cookies.adminToken;
    if(!token){
        return next(new ErrorHandler("Admin Not Authenticate",400));
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decode.id);
    if(req.user.role !== 'Admin'){
        return next(new ErrorHandler(`${req.user.role} not authorised`,400));
    }
    next();
});

export const isPatientAuthenticated = catchAsyncErrors( async(req,res,next) => {
    const token = req.cookies.patientToken;
    if(!token){
        return next(new ErrorHandler("Patient Not Authenticate",400));
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decode.id);
    if(req.user.role !== 'Patient'){
        return next(new ErrorHandler(`${req.user.role} not authorised`,400));
    }
    next(); 
} )