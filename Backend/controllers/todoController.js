import asyncHandler from "express-async-handler";
import Todo from "../models/todoModel.js";

// @desc    Get all todos for a user
// @route   GET /api/todos
// @access  Private
const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ user: req.user._id });
  res.json(todos);
});

// @desc    Create a todo
// @route   POST /api/todos/create
// @access  Private
const createTodo = asyncHandler(async (req, res) => {
  const { title, description, status, priority } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const todo = new Todo({
    user: req.user._id,
    title,
    description,
    status,
    priority,
  });

  const createdTodo = await todo.save();
  res.status(201).json(createdTodo);
});

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
const getTodoById = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = asyncHandler(async (req, res) => {
  const { title, description, status, priority } = req.body;
  const todo = await Todo.findById(req.params.id);

  if (todo) {
    if (todo.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("You can't perform this action");
    }

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.status = status || todo.status;
    todo.priority = priority || todo.priority;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } else {
    res.status(404);
    throw new Error("Todo not found");
  }
});

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (todo) {
    if (todo.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("You can't perform this action");
    }

    await todo.deleteOne();
    res.json({ message: "Todo removed" });
  } else {
    res.status(404);
    throw new Error("Todo not found");
  }
});

export { getTodos, createTodo, getTodoById, updateTodo, deleteTodo };
