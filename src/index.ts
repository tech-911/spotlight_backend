import express from "express";
const app = express();
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
const authRoute = require("./routes/auth.route");
const appRoute = require("./routes/app.route");
import * as admin from "firebase-admin";
const { verifyToken } = require("./verification/verifyJWT");
// import { ServiceAccount } from "firebase-admin";

// Load environment variables from .env file
dotenv.config();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

//Cross-Origin Resource Sharing (CORS) handler
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

//===================== configure DB and connect =====================
const dbConnect = process.env.DB_CONNECT;
if (!dbConnect) {
  throw new Error("DB_CONNECT environment variable is not defined");
}
mongoose
  .connect(dbConnect)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

//===================== Initialize Firebase admin =====================
const firebaseCredentials = process.env.FIREBASE_ADMIN_SDK_CREDENTIALS;
if (!firebaseCredentials) {
  throw new Error(
    "FIREBASE_ADMIN_SDK_CREDENTIALS environment variable is not defined"
  );
}
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(firebaseCredentials)),
});

//===================== Middleware Routes =====================
//-------- Entry Route ----------
app.get("/", (req, res) => {
  res.send({ message: "Welcome to test endpont" });
});
//-------Auth route----------
app.use("/api/auth", authRoute);
//-------Application route----------
app.use("/api/app", verifyToken, appRoute);

//===================== Declare server port and listen =====================
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`Running on port: ${PORT} use: http://localhost:${PORT}/`);
});
