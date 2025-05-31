import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from "drizzle-orm";
import { getConnection, users } from "@url4irl/db";
import { generateId, validateEmail } from "@url4irl/core";
import { AuthCredentials, AuthResult, TokenPayload } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 12;

export async function register(credentials: AuthCredentials): Promise<AuthResult> {
  try {
    if (!validateEmail(credentials.email)) {
      return { success: false, error: "Invalid email format" };
    }

    if (credentials.password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long" };
    }

    const db = getConnection();
    
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, credentials.email))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "User with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(credentials.password, SALT_ROUNDS);
    
    const newUser = {
      id: generateId(),
      email: credentials.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(users).values(newUser).returning();
    const user = result[0];
    
    const token = jwt.sign(
      { userId: user.id, email: user.email } as TokenPayload,
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password, ...userWithoutPassword } = user;

    return { 
      success: true, 
      token, 
      user: userWithoutPassword 
    };
  } catch (error) {
    return { success: false, error: `Registration failed: ${error}` };
  }
}

export async function login(credentials: AuthCredentials): Promise<AuthResult> {
  try {
    const db = getConnection();
    
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, credentials.email))
      .limit(1);

    if (result.length === 0) {
      return { success: false, error: "Invalid email or password" };
    }

    const user = result[0] as any;
    
    if (!user.password) {
      return { success: false, error: "Invalid email or password" };
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    
    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password" };
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email } as TokenPayload,
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password, ...userWithoutPassword } = user;

    return { 
      success: true, 
      token, 
      user: userWithoutPassword 
    };
  } catch (error) {
    return { success: false, error: `Login failed: ${error}` };
  }
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function refreshToken(oldToken: string): Promise<AuthResult> {
  try {
    const payload = verifyToken(oldToken);
    
    if (!payload) {
      return { success: false, error: "Invalid token" };
    }

    const db = getConnection();
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (result.length === 0) {
      return { success: false, error: "User not found" };
    }

    const user = result[0];
    const newToken = jwt.sign(
      { userId: user.id, email: user.email } as TokenPayload,
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password, ...userWithoutPassword } = user as any;

    return { 
      success: true, 
      token: newToken, 
      user: userWithoutPassword 
    };
  } catch (error) {
    return { success: false, error: `Token refresh failed: ${error}` };
  }
}