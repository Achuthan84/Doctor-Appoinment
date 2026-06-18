import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
    {
        commissionPercentage: {
            type: Number,
            default: 10
        },
        appName: {
            type: String,
            default: "Doctor Appointment"
        },

        logo: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Setting", settingSchema);