const BaseError = require("../errors/base.error");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(BaseError.Unauthorized("No token provided"));
    }
    
    const token = authorization.split(" ")[1];
    if (!token) {
      return next(BaseError.Unauthorized("Invalid token format"));
    }
    
    try {
      console.log(process.env.JWT_SECRET);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.userId) {
        return next(BaseError.Unauthorized("Invalid token payload"));
      }

      const user = await userModel.findById(decoded.userId);
      if (!user) {
        return next(BaseError.Unauthorized("User not found"));
      }

      req.user = user;
      next();
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return next(BaseError.Unauthorized("Token expired"));
      }
      if (jwtError.name === "JsonWebTokenError") {
        return next(BaseError.Unauthorized("Invalid token"));
      }
      throw jwtError;
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    next(BaseError.InternalServerError("Authentication failed"));
  }
};
