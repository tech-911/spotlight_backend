// auth.middleware.js
import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).send({
      message: "Authorization header with Bearer token is required",
    });
  }
  const token = authHeader.split(" ")[1]; // Extract the token part

  if (!token)
    return res
      .status(401)
      .json({ message: "No token provided, please authenticate" });

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    if (err)
      return res
        .status(401)
        .setHeader("Content-Type", "application/json")
        .json({ message: "Token is invalid or expired", error: err });
    req.user = user; // decoded token payload
    next();
  });
}

module.exports = { verifyToken };
