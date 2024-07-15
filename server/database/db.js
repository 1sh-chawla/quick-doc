import mongoose from "mongoose";

const connectDB = async (URL) => {
    try {
        await mongoose.connect(URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Error connecting to database ", error);
    }
}

export default connectDB;