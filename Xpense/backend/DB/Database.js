import mongoose from "mongoose";

export const connectDB = async (req, res) => {
    try{
        const db = process.env.MONGO_URL;

    const {connection} = await mongoose.connect(db, { useNewUrlParser: true });

    console.log(`MongoDB Connected to ${connection.host}`);
    }catch(err){
        console.log(err)
    }
    

}