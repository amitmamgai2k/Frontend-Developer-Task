import express from "express";
import {
  getTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getTodos);
router.route("/create").post(protect, createTodo);
router
  .route("/:id")
  .get(getTodoById)
  .put(protect, updateTodo)
  .delete(protect, deleteTodo);

export default router;
