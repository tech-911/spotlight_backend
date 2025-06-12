import { Request, Response } from "express";
import * as admin from "firebase-admin";
import User from "../model/User";
const { generateToken } = require("../verification/generateJWT");

// --------------------Welcome Controller--------------------
const index = (res: Response) => {
  console.log("a get request was made to /");
  res.status(201).send("Welcome to spotlight 💗");
};

// --------------------Google Authentication Controller--------------------

const googlesignup = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const { checkEmail } = req.body;

  if (!checkEmail)
    return res.status(400).send({ message: "Email is required!!" });

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).send({
      message: "Authorization header with Bearer token is required",
      got: authHeader,
    });
  }
  const idToken = authHeader.split(" ")[1]; // Extract the token part
  const existingUser = await User.findOne({ email: checkEmail });
  console.log("existing user: ", existingUser);
  if (!existingUser) {
    let authenticatedUser;
    try {
      authenticatedUser = await admin.auth().verifyIdToken(idToken as string);
    } catch (error) {
      console.log("Error verifying ID token:", error);
      return res
        .status(401)
        .send({ message: "Invalid ID token", error: error });
    }
    console.log("authenticated user:", authenticatedUser);

    if (!authenticatedUser)
      return res.status(401).send({ message: "Invalid ID token" });

    const { name, picture, uid, email, email_verified } =
      authenticatedUser as admin.auth.DecodedIdToken;

    //validate if request email matches the authenticated user's email

    if (checkEmail !== email) {
      return res.status(400).send({
        message: "UnAuthorized email access",
        description:
          "Email provided does not match the authenticated user's email, verify client and try a gain with authorized email",
      });
    }

    const CreatedUser = await User.create({
      name,
      picture,
      user_id: uid,
      email,
      email_verified,
    });
    if (CreatedUser) {
      console.log("User created successfully:", CreatedUser);
      //------------ generate user's token
      const token = generateToken({
        _id: CreatedUser?._id?.toString(),
        email: checkEmail,
        role: "user",
      });
      return res.status(201).send({
        message: "User created successfully",
        user: CreatedUser,
        token,
      });
    }
    return res.status(500).send({ message: "User creation failed" });
  } else {
    //------------ generate user's token
    const token = generateToken({
      _id: existingUser?._id?.toString(),
      email: checkEmail,
      role: "user",
    });
    return res.status(200).send({
      message: "User already exists, login successful",
      token,
      user: existingUser,
    });
  }
};

export { index, googlesignup };
