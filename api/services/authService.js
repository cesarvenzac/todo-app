const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

async function registerUser(
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
) {
  if (
    !email ||
    !password ||
    !firstname ||
    !lastname ||
    !phone ||
    !birthdate ||
    allowNewsletter === undefined ||
    consent === undefined
  ) {
    console.error("Missing required fields");
    throw { status: 400, message: "All fields are required" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await database.collection("users").insertOne({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      phone,
      birthdate,
      allowNewsletter,
      consent,
      avatar: avatarPath,
      createdAt: new Date(),
    });
    return { message: "User registered successfully" };
  } catch (error) {
    console.error("Error inserting user:", error);
    if (error.code === 11000) {
      throw { status: 400, message: "Email already exists" };
    }
    throw { status: 500, message: "Internal server error" };
  }
}

async function loginUser(email, password, database) {
  console.log("Attempting to log in user with email:", email);
  const user = await database.collection("users").findOne({ email });
  if (!user) {
    console.error("User not found");
    throw { status: 401, message: "Invalid credentials" };
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    console.error("Invalid password");
    throw { status: 401, message: "Invalid credentials" };
  }

  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "24h",
  });
  return { token };
}

module.exports = { registerUser, loginUser };
