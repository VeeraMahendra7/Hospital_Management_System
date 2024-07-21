import mongoose from "mongoose";

export const Connect = () => {
    mongoose
    .connect(process.env.MONGODB_URI,{
        dbName: "MERN_STACK",
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000, 
    })
    .then(()=>{
        console.log('Connect to Database');
    })
    .catch((err) => {
        console.log('Cannot connect to Database');
    })
}