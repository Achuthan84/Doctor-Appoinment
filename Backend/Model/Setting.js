import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      default: "Doctor Appointment"
    },

    commissionPercentage: {
      type: Number,
      default: 10
    },

    logo: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Setting", settingSchema);vv