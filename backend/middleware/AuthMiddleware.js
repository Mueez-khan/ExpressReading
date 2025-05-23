const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authenticateUser = (req, res, next) => {
  // Extract token from headers, cookies, or body
  let token;
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1]; // Extract token after "Bearer"
  } else if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.body.token) {
    token = req.body.token;
  }

  // console.log("Token in middleware:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded:", decoded);

    // Attach decoded user info to the request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in middleware:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token is invalid",
    });
  }
};
