import express from "express";

import { approveDoctor, getPendingDoctors, getAllUsers, getAllAppointments, updateSettings, getDashboard } from "../Controller/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.patch("/approve-doctor/:id", authMiddleware, roleMiddleware("admin"), approveDoctor);
router.get("/pending-doctors", authMiddleware, roleMiddleware("admin"), getPendingDoctors);
router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.get("/appointments", authMiddleware, roleMiddleware("admin"), getAllAppointments);
router.put("/settings", authMiddleware, roleMiddleware("admin"), updateSettings);
router.get("/dashboard", authMiddleware, roleMiddleware("admin"), getDashboard);


export default router;
