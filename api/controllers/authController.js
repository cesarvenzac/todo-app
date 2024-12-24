const { registerUser, loginUser } = require("../services/authService");

async function register(req, res, database) {
  try {
    const { email, password, firstname, lastname, phone, birthdate, allowNewsletter, consent } =
      req.body;
    const avatarPath = req.file ? req.file.path : null;
    console.log("Registering user with email:", email);
    const result = await registerUser(
      email,
      password,
      firstname,
      lastname,
      phone,
      birthdate,
      allowNewsletter,
      consent,
      avatarPath,
      database
    );
    res.status(201).json(result);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function login(req, res, database) {
  try {
    const { email, password } = req.body;
    console.log("Logging in user with email:", email);
    const result = await loginUser(email, password, database);
    res.json(result);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

module.exports = { register, login };
