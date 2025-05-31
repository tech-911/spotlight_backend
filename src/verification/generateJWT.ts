// auth.controller.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

export interface User {
  _id: string;
  email: string;
  role?: string;
}

function generateToken(user: User) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role || "user", // optional
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
}

module.exports = { generateToken };
