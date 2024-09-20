const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const config = require("../config/config");

exports.signup = async (req, res) => {
  const { name, username, email, phone, password } = req.body;

  try {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        status: "fail",
        message: "Username is already taken",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        status: "fail",
        message: "Email is already registered",
      });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        status: "fail",
        message: "Phone number is already registered",
      });
    }

    const newUser = await User.create({
      name,
      username,
      email,
      phone,
      password,
    });

    res.status(201).json({
      status: "success",
      message: "User successfully signed up",
      data: { user: newUser },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: `Signup failed: ${err.message}`,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }
    
    const token = jwt.sign({ id: user._id }, config.jwtSecretKey, {
      expiresIn: "1d",
    });

    const userWithToken = {
      ...user._doc,
      token,
    };

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { user: userWithToken },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: `Login failed: ${err.message}`,
    });
  }
};
