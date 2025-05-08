const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

exports.authCheck = async (req, res, next) => {
  try {
    // code
    const headerToken = req.headers.authorization;
    if (!headerToken) {
      return res.status(401).json({ massage: "No Tokken, Authorization Denied" });
    }

    const token = headerToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;

    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email,
      },
    });
    if (!user.enabled) {
      return res.status(401).json({ massage: "This Accout is disabled" });
    }

    // console.log(user);
    // console.log("Hello Middlewre");

    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ massage: "Token invalid" });
  }
};


// exports.authCheck = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Token is invalid or expired" });
//   }
// };


exports.adminCheck = async (req, res, next) => {
  try {
    const { email } = req.user;
    const adminUser = await prisma.user.findFirst({
      where: {
        email: email,
        // role: "admin",
      },
    });
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(401).json({ massage: "Acess Denied: Admin Only" });
    }
    // console.log("adminCheck, email: ", adminUser);
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ massage: "Token invalid" });
  }
};


