const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

async function registerUser(email, password, database) {
  if (!email || !password) {
    throw { status: 400, message: "Email and password are required" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await database.collection("users").insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
    return { message: "User registered successfully" };
  } catch (error) {
    if (error.code === 11000) {
      throw { status: 400, message: "Email already exists" };
    }
    throw { status: 500, message: "Internal server error" };
  }
}

async function loginUser(email, password, database) {
  const user = await database.collection("users").findOne({ email });
  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "24h",
  });
  return { token };
}

module.exports = { registerUser, loginUser };
