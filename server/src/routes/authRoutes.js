import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { User } from "../models/User.js";

const router = express.Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── JWT helper ───────────────────────────────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// ─── Nodemailer transporter ───────────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// ─── REGISTER ─────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const name = req.body?.name?.trim();
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email, and password are required." });

    if (name.length < 2 || name.length > 60)
      return res.status(400).json({ message: "Name must be between 2 and 60 characters." });

    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Please provide a valid email address." });

    if (password.length < 6 || password.length > 128)
      return res.status(400).json({ message: "Password must be between 6 and 128 characters." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "An account with this email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Failed to register user." });
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Please provide a valid email address." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password." });

    return res.json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Failed to log in." });
  }
});

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();

    if (!email || !emailRegex.test(email))
      return res.status(400).json({ message: "Please provide a valid email address." });

    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user)
      return res.json({ message: "If an account exists for this email, a reset link has been sent." });

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save to user (expires in 1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    // Build reset URL
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"PC Builder" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request – PC Builder",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #6366f1;">PC Builder – Password Reset</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>You requested a password reset. Click the button below to set a new password:</p>
          <a href="${resetURL}" 
             style="display:inline-block; padding:12px 24px; background:#6366f1; color:#fff;
                    text-decoration:none; border-radius:6px; margin: 16px 0;">
            Reset My Password
          </a>
          <p style="color:#888; font-size:13px;">This link expires in <strong>1 hour</strong>.</p>
          <p style="color:#888; font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border:none; border-top:1px solid #eee; margin-top:24px;" />
          <p style="color:#aaa; font-size:12px;">PC Builder App</p>
        </div>
      `,
    });

    return res.json({ message: "If an account exists for this email, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Failed to send reset email. Please try again." });
  }
});

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters." });

    // Hash the incoming token to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Reset link is invalid or has expired." });

    // Update password and clear reset fields
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Failed to reset password." });
  }
});

export default router;