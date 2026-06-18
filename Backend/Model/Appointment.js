import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },

        slotDate: {
            type: String,
            required: true
        },

        slotTime: {
            type: String,
            required: true
        },

        doctorFee: Number,

        commission: Number,

        totalFee: Number,

        status: {
            type: String,
            enum: [
                "booked",
                "completed",
                "cancelled",
                "rescheduled"
            ],
            default: "booked"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Appointment", appointmentSchema);