import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Register or login a user
export const registerUser = async (req, res) => {
  const { uid, email, displayName, photoURL } = req.body;
  console.log(uid, email, displayName, photoURL);

  if (!uid || !email) {
    return res.status(400).json({ error: "Login Error" });
  }

  try {
    let user = await User.findOne({ uid });

    if (!user) {
      // Create a new user if not found
      user = await User.create({ uid, email, displayName, photoURL });
    }

    // Generate JWT token
    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return both user data and token in the response
    res.json({
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, please try again." });
  }
};

// Protected route example (you'd need authentication middleware to protect this)
export const protectedRoute = (req, res) => {
  res.json({ uid: req.user.uid, email: req.user.email });
};
