const checkLogin = (req, res, next) => {
  const jwt = require("jsonwebtoken");
  const bearer = req.headers.authorization;

  try {
    if (bearer && bearer.startsWith("Bearer ")) {
      const idToken = bearer.split(" ")[1];
      const decoded = jwt.verify(idToken, process.env.JWT_SECRET);
      const { email, name, userId } = decoded;
      req.email = email;
      req.name = name;
      req.userId = userId;
      next();
    }
  } catch (error) {
    next("authorization failure!");
  }
};
module.exports = checkLogin;
