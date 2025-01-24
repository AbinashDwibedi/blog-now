import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB server connected successfully: ", connectionInstance.connection.host);

    } catch (error) {
        console.log("MongoDB connection failed: ",error);
    }
}