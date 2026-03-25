const express = require("express");

const { listUsers, createUser, deleteUser } = require("../database/users");

// cria um router
const router = express.Router();

// curl -X GET http://localhost:3011/users
router.get("/", async function (req, res) {
  const users = await listUsers();
  res.status(200).json(users);
});

// curl -X POST http://localhost:3011/users  -H "Content-Type: application/json" \ -d '{"name":"Marcello","email":"teste@email.com"}'
router.post("/", async function (req, res) {
  const { name, email } = req.body;
  const user = await createUser({ name, email });
  res.status(201).json(user);
});

// http://localhost:3011/users
// curl -X DELETE http://localhost:3011/users/1
router.delete("/:id", async function (req, res) {
  const id = req.params.id;
  const user = await deleteUser(id);
  if (user.message) {
    res.status(404).json(user);
  } else {
    res.status(200).json(user);
  }
});

module.exports = router;
