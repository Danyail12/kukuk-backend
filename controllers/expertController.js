import Expert from "../models/expert.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
import expertSchedule from "../models/expertSchedule.js";

export const createExpert = async (req, res) => {
    try {
      const {
        fullName,
        userName,
        email,
        password,
        city,
        country,
        specialization,
        timing
      } = req.body;
  
      const expert = await Expert.findOne({
        email
      });
  
      if (expert) {
        return res.status(400).json({
          success: false,
          message: "Expert already exists",
        });
      } 
       
  
        const newExpert = new Expert({
          fullName,
          userName,
          email,
          password,
          specialization,
          timing,
          city,
          country,
          
        });
  
        await newExpert.save();
  
        res.status(200).json({
          success: true,
          message: "Expert created successfully",
          expert: newExpert,
        });
      }

  
    
    catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


  

  export const getExperts = async (req, res) => {
    try {
      const experts = await Expert.find();
      res.status(200).json(experts);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


  export const deleteExperts = async (req, res) => {
    try {
      const expert = await Expert.findByIdAndDelete(req.params.id);
      res.status(200).json(expert);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


  export const updateExperts = async (req, res) => {
    try {
      const {
        fullName,
        userName,
        email,
        password,
        city,
        country,
        specialization,
        timing,
        location,
      } = req.body;
  
      const latitude = parseFloat(location.latitude);
      const longitude = parseFloat(location.longitude);
  
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          success: false,
          message: "Invalid coordinates",
        });
      }
  
      const expert = await Expert.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            fullName,
            userName,
            email,
            password,
            specialization,
            timing,
            city,
            country,
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          },
        },
        { new: true }
      );
  
      res.status(200).json(expert);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
   


  export const nearestExperts = async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
  
      // Ensure latitude and longitude are provided in the query parameters
      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: 'Latitude and longitude are required in the query parameters.',
        });
      }
  
      // Parse latitude and longitude to float
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
  
      // Ensure valid coordinates
      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coordinates.',
        });
      }
  
      // Find the nearest expert based on the given location using $geoNear
      const nearestExpert = await Expert.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            key: 'location',
            maxDistance: parseFloat(10000) * 1609, // Assuming maxDistance is in miles, convert to meters
            distanceField: 'dist.calculated',
            spherical: true,
          },
        },
      ]);
  
      if (!nearestExpert || nearestExpert.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No nearest expert found.',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Nearest expert found.',
        expert: nearestExpert[0],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  // expertController.js
export const getBookingSessionsForExpert = async (req, res) => {
  try {
    const expertId = req.params.id;
    const expert = await Expert.findById(expertId).populate('bookingsession.booking');

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: "Expert not found",
      });
    }

    res.status(200).json({
      success: true,
      bookingSessions: expert.bookingsession,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

    const expert = await Expert.findOne({ email }).select("+password");

    if (!expert) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    const isMatch = await expert.comparePassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    sendToken(res, expert, 200, "Login Successful");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const verify = async (req, res) => {
  try {
    const otp = Number(req.body.otp);

    const expert = await Expert.findById(req.user._id);

    if (!expert || expert.otp !== otp || expert.otp_expiry.getTime() < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP or has been Expired" });
    }

    expert.verified = true;
    expert.otp = null;
    expert.otp_expiry = null;

    await expert.save();

    sendToken(res, expert, 200, "Account Verified");
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

export const getExpertBookingSessions = async (req, res) => {
  try {
    const expert = await Expert.findById(req.user._id).populate('bookingsession');

    if (!expert) {
      return res.status(404).json({ success: false, message: "Expert not found" });
    }

    res.status(200).json({ success: true, bookings: expert.bookingsession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}



export const getExpertPockets = async (req, res) => {
  try {
    const expert = await Expert.findById(req.user._id).populate('pocketGarrage');
    res.status(200).json({ success: true, pockets: expert.pockets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export const getExpertOnlineInspections = async (req, res) => {
  try {
    const expert = await Expert.findById(req.user._id).populate('onsiteInspection');
    res.status(200).json({ success: true, inspections: expert.onsiteInspection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export const getExpertOnsiteInspections = async (req, res) => {
  try {
    const expert = await Expert.findById(req.user._id).populate('onsiteInspection');
    res.status(200).json({ success: true, inspections: expert.onsiteInspection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const ScheduleBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      specialization,
      time,
      date,
      location,
      feesPerConsaltation,
    } = req.body;

    const latitude = parseFloat(location.latitude);
    const longitude = parseFloat(location.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates',
      });
    }

    const expert = await Expert.findById(req.user._id);

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }

    // Create a new expert schedule entry
    const ExpertSchedule = new expertSchedule({
      name,
      email,
      description: specialization, 
      date, 
      time, 
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      feesPerConsaltation,
      expertId: expert._id,
    });

    // Save the expert schedule entry to the database
    await ExpertSchedule.save();

    // Associate the expert schedule with the expert
    expert.expertSchedule.push({
      expertId: expert._id,
      name,
      email,
      description: specialization,
      date,
      time,
      location,
      feesPerConsaltation,
    });

    // Save the expert with the new association
    await expert.save();

    res.status(200).json({
      success: true,
      message: 'Expert schedule created successfully',
      expertSchedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getExpertSchedule = async (req, res) => {
  try {
    const expert = await Expert.findById(req.user._id).populate('expertSchedule');
    res.status(200).json({ success: true, schedule: expert.expertSchedule });
  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export const deleteExpertSchedule = async (req, res) => {
  try {
    const expert = await Expert.findById(req.user._id);

    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    const scheduleId = req.params.id;

    // Find the index of the schedule in the expert's expertSchedule array
    const scheduleIndex = expert.expertSchedule.findIndex(schedule => schedule._id == scheduleId);

    if (scheduleIndex === -1) {
      return res.status(404).json({ success: false, message: 'Expert schedule not found' });
    }

    // Remove the schedule from the expert's expertSchedule array
    expert.expertSchedule.splice(scheduleIndex, 1);

    // Save the expert with the updated expertSchedule array
    await expert.save();

    res.status(200).json({ success: true, message: 'Expert schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

