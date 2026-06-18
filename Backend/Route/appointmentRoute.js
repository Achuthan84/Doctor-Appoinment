import express from "express";
import { bookAppointment, getUserAppointments, getDoctorAppointments, cancelAppointment, rescheduleAppointment, completeAppointment } from "../Controller/appointmentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/book", authMiddleware, roleMiddleware("user"), bookAppointment);
router.get("/user", authMiddleware, roleMiddleware("user"), getUserAppointments);
router.get("/doctor", authMiddleware, roleMiddleware("doctor"), getDoctorAppointments);
router.put("/cancel/:id", authMiddleware, roleMiddleware("user"), cancelAppointment,);
router.put("/reschedule/:id", authMiddleware, roleMiddleware("user"), rescheduleAppointment)
router.put("/complete/:id", authMiddleware, roleMiddleware("doctor"), completeAppointment);

export default router;
