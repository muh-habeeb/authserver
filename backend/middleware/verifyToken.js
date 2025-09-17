import jwt from "jsonwebtoken";
//function
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; //get the token
  //error no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: " Unauthorized no-token provided",
    });
  }
  try {
    //decode the token by key
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // if fails show error
    if (!decode) {
      return res.status(401).json({
        success: false,
        message: " invalid token",
      });
    }
    //send the decoded id
    req.userId = decode.userId;
    //go for the next function
    next();
  } catch (error) {
    console.log("error in verify token", error);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};
