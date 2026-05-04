import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { User } from "../models/User.js";

const router = express.Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const getMailerConfig = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = String(process.env.SMTP_SECURE || "true") === "true";
  const from = process.env.EMAIL_FROM || user;

  if (!user || !pass || !from) {
    return null;
  }

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass }
    }),
    from
  };
};

const getResetUrl = (token) => {
  const clientUrl = process.env.CLIENT_URL;

  if (!clientUrl) {
    throw new Error("CLIENT_URL is not configured.");
  }

  return `${clientUrl.replace(/\/$/, "")}/reset-password/${token}`;
};

router.post("/register", async (req, res) => {
  try {
    const name = req.body?.name?.trim();
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (name.length < 2 || name.length > 60) {
      return res.status(400).json({ message: "Name must be between 2 and 60 characters." });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({ message: "Password must be between 6 and 128 characters." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to register user." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to log in." });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "If an account exists for this email, a reset link has been sent." });
    }

    const mailer = getMailerConfig();
    if (!mailer) {
      return res.status(500).json({
        message: "Password reset email is not configured on the server."
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = getResetUrl(resetToken);

    await mailer.transporter.sendMail({
      from: `"PC Builder" <${mailer.from}>`,
      to: user.email,
      subject: "Reset your PC Builder password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #0ea5e9; margin-bottom: 12px;">Reset your password</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset your PC Builder account password.</p>
          <p style="margin: 24px 0;">
            <a
              href="${resetUrl}"
              style="display:inline-block;padding:12px 20px;background:#0ea5e9;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;"
            >
              Reset Password
            </a>
          </p>
          <p>This link expires in 1 hour.</p>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `
    });

    return res.json({ message: "If an account exists for this email, a reset link has been sent." });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message === "CLIENT_URL is not configured."
          ? "Password reset URL is not configured on the server."
          : "Failed to send reset email. Please try again."
    });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password reset successful. You can now log in." });
  } catch (_error) {
    return res.status(500).json({ message: "Failed to reset password." });
  }
});

export default router;
