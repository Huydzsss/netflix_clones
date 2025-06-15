import mongoose from "mongoose";

import { ENV_VARS } from "./envVars.js";

export const connectDB = async  () =>{
    try{
      const cnt = await mongoose.connect(ENV_VARS.MONGO_URI);
        console.log("MONGO connected: " + cnt.connection.host);
    }catch(error){
        console.log("Error connecting to MONGODB: " + error.message);
        process.exit(1);
    }
}