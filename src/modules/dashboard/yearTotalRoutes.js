import express from "express";
import { totalYear, totalMonth } from "../dashboard/yearTotal.controller.js";

const router = express.Router();

router.get("/totalyear", totalYear);
router.get("/totalmonth", totalMonth);

export default router;
