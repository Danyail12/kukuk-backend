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
// import course from "../models/course.js";
import cloudinary from "cloudinary";
import fs from "fs";

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

export const addTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const user = await User.findById(req.user._id);

    user.tasks.push({
      title,
      description,
      completed: false,
      createdAt: new Date(Date.now()),
    });

    await user.save();

    res.status(200).json({ success: true, message: "Task added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const user = await User.findById(req.user._id);

    user.tasks = user.tasks.filter(
      (task) => task._id.toString() !== taskId.toString()
    );

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Task removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const user = await User.findById(req.user._id);

    user.task = user.tasks.find(
      (task) => task._id.toString() === taskId.toString()
    );

    user.task.completed = !user.task.completed;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Task Updated successfully" });
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
  const user = await user.findById(req.params.id);
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User not found" });
  }

await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      await user.remove();

      res.status(200).json({ success: true,
         message: "User Deleted" });
  }
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
        const { fullname, email,ownership
          ,durationofownership,notableFeatures,
          purpose,additionalDetails,
          question1,question2,date,
          time,location,year,model,make,
          linkToAdvertisement, 
          sessionDescription,
          vehicleVin,currentVehicleDescription} = req.body;
        const userId = await User.findById(req.user._id);
        const expert = await Expert.findById(req.body.id);
        // Check if the user exists
        const user = await User.findById(userId);
        const experts = await Expert.findById(expert);

        if (!experts) {
          return res.status(404).json({ success: false, message: 'expert not found' });
        }
    
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
    
        // Create a new BookingSession instance
        const newBookingSession = new BookingSession({
          fullname, email,ownership
          ,durationofownership,notableFeatures,
          purpose,additionalDetails,
          question1,question2,date,
          time,location,year,model,make,
          linkToAdvertisement, 
          sessionDescription,
          vehicleVin,currentVehicleDescription,
          expert: expert._id,
        });
    
        // Save the new booking session to the database
        await newBookingSession.save();
    
        // Add the booking session to the user's bookingsession array
        user.bookingsession.push({
          booking: newBookingSession,
          poster: 'your-poster-value', // Replace with actual poster value
        });
        experts.bookingsession.push({
          booking: newBookingSession,
          poster: 'your-poster-value', // Replace with actual poster value
        });
    
        // Save the user with the updated bookingsession array
        await user.save();
        await experts.save();
    
        res.status(201).json({
          success: true,
          message: 'Booking session added successfully',
          bookingSession: newBookingSession,
        });
      } catch (error) {
        console.error('Error adding booking session:', error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
      }
    }
 
    export const getBookingSession = async (req, res) => {
      try {
        const userId = req.params.id;
    
        // Check if the user exists and populate the bookingsession array
        const user = await User.findById(userId).populate('bookingsession.booking');
    
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
    
        res.status(200).json({
          success: true,
          bookingSessions: user.bookingsession,
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
    
        await user.updateOne({ $pull: { bookingsession: bookingId } });

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
      expertId :expert,
      userId : user 
    });

    await OnlineInspection.save();
  

    // Add the online inspection to the expert's onlineInspection array
    expert.onlineInspection.push({
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
      user: user,
    });
    await expert.save();
    user.onlineInspection.push({make: req.body.make,
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
      expert: expert,
    });
    await user.save();

    res.status(201).json({ 
      success: true,
      message: 'Online inspection created successfully',
      
        OnlineInspection: OnlineInspection 
        });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const onsiteInspectionReport = async (req, res) => {
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

    const OnsiteInspection = await onsiteInspection.create({
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
      expertId :expert,
      userId : user 
      // user: req.user._id,
    });
    await OnsiteInspection.save();
  

    // Add the online inspection to the expert's onlineInspection array
    expert.onlineInspection.push({
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
      user: req.user._id,
      });
    await expert.save();

    user.onsiteInspection.push({make: req.body.make,
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
      expertId :expert
  });
    await user.save();

    res.status(201).json({ 
      success: true, 
      message: 'Report submitted successfully',
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
      expertId :expert,
      userId : user 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  } 
}


export const getOnlineInspection = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // const onlineInspection = await onlineInspection.find();
    if(!user){
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user.onlineInspection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


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
    const deletedOnlineInspection = await onlineInspection.findByIdAndDelete(req.params.id);

    if (!deletedOnlineInspection) {
      return res.status(404).json({ success: false, message: 'Online Inspection not found' });
    }

    // Assuming the user model has an `onlineInspection` array
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { onlineInspection: req.params.id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Online Inspection deleted successfully',
      data: deletedOnlineInspection,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
