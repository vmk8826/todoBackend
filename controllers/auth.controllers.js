import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    
    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
    });
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ success: true, message: "User created successfully", user });

  } catch (error) {

    res.status(500).json({ message: "Internal server error" });

  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {    
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Login successful", user });

  } catch (error) {

    res.status(500).json({ message: "Internal server error" });

  }
};

export const logout = async (req, res) => {
  try {

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 0,
    });

    res.status(200).json({ success: true, message: "Logout successful" });

  } catch (error) {

    res.status(500).json({ message: "Internal server error" });

  }
};

export const verifyAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({ success: true, message: "Authenticated", user });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};