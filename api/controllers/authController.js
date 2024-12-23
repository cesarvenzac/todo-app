const { registerUser, loginUser } = require("../services/authService");

async function register(req, res, database) {
  try {
    const { email, password } = req.body;
    const result = await registerUser(email, password, database);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function login(req, res, database) {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password, database);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = { register, login };
