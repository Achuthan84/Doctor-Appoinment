import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    specialization: {
      type: String,
      required: true
    },
    experience: {
      type: Number,
      required: true
    },
    qualification: {
      type: String,
      required: true
    },
    fee: {
      type: Number,
      required: true
    },
    certificate: {
      type: String,
      required: true
    },
    approved: {
      type: Boolean,
      default: false
    },

    availableSlots: [
      {
        date: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Doctor", doctorSchema);