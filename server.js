const express = require('express');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Global variable to store TODO items
let todos = [];

// Helper function to find a TODO by ID
const findTodoIndex = (id) => todos.findIndex((todo) => todo.id === id);

// GET all TODOs
app.get('/todos', (req, res) => {
  res.json(todos);
});

// GET a single TODO by ID
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((todo) => todo.id === id);

  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ message: 'TODO not found' });
  }
});

// POST a new TODO
app.post('/todos', (req, res) => {
  const { title, completed = false } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const newTodo = {
    id: todos.length + 1,
    title,
    completed,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT (update) a TODO
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;
  const todoIndex = findTodoIndex(id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: 'TODO not found' });
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    title: title || todos[todoIndex].title,
    completed: completed !== undefined ? completed : todos[todoIndex].completed,
  };

  res.json(todos[todoIndex]);
});

// DELETE a TODO
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = findTodoIndex(id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: 'TODO not found' });
  }

  const [deletedTodo] = todos.splice(todoIndex, 1);
  res.json(deletedTodo);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
  console.log(`TODO API server running on http://localhost:${port}`);
});
