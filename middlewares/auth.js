import jwt from "jsonwebtoken";
import { User } from "../models/users.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const  {token}  = req.cookies;

    if (!token) {
      return res.status(401).json({ success: false, message: "Login First" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id);

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const AuthorizedAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
}


export const AuthorizedSubscriber = (req, res, next) => {
  if(req.user.subscriber.status!=='active'&&req.user.role!=='admin'){
    res.status(401).json({ success: false, message: "only Subscribers are allowed" });
  }else{
    next();
  }

}


export const AuthorizedExpert = (req, res, next) => {
  if(req.user.role!=="expert"&&req.user.role!=="admin"){
    res.status(401).json({ success: false, message: "only Experts and admin are allowed" });
  }else{
    next();
  }
}
