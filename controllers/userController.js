import mongoose from "mongoose";
import course from "../models/course.js";
import { User } from "../models/users.js";
import BookingSession from "../models/bookingSession.js";
import eBooks from "../models/eBooks.js";
import Expert from "../models/expert.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
import onlineInspection from "../models/onlineInspection.js";
import onsiteInspection from "../models/onsiteInspection.js";
import Reason from "../models/Reason.js";
import stats from "../models/Stats.js";
// import course from "../models/course.js";
import cloudinary from "cloudinary";
import fs from "fs";
import ExpertSchedule from "../models/expertSchedule.js";
import expert from "../models/expert.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const otp = Math.floor(Math.random() * 1000000);

    user = await User.create({
      name,
      email,
      password,
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
    });

    await sendMail(email, "Verify your account", `Your OTP is ${otp}`);

    sendToken(res, user, 201, "OTP sent to your email, please verify your account");
  } catch (error) {
    console.error(error);  // Log the actual error for debugging
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


export const verify = async (req, res) => {
  try {
    const otp = Number(req.body.otp);

    const user = await User.findById(req.user._id);

    if (user.otp !== otp || user?.otp_expiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP or has been Expired" });
    }

    user.verified = true;
    user.otp = null;
    user.otp_expiry = null;

    await user.save();

    sendToken(res, user, 200, "Account Verified");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    sendToken(res, user, 200, "Login Successful");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    sendToken(res, user, 201, `Welcome back ${user.name}`);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { name } = req.body;
    const avatar = req.files.avatar.tempFilePath;

    if (name) user.name = name;
    if (avatar) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);

      const mycloud = await cloudinary.v2.uploader.upload(avatar);

      fs.rmSync("./tmp", { recursive: true });

      user.avatar = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      };
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Profile Updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Old Password" });
    }

    user.password = newPassword;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password Updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    const otp = Math.floor(Math.random() * 1000000);

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    const message = `Your OTP for resetting the password is ${otp}. If you did not request for this, please ignore this email.`;

    // Assuming sendMail is correctly implemented
    await sendMail(email, "Request for Resetting Password", message);

    res.status(200).json({ success: true, message: `OTP sent to ${email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordOtp: otp,
      resetPasswordOtpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Otp Invalid or has been Expired" });
    }

    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiry = null; // Corrected property name
    await user.save();

    res
      .status(200)
      .json({ success: true, message: `Password Changed Successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const addtoplaylist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const Course = await course.findById(req.body.id);

    if (!Course) {
      return res.status(400).json({ success: false, message: "Course Not Found" });
    }

    const itemExist = user.playlist.find((item) => item.course.toString() === Course._id.toString());

    if (itemExist) {
      return res.status(400).json({ success: false, message: "Already Added To Playlist" });
    }

    user.playlist.push({
      course: Course._id,
      poster: Course.poster.url,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Added To Playlist",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const removetoplaylist = async (req, res) => {
    const user = await User.findById(req.user._id);
const Course = await course.findById(req.query.id);

if(!Course){
  return res
  .status(400)
  .json({ success: false, message: "Course Not Found" });
}

const newPlaylist = user.playlist.filter((item) => {
  if(item.course.toString() !== Course._id.toString()){
    return item;
  } })
    
 user.playlist = newPlaylist

await user.save();

res.status(200).json({
  success: true,
  message: "remove To Playlist",
})
 

}


export const addtoEbook = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const ebook = await eBooks.findById(req.body.ebookId);

    if (!ebook) {
      return res.status(404).json({ success: false, message: 'Ebook not found' });
    }

    // Check if the ebook is already in the fullbook array
    const isEbookAdded = user.fullbook.some((item) => item.ebooks.toString() === ebook._id.toString());

    if (isEbookAdded) {
      return res.status(400).json({ success: false, message: 'Ebook already added to fullbook' });
    }

    // Add the ebook to the fullbook array
    user.fullbook.push({
      ebooks: ebook._id,
      poster: ebook.poster.url,
    });

    // Save the user document
    await user.save();

    res.status(200).json({ success: true, message: 'Ebook added to fullbook successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }

}


export const getallusers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if(user.role === "user"){
      user.role = "admin"
    }else{
      user.role = "user"
    }
    await user.save();
    res.status(200).json({ success: true, message: "User Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export const deleteUser = async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);

    if (!foundUser) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // await cloudinary.v2.uploader.destroy(foundUser.avatar.public_id);
    // await foundUser.remove();

    res.status(200).json({ success: true, message: "User Deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
  export const deleteProfile = async (req, res) => {
    const user = await user.findById(req.user._id);
  
  await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        await user.remove();
  
        res.status(200).cookie("token",null,{
          expires: new Date(Date.now()),
          httpOnly: true
        }).json({ success: true,
           message: "User Deleted" });
    }


    export const addBookingSession = async (req, res) => {
      try {
          const {
              fullname,
              email,
              ownership,
              durationofownership,
              notableFeatures,
              purpose,
              additionalDetails,
              question1,
              question2,
              date,
              time,
              year,
              model,
              make,
              linkToAdvertisement,
              sessionDescription,
              vehicleVin,
              currentVehicleDescription,
              expertScheduleId
          } = req.body;
  
          // Check if user is authenticated and retrieve userId
          const userId = req.user._id;
          if (!userId) {
              return res.status(401).json({ success: false, message: 'Unauthorized' });
          }
  
          // Retrieve expertId from the request body
          const expertId = req.body.expertId;
          
          // Find user and expert
          const user = await User.findById(userId);
          const expert = await Expert.findById(expertId);
  
          // Check if user and expert exist
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }
          if (!expert) {
            return res.status(404).json({ success: false, message: 'Expert not found' });
          }
          const expertScheduleIndex = expert.expertSchedule.findIndex(schedule => schedule._id.toString() === expertScheduleId.toString());
          if (expertScheduleIndex !== -1) {
            expert.expertSchedule[expertScheduleIndex].reserved = true;
            await expert.save();
          }
          
          // Create new booking session
          const newBookingSession = new BookingSession({
            fullname,
              email,
              ownership,
              durationofownership,
              notableFeatures,
              purpose,
              additionalDetails,
              question1,
              question2,
              date,
              time,
              year,
              model,
              make,
              linkToAdvertisement,
              sessionDescription,
              vehicleVin,
              currentVehicleDescription,
              expertSchedule:expert.expertSchedule[expertScheduleIndex],
              userId: user._id
          });
  
          await newBookingSession.save();
          // Save booking session
          
          // Update user and expert with booking session
          user.bookingsession.push({ 
              booking: newBookingSession,
              // expert: expert.expertSchedule[expertScheduleIndex],
              
          });
          const text = `  your Appointment has been booked with ${expert.userName}.`
          user.notifcation.push({
            text: text
          })
          // await user.save();
  
          expert.bookingsession.push({ 
              booking: newBookingSession,
              // expert: expert.expertSchedule[expertScheduleIndex],
              user: user
          });
          const msg = `  your Appointment has been booked with ${user.userName}.`
          expert.notification.push({
            text: msg
          })
  
          await user.save();
          await expert.save();
  
          // Update reserved field in expert model's expertSchedule
  
          res.status(201).json({
              success: true,
              message: 'Booking session added successfully',
              bookingSession: newBookingSession,
              // expert: expert.expertSchedule[expertScheduleIndex]
          }); 
      } catch (error) {
          console.error('Error adding booking session:', error);
          res.status(500).json({ success: false, message: 'Something went wrong' });
      }
  };
  
  
      
  export const getBookingSession = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if the user exists and populate the bookingsession array with booking data
        const user = await User.findById(userId).populate('bookingsession.booking');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Filter out any bookingsessions where the expertId is null (no associated expert schedule)
        const filteredBookingSessions = user.bookingsession.filter(session => session.booking.expertId !== null);
 
        res.status(200).json({
            success: true,
            bookingSessions: filteredBookingSessions,
        });
    } catch (error) {
        console.error('Error fetching user booking sessions:', error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};


    export const getAllExperts = async (req, res) => {

      try {
        const experts = await Expert.find();
        res.status(200).json({
          success: true,
          experts,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }


    export const deleteBooking = async (req, res) => {
      try {
        const bookingId = req.params.id;
        const user = await User.findById(req.user._id);
        const booking = await BookingSession.findById(bookingId); 
        if (!booking) {
          return res.status(404).json({ error: 'Booking not found' });
        }
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        const { reasonList } = req.body;
        // Find the expert associated with the booking
        const expert = await Expert.findOne({ "bookingsession.booking": bookingId });
        if (!expert) {
          return res.status(404).json({ error: 'Expert not found' });
        }
        const reason = new Reason({ reasonList });
        await reason.save();
    
        // Construct notification message
        const text = `Your appointment has been cancelled by ${user.userName} with the following reason: ${reasonList}`;
    
        // Add the notification to the expert
        expert.notification.push({ text });
        await expert.save();
            // Update reserved field in expert's schedule
        const expertScheduleId = booking.expertSchedule._id;
        const expertSchedule = expert.expertSchedule.find(schedule => schedule._id.toString() === expertScheduleId.toString());
        if (expertSchedule) {
          expertSchedule.reserved = false;
          await expert.save();
        }
    
        // Remove the booking session from user's bookingsession array
        await user.updateOne({ $pull: { bookingsession: { booking: bookingId } } });
    
        // Remove the booking session from expert's bookingsession array
        await expert.updateOne({ $pull: { bookingsession: { booking: bookingId } } });
    
        // Remove the booking document
        await BookingSession.findByIdAndDelete(bookingId);
    
        res.status(200).json({ message: 'Booking deleted successfully' });
    
      } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
    
    export const RescheduleBooking = async (req, res) => {
      try {
        const bookingId = req.params.id;
        const bookingSession = await BookingSession.findById(bookingId);
    
        if (!bookingSession) {
          return res.status(404).json({ error: 'Booking session not found' });
        }
    
        bookingSession.date = req.body.date;
        bookingSession.time = req.body.time;
        bookingSession.location = req.body.location;
        bookingSession.ownership=req.body.ownership;
        bookingSession.durationofownership=req.body.durationofownership;
        bookingSession.notableFeatures=req.body.notableFeatures;
        bookingSession.purpose=req.body.purpose;
        bookingSession.additionalDetails=req.body.additionalDetails;
        bookingSession.question1=req.body.question1;
        bookingSession.question2=req.body.question2;
        bookingSession.year=req.body.year;
        bookingSession.model =req.body.model;
        bookingSession.make=req.body.make;
        bookingSession.linkToAdvertisement=req.body.linkToAdvertisement;
        bookingSession.sessionDescription=req.body.sessionDescription;
        bookingSession.vehicleVin=req.body.vehicleVin;
        bookingSession.currentVehicleDescription=req.body.currentVehicleDescription;

        await bookingSession.save();
    
        // Find the corresponding User document and update the bookingsession entry
        const user = await User.findById(req.user._id);
        if (user) {
          const userBookingIndex = user.bookingsession.findIndex((booking) => booking._id.equals(bookingSession._id));
          if (userBookingIndex !== -1) {
            user.bookingsession[userBookingIndex].date = req.body.date;
            user.bookingsession[userBookingIndex].time = req.body.time;
            user.bookingsession[userBookingIndex].location = req.body.location;
            await user.save();
          }
        }
    
        res.status(200).json({ message: 'Booking session rescheduled successfully' });
    
      } catch (error) {
        console.error('Error rescheduling booking session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
    
export const onsiteInspectionReport = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the expert exists using req.body.id
    const expert = await Expert.findById(req.body._id);
    console.log(expert)
    if (!expert) {
        return res.status(404).json({ success: false, message: 'Expert not found' });
    }


const location = req.body.location;

    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).json({
        success: false,
        message: 'Location coordinates are required and must include latitude and longitude properties.',
      });
    }

    const latitude = parseFloat(location.latitude);
    const longitude = parseFloat(location.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates',
      });
    }

    
    const expertScheduleId = req.body.expertScheduleId;

    // const expertSlot= await Expert.expertSchedule.findById(expertScheduleId);
    // console.log(expertSlot)

    const expertScheduleIndex = expert.expertSchedule.findIndex(schedule => schedule._id.toString() === expertScheduleId.toString());
    if (expertScheduleIndex !== -1) {
      expert.expertSchedule[expertScheduleIndex].reserved = true;
      await expert.save();
    }
const slot = expert.expertSchedule[expertScheduleIndex];
    const OnsiteInspectionReport = await onsiteInspection.create({
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      vechicleVin: req.body.vechicleVin,
      // licensePlates: req.body.licensePlates,
      // handTruck: req.body.handTruck,
      // glass: req.body.glass,
      // wiperBlades: req.body.wiperBlades,
      // Reflectors: req.body.Reflectors,
      // mudFlaps: req.body.mudFlaps,
      // racking : req.body.racking,
      // coldCurtains: req.body.coldCurtains,
      // doorIssues: req.body.doorIssues,
      // insurance: req.body.insurance,
      // headlights: req.body.headlights,
      // turnsignals: req.body.turnsignals,
      // makerlights: req.body.makerlights,
      // brakeLights: req.body.brakeLights,
      // carImages: req.body.carImages,
      // RegistrationImages: req.body.RegistrationImages,
      // Documents: req.body.Documents,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      expertId :slot,
      userId : user 
    });


    await OnsiteInspectionReport.save();
  

    // Add the online inspection to the expert's onlineInspection array
    expert.onsiteInspection.push({
      onsiteInspection: OnsiteInspectionReport,
      expertId: slot,
      user: user,
    });
    await expert.save();
    
    user.onsiteInspection.push({
      onsiteInspection: OnsiteInspectionReport,       
      expertId: slot,
      user: user,

    });
    await user.save();

    res.status(201).json({ 
      success: true,
      message: 'Online inspection created successfully',
      
      onsiteInspection: OnsiteInspectionReport 
        });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const onlineInspectionReport = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the expert exists using req.body.id
    const expert = await Expert.findById(req.body._id);
    if (!expert) {
        return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    // const expertScheduleId = req.body.expertScheduleId;
    // if(!expertScheduleId) {
    //   return res.status(404).json({ success: false, message: 'Expert schedule not found' });
    // }

    const OnlineInspection = await onlineInspection.create({
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      vechicleVin: req.body.vechicleVin,
      licensePlates: req.body.licensePlates,
      handTruck: req.body.handTruck,
      glass: req.body.glass,
      wiperBlades: req.body.wiperBlades,
      Reflectors: req.body.Reflectors,
      mudFlaps: req.body.mudFlaps,
      racking : req.body.racking,
      coldCurtains: req.body.coldCurtains,
      doorIssues: req.body.doorIssues,
      insurance: req.body.insurance,
      headlights: req.body.headlights,
      turnsignals: req.body.turnsignals,
      makerlights: req.body.makerlights,
      brakeLights: req.body.brakeLights,
      carImages: req.body.carImages,
      RegistrationImages: req.body.RegistrationImages,
      Documents: req.body.Documents, 
    });
    await OnlineInspection.save();
    
    // const expertScheduleIndex = expert.expertSchedule.findIndex(schedule => schedule._id.toString() === expertScheduleId.toString());
    // if (expertScheduleIndex !== -1) {
    //   expert.expertSchedule[expertScheduleIndex].reserved = true;
    //   await expert.save();
    // }
    // const slot = expert.expertSchedule[expertScheduleIndex];

    // Add the online inspection to the expert's onlineInspection array
    expert.onlineInspection.push({
      onlineInspection: OnlineInspection,
      expertId:expert.userName,
      user: user
          });
    await expert.save();

    user.onlineInspection.push({
      onlineInspection: OnlineInspection,
      expertId: expert.userName,
      user: user
  });
    await user.save();

    res.status(201).json({ 
      success: true, 
      message: 'Report submitted successfully',
      OnlineInspection: OnlineInspection
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  } 
}


export const getOnlineInspection = async (req, res) => {
  try {
    // Retrieve the user from the database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    
    // Return the populated expert schedule and all online inspection data objects
    res.status(200).json({ success: true, onlineInspection: user.onlineInspection });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getOnsiteInspection = async (req, res) => {
  try {
    // Assuming that User is your user model
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user.onsiteInspection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteOnlineInspection = async (req, res) => {
  try {
    // Extract the online inspection ID from the request parameters
    const onlineInspectionId = req.params.id;

    // Find the online inspection document by its ID
    const onlineInspections = await onlineInspection.findById(onlineInspectionId);
    if (!onlineInspections) {
      return res.status(404).json({ error: 'Online Inspection not found' });
    }

    // Find the associated user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the associated expert
    const expert = await Expert.findOne({ "onlineInspection.onlineInspection": onlineInspectionId });
    console.log(expert);


    // Remove the online inspection from the user's onlineInspection array
    await user.updateOne({ $pull: { onlineInspection: { onlineInspection: onlineInspectionId } } });
    // console.log(user);

    // Remove the online inspection from the expert's onlineInspection array
    await expert.updateOne({ $pull: { onlineInspection: { onlineInspection: onlineInspectionId } } });

    // Update the reserved field in the expert's schedule
    const expertScheduleId = onlineInspections.expertSchedule._id;
    const expertSchedule = expert.expertSchedule.find(schedule => schedule._id.toString() === expertScheduleId.toString());
    if (expertSchedule) {
      expertSchedule.reserved = false;
      await expert.save();
    }

    // Delete the online inspection document
    await onlineInspection.findByIdAndDelete(onlineInspectionId);

    res.status(200).json({ message: 'Online Inspection deleted successfully' });
  } catch (error) {
    console.error('Error deleting online inspection:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const deleteOnsiteInspection = async (req, res) => {
  try {
    const deletedOnsiteInspection = await onsiteInspection.findByIdAndDelete(req.params.id);

    if (!deletedOnsiteInspection) {
      return res.status(404).json({ success: false, message: 'Onsite Inspection not found' });
    }

    // Assuming the user model has an `onsiteInspection` array
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { onsiteInspection: req.params.id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Onsite Inspection deleted successfully',
      data: deletedOnsiteInspection,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const updateOnsiteInspection = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const updatedOnsiteInspection = await onsiteInspection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'Onsite Inspection updated successfully',
      data: updatedOnsiteInspection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export const updateOnlineInspection = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const updatedOnlineInspection = await onlineInspection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'Online Inspection updated successfully',
      data: updatedOnlineInspection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getallBookingSession = async (req, res) => {
  try {
    const bookingSessions = await BookingSession.find();

    res.status(200).json({ success: true, data: bookingSessions });
   
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}



// User.watch().on('change', async () => {
//   const Stats = await stats.find({}).sort({ createdAt: 'desc' }).limit(1);
//   const subscription=await User.find({"subscription.status":"active"});
  // stats[0].users = subscription.length;
//   stats[0].views = Stats[0].views;
//   stats[0].subscription = Stats[0].subscription;
//   stats[0].createdAt = Date.now();
//   await stats[0].save();
// })
