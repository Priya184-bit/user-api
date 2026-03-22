// Import express
const express = require("express");
const app = express();

// Middleware to parse JSON
app.use(express.json());

// In-memory data store
let users = [
  {
    id: "1",
    firstName: "Anshika",
    lastName: "Agarwal",
    hobby: "Teaching"
  }
];

// ==========================
// Logging Middleware (15 marks)
// ==========================
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ==========================
// Validation Middleware (15 marks)
// ==========================
function validateUser(req, res, next) {
  const { firstName, lastName, hobby } = req.body;

  if (!firstName || !lastName || !hobby) {
    return res.status(400).json({
      message: "All fields (firstName, lastName, hobby) are required"
    });
  }

  next();
}

// ==========================
// ROUTES (25 marks)
// ==========================

// GET all users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

// GET user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

// POST create user
app.post("/user", validateUser, (req, res) => {
  const newUser = {
    id: (users.length + 1).toString(),
    ...req.body
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// PUT update user
app.put("/user/:id", validateUser, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[userIndex] = {
    id: req.params.id,
    ...req.body
  };

  res.status(200).json(users[userIndex]);
});

// DELETE user
app.delete("/user/:id", (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const deletedUser = users.splice(userIndex, 1);

  res.status(200).json({
    message: "User deleted successfully",
    user: deletedUser
  });
});

// ==========================
// Error Handling (10 marks)
// ==========================

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})