import { BaseService } from "./base.service";
import { User } from "../types";
import { DatabaseService } from "../types";
import { compare, hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { config } from "../config";
import { RegisterInput } from "../schemas/auth.schema";
import { ObjectId } from "mongodb";

export class AuthService extends BaseService<User> {
  constructor(db: DatabaseService) {
    super(db, "users");
  }

  async register(
    userData: RegisterInput & { avatarPath?: string }
  ): Promise<Omit<User, "password">> {
    // Check if user exists
    const existingUser = await this.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await hash(userData.password, 10);

    // Create user with required fields
    const user = await this.create({
      email: userData.email,
      password: hashedPassword,
      firstname: userData.firstname,
      lastname: userData.lastname,
      phone: userData.phone,
      birthdate: userData.birthdate,
      avatarPath: userData.avatarPath,
      allowNewsletter: userData.allowNewsletter,
      consent: userData.consent,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: Omit<User, "password"> }> {
    // Find user
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check password
    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    // Generate token
    const token = sign({ userId: user._id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const decoded = verify(token, config.jwt.secret) as { userId: string };
      console.log("Decoded token payload:", decoded);

      // Convert string ID to ObjectId
      const objectId = new ObjectId(decoded.userId);
      console.log("Searching for user with ObjectId:", objectId);

      const user = await this.findOne({ _id: objectId }); // Use ObjectId instead of string
      console.log("Database query result:", user);

      return user;
    } catch (error) {
      console.error("Token validation error:", error);
      return null;
    }
  }
}
