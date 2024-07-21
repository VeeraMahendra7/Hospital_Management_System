import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
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
    appointment_date:{
        type:String,
        required:true
    },
    dept:{
        type:String,
        required:true
    },
    doctor:{
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        }
    },
    hasVisited:{
        type:Boolean,
        default:false
    },
    doctorId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    patientId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending",
    },
});

export const Appointment = mongoose.model('Appointment',appointmentSchema);