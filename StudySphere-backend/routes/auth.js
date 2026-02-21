import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Get user type options
router.get("/user-types", (req, res) => {
  res.json({
    types: [
      { id: 'student', label: 'Student', description: 'Access study materials, track progress, and join classes' },
      { id: 'teacher', label: 'Teacher', description: 'Create and manage courses, track student progress' }
    ]
  });
});

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, userType, grade, qualifications, expertise, subjects } = req.body;

    // Validate required fields based on user type
    if (userType === 'student' && !grade) {
      return res.status(400).json({ message: "Grade is required for students" });
    }
    if (userType === 'teacher' && !qualifications) {
      return res.status(400).json({ message: "Qualifications are required for teachers" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Determine if this user should be an admin.
    // Priority:
    // 1) Explicit ADMIN_EMAIL match.
    // 2) If no admin exists yet, bootstrap first admin account.
    const hasAdmin = (await User.countDocuments({ isAdmin: true })) > 0;
    const adminEmailMatches =
      process.env.ADMIN_EMAIL &&
      process.env.ADMIN_EMAIL.toLowerCase() === email.toLowerCase();
    const isAdmin = Boolean(adminEmailMatches || !hasAdmin);

    // Create new user instance
    const newUser = new User({
      username,
      email,
      password,
      userType,
      grade: userType === 'student' ? grade : undefined,
      qualifications: userType === 'teacher' ? qualifications : undefined,
      expertise: userType === 'teacher' ? expertise : undefined,
      subjects: userType === 'student' ? subjects : undefined,
      isAdmin,
    });

    await newUser.save();

    // Log registration to console
    console.log(`\n📝 New ${userType} registered:`);
    console.log(`👤 Username: ${username}`);
    console.log(`📧 Email: ${email}`);
    console.log(`📅 Date: ${new Date().toLocaleString()}`);
    console.log('----------------------------------------');

    // Generate JWT Token
    const token = jwt.sign({ 
      userId: newUser._id,
      userType: newUser.userType
    }, process.env.JWT_SECRET, {
      expiresIn: "24h"
    });

    // Return response without password
    const userWithoutPassword = { ...newUser.toObject() };
    delete userWithoutPassword.password;

    res.status(201).json({
      message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} registered successfully!`,
      token,
      user: userWithoutPassword,
      dashboard: newUser.getDashboard()
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Ensure an admin exists for operational access.
    // If none exists, promote the first successfully authenticated user.
    if (!user.isAdmin) {
      const hasAdmin = (await User.countDocuments({ isAdmin: true })) > 0;
      if (!hasAdmin) {
        user.isAdmin = true;
      }
    }

    // Compare entered password with hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log login to console
    console.log(`\n🔐 User logged in:`);
    console.log(`👤 Username: ${user.username}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👥 Type: ${user.userType}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    console.log('----------------------------------------');

    // Generate JWT token
    const token = jwt.sign({ 
      userId: user._id,
      userType: user.userType
    }, process.env.JWT_SECRET, {
      expiresIn: "24h"
    });

    // Return user data without password
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    res.json({
      message: "Login successful!",
      token,
      user: userWithoutPassword,
      dashboard: user.getDashboard()
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Logout Route (client-side token invalidation for JWT flows)
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

// Get User Profile (Protected Route)
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
});

// Update user profile
router.put("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update allowed fields
    const allowedUpdates = ['username', 'bio', 'profilePicture', 'subjects', 'expertise'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    // Log profile update
    console.log(`\n📝 Profile updated:`);
    console.log(`👤 Username: ${user.username}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    console.log('----------------------------------------');

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

export default router;
