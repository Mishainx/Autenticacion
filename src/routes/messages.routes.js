import { Router } from "express";
import { getMessages, getMessagesArray } from "../controllers/messages.controllers.js";
const router = Router();

router.get("/", getMessages);
router.get("/", getMessagesArray);

export default router;