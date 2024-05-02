import mongoose from "mongoose";

let isConnected: boolean = false;
export const connectDB = async (): Promise<void> => {
    mongoose.set("strictQuery", true);
    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI || "", {
           dbName: process.env.MONGODB_DB,
        });
        isConnected = true;
        console.log("MongoDB connected");
    } catch (e) {
        console.log("MongoDB connection error", e);
    }
};