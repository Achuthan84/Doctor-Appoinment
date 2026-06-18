import express from "express";
import { addPrescription, getUserPrescriptions, getPrescriptionByAppointment } from "../Controller/prescriptionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("doctor"), addPrescription);
router.get("/user", authMiddleware, roleMiddleware("user"), getUserPrescriptions);
router.get("/appointment/:id", authMiddleware, getPrescriptionByAppointment);

export default router;