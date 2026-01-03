import { Router } from "express";
import * as typingController from "../../controller/typing_controller.js";

const router = Router();

// Get random typing text (public endpoint, no auth required)
router.get("/text", typingController.getRandomTypingText);

export default router;

