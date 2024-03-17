
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
export const expertSendToken = (res, Expert, statusCode, message) => {
    const token = Expert.getJWTToken();
  
    const options = {
      httpOnly: true,
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
    };
  
    const userData = {
      _id: Expert._id,
      name: Expert.name,
      email: Expert.email,
      avatar: Expert.avatar,
      tasks: Expert.tasks,
      verified: Expert.verified,
      pocketGarrage: Expert.pocketGarrage,
      subscription: Expert.subscription,
      playlist: Expert.playlist,
      fullbook: Expert.fullbook,
      bookingsession: Expert.bookingsession,
      report: Expert.report,
      OnlineInspection: Expert.onlineInspection,
      token: token,
      userId: Expert._id.toString(),
      role: Expert.role,
      otp: Expert.otp

    };
  
    res
      .status(statusCode)
      .cookie("token", token, options)
      .json({ success: true, message, user: userData });
  };
  