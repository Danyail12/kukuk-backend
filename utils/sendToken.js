
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
export const sendToken = (res, user, statusCode, message) => {
    const token = user.getJWTToken();
  
    const options = {
      httpOnly: true,
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
    };
  
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      tasks: user.tasks,
      verified: user.verified,
      pocketGarrage: user.pocketGarrage,
      subscription: user.subscription,
      playlist: user.playlist,
      fullbook: user.fullbook,
      bookingsession: user.bookingsession,
      report: user.report,
      OnlineInspection: user.onlineInspection,
      token:token ,
      userId: user._id.toString(),
      role: user.role,
      otp:user.otp,

    };
  
    res
      .status(statusCode)
      .cookie("token", token, options)
      .json({ success: true, message, user: userData });
  };
  