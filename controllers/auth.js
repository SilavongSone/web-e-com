const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    //code
    const { email, password } = req.body;
    // Step 1 : Validate Body
    if (!email || !email.includes("@")) {
      return res
        .status(400)
        .json({ message: "Email is required and should @" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password is required and should be min 6 characters long",
      });
    }
    // Step 2 : Check Email in DB
    // const user = await prisma.user.findUnique({
    //   where: {
    //     email: email,
    //   },
    // });
    // if (!user) {
    //   return res.status(400).json({ message: "User Already Exists" });
    // }

    // Step 3 : Hash Password
    const hashPassword = await bcrypt.hash(password, 10);

    // Step 4 : Register
    await prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
      },
    });

    res.send("Register Success");
  } catch (err) {
    //err
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/auth/register" });
  }
};
exports.login = async (req, res) => {
  try {
    //code
    const { email, password } = req.body;
    // Step 1 : Check Email in DB
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user || !user.enabled) {
      return res.status(400).json({ message: "User Not Found or not Enable" });
    }
    // Step 2 : Check Password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Password Not Match" });
    }
    // Step 3 : Create payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Step 4 : Generate Token
    jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        return res.status(500).json({ message: "JWT Error" });
      }
      res.json({ payload, token });
    });
  } catch (err) {
    //err
    console.log(err);
    res.status(500).json({ massage: "Server Error In Controllers/auth/Login" });
  }
};
exports.currentUser = async (req, res) => {
  try {
    //code
    res.send("Hello CurrentUser Introller");
  } catch (err) {
    //err
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/auth/CurrentUser" });
  }
};
