import mongoose, { connect } from "mongoose";

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB);
        console.log("DB CONNECTED");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

export default ConnectDB;