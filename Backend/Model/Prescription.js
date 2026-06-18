import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
    {
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment"
        },

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor"
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        medicines: [
            {
                name: String,
                dosage: String,
                duration: String
            }
        ],

        notes: String
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Prescription", prescriptionSchema);