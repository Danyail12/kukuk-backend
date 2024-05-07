import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
import { expertSendToken } from "../utils/expertSendToken.js";
import expertSchedule from "../models/expertSchedule.js";
import Expert from "../models/expert.js";
import BookingSession from "../models/bookingSession.js";
import { User } from "../models/users.js";
import ExpertSchedule from "../models/expertSchedule.js";

export const createExpert = async (req, res) => {
    try {
      const {
        fullName,
        userName,
        email,
        password,
        city,
        country,
        feesPerConsaltation,
        skills,
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
          feesPerConsaltation,
          skills
          
        });
  
        await newExpert.save();
        expertSendToken(res, newExpert, 200, "Expert created successfully");
        
  
    }
        catch (error) {
          console.error(error);  // Log the actual error for debugging
          res.status(500).json({ success: false, message: error.message });
        }
  }


  

  export const getExperts = async (req, res) => {
    try {
        const experts = await Expert.find({}, 'userName email country city specialization feesPerConsaltation');
        // This will only fetch the specified fields from the database

        res.status(200).json({
            success: true,
            message: "Experts fetched successfully",
            data: experts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const availableBookings = async (req, res) => {
  try {
      // Extract time and date from the request body
      const { timing, date } = req.body;

      // Convert timing to start and end time
      const [startTime, endTime] = timing.split(' - ');

      // Parse date string to Date object
      const isoDate = new Date(date);

      // Query the database for available slots matching the given time and date
      const availableExperts = await Expert.find({
          'expertSchedule.date': isoDate,
          'expertSchedule.timing.start': startTime,
          'expertSchedule.timing.end': endTime,
          'expertSchedule.reserved': false
      }, {
          'expertSchedule.$': 1
      });

      // Return the available slots in the response
      res.status(200).json({ success: true, availableExperts });
  } catch (error) {
      console.error('Error fetching available slots:', error);
      res.status(500).json({ success: false, message: 'Something went wrong' });
  }
}
// export const rescheduleBooking = async (req, res) => {
//   try {
//     const { newExpertId, expertScheduleId } = req.body;

//     // Find the booking session to reschedule
//     const bookingSession = await BookingSession.findById(req.params.id);
//     if (!bookingSession) {
//       return res.status(404).json({ error: 'Booking session not found' });
//     }
//     console.log(bookingSession);
//     // Find the previous expert schedule
//     const previousExpertScheduleId = bookingSession.expertSchedule._id;

//     // Remove the booking session from the previous expert's bookingsession array
//     const previousExpert = await Expert.findOneAndUpdate(
//       { "bookingsession.booking": req.params.id },
//       { $pull: { bookingsession: { booking: req.params.id } } },
//       { new: true }
//     );
//     console.log('Previous expert:', previousExpert);
//      if (!previousExpert) {
//       return res.status(404).json({ error: 'Previous expert not found' });
//     }

//    // Update reserved field in previous expert's expertSchedule
// const previousExpertSchedule = previousExpert.expertSchedule.find(schedule => schedule._id.toString() === previousExpertScheduleId.toString());
// if (!previousExpertSchedule) {
//   return res.status(404).json({ error: 'Previous expert schedule not found' });
// }
// previousExpertSchedule.reserved = false;
// await previousExpert.save();

// // Find the new expert
// const newExpert = await Expert.findById(newExpertId);
// if (!newExpert) {
//   return res.status(404).json({ error: 'New expert not found' });
// }

// // Find the expert schedule in the new expert's array
// const newExpertSchedule = newExpert.expertSchedule.find(schedule => schedule._id.toString() === expertScheduleId.toString());
// if (!newExpertSchedule) {
//   return res.status(404).json({ error: 'Expert schedule not found' });
// }
// newExpertSchedule.reserved = true;
// await newExpert.save();
//  const user = await User.findById(req.user._id);

//     // Update expertSchedule of the booking session
//     bookingSession.expertSchedule = { _id: expertScheduleId, reserved: true };

//     // Add the booking session to the new expert's bookingsession array
//     newExpert.bookingsession.push({ booking: bookingSession, user: user });
//     await newExpert.save();

//     // Update the booking session in the user's booking session array
//     const userBookingIndex = user.bookingsession.findIndex(session => session.booking.toString() === req.params.id);
//     if (userBookingIndex !== -1) {
//       user.bookingsession[userBookingIndex].booking = bookingSession;
//       await user.save();
//     }

//     // Return success response
//     res.status(200).json({ message: 'Booking session rescheduled successfully' });
//   } catch (error) {
//     console.error('Error rescheduling booking session:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

export const RescheduleBooking = async (req, res) => {
  try {
    const { expertScheduleId } = req.body;

    // Find the booking session to reschedule
    const bookingSession = await BookingSession.findById(req.params.id);
    if (!bookingSession) {
      return res.status(404).json({ error: 'Booking session not found' });
    }
    const previousExpertScheduleId = bookingSession.expertSchedule._id;
    console.log(previousExpertScheduleId);
    // Find the previous expert and update their expert schedule
    const previousExpert = await Expert.findOneAndUpdate(
      { "bookingsession.booking": req.params.id },
      { $pull: { bookingsession: { booking: req.params.id } } },
      { new: true }
    );
    console.log('Previous expert:', previousExpert);
    if (!previousExpert) {
      return res.status(404).json({ error: 'Previous expert not found' });
    }

    // Update reserved field in previous expert's expertSchedule
    const previousExpertScheduleIndex = previousExpert.expertSchedule.findIndex(schedule => schedule._id.toString() === bookingSession.expertSchedule._id.toString());
    if (previousExpertScheduleIndex !== -1) {
      previousExpert.expertSchedule[previousExpertScheduleIndex].reserved = false;
      await previousExpert.save();
    }

    // Find and update the new expert's expert schedule
    const newExpert = await Expert.findOne({ "expertSchedule._id": expertScheduleId });
    if (!newExpert) {
      return res.status(404).json({ error: 'New expert not found' });
    }

    const newExpertScheduleIndex = newExpert.expertSchedule.findIndex(schedule => schedule._id.toString() === expertScheduleId.toString());
    if (newExpertScheduleIndex !== -1) {
      newExpert.expertSchedule[newExpertScheduleIndex].reserved = true;
      await newExpert.save();
    }

    const user = await User.findById(req.user._id);
    // Add the booking session to the new expert's bookingsession array
    newExpert.bookingsession.push({ booking: bookingSession, user: user });
    await newExpert.save();

    // Update expertSchedule of the booking session
    bookingSession.expertSchedule = newExpert.expertSchedule[newExpertScheduleIndex];

    // Save changes made to the booking session
    await bookingSession.save();

    // Update user's bookingsession array
    const userBookingIndex = user.bookingsession.findIndex(session => session.booking.toString() === req.params.id);
    if (userBookingIndex !== -1) {
      user.bookingsession[userBookingIndex].booking = bookingSession;
      await user.save();
    }

    // Return success response
    res.status(200).json({ message: 'Booking session rescheduled successfully', bookingSession });
  } catch (error) {
    console.error('Error rescheduling booking session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



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
   


  // export const nearestExperts = async (req, res) => {
  //   try {
  //     const { latitude, longitude } = req.body;
  
  //     // Ensure latitude and longitude are provided in the query parameters
  //     if (!latitude || !longitude) {
  //       return res.status(400).json({
  //         success: false,
  //         message: 'Latitude and longitude are required in the query parameters.',
  //       });
  //     }
  
  //     // Parse latitude and longitude to float
  //     const lat = parseFloat(latitude);
  //     const lon = parseFloat(longitude);
  
  //     // Ensure valid coordinates
  //     if (isNaN(lat) || isNaN(lon)) {
  //       return res.status(400).json({
  //         success: false,
  //         message: 'Invalid coordinates.',
  //       });
  //     }
  
  //     // Find the nearest experts based on the given location using $geoNear
  //     const nearestExperts = await Expert.aggregate([
  //       {
  //         $geoNear: {
  //           near: {
  //             type: 'Point',
  //             coordinates: [lon, lat],
  //           },
  //           key: 'expertSchedule.location',
  //           distanceField: 'dist.calculated',
  //           spherical: true,
  //           query: { 'expertSchedule.reserved': false }, // Filter out experts with reserved schedules
  //         },
  //       },
  //       {
  //         $match: {
  //           'expertSchedule.location': {
  //             $geoWithin: {
  //               $centerSphere: [
  //                 [lon, lat], // Center coordinates
  //                 10 / 6371, // 10 kilometers radius (convert to radians)
  //               ],
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $project: {
  //           expertSchedule: {
  //             $filter: {
  //               input: '$expertSchedule',
  //               as: 'schedule',
  //               cond: {
  //                 $eq: ['$$schedule.location.coordinates', [lon, lat]],
  //               },
  //             },
  //           },
  //         },
  //       },
  //     ]);
  
  //     if (!nearestExperts || nearestExperts.length === 0) {
  //       return res.status(404).json({
  //         success: false,
  //         message: 'No nearest experts found.',
  //       });
  //     }

  //     // const expertsWithDetails = await Promise.all(nearestExperts.map(async (expert) => {
  //     //   const fullExpert = await Expert.findById(expert._id).populate('expertSchedule.location');
  //     //   return fullExpert;
  //     // }));
  
  //     res.status(200).json({
  //       success: true,
  //       message: 'Nearest expert with available schedule found.',
  //       expert: nearestExperts,  // Return the first nearest expert
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: error.message,
  //     });
  //   }
  // };
  
  export const nearestExperts = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        // Ensure latitude and longitude are provided in the request body
        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required in the request body.',
            });
        }

        // Parse latitude and longitude to float
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        // Find the nearest experts based on the given location using $geoWithin
        const nearestExperts = await Expert.aggregate([
            {
                $match: {
                    'expertSchedule.location': {
                        $geoWithin: {
                            $centerSphere: [
                                [lon, lat], // Center coordinates
                                10 / 6371, // 10 kilometers radius (convert to radians)
                            ],
                        },
                    },
                    'expertSchedule.reserved': false, // Filter out reserved schedules
                },
            },
            {
                $lookup: {
                    from: 'experts',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'expertDetails',
                },
            },
            {
                $unwind: '$expertDetails',
            },
        ]);

        if (!nearestExperts || nearestExperts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No nearest experts found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Nearest expert with available schedule found.',
            expert: nearestExperts.map(expert => ({
                _id: expert._id,
                fullName: expert.expertDetails.fullName,
                userName: expert.expertDetails.userName,
                email: expert.expertDetails.email,
                country: expert.expertDetails.country,
                city: expert.expertDetails.city,
                specialization: expert.expertDetails.specialization,
                status: expert.expertDetails.status,
                description: expert.expertDetails.description,
                feesPerConsaltation: expert.expertDetails.feesPerConsaltation,
                skills: expert.expertDetails.skills,
                expertSchedule: expert.expertSchedule.filter(schedule => (
                    schedule.location.coordinates[0] === lon && 
                    schedule.location.coordinates[1] === lat &&
                    !schedule.reserved // Filter out reserved schedules
                )),
            })),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


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


// export const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     let user = await Expert.findOne({ email });

//     if (user) {
//       return res.status(400).json({ success: false, message: "Expert already exists" });
//     }

//     const otp = Math.floor(Math.random() * 1000000);

//     user = await Expert.create({
//       name,
//       email,
//       password,
//       otp,
//       otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
//     });

//     await sendMail(email, "Verify your account", `Your OTP is ${otp}`);

//     sendToken(res, user, 201, "OTP sent to your email, please verify your account");
//   } catch (error) {
//     console.error(error);  // Log the actual error for debugging
//     res.status(500).json({ success: false, message: "Something went wrong" });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Email:', email);
    console.log('Password:', password);

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }

    const expert = await Expert.findOne({ email }).select("+password");
    console.log('Expert:', expert);

    if (!expert) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    if(expert.status === "Unactived") {
      return res
        .status(400)
        .json({ success: false, message: "Your account has been blocked" });
    }

    const isMatch = await expert.comparePassword(password);
    console.log('isMatch:', isMatch);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    expertSendToken(res, expert, 200, "Login Successful");
  } catch (error) {
    console.error(error); // Log any errors for debugging
    res.status(500).json({ success: false, message: error.message });
  }
};


// export const verify = async (req, res) => {
//   try {
//     const otp = Number(req.body.otp);

//     const experts = await Expert.findById(req.user._id);

//     if (!experts || experts.otp !== otp || experts.otp_expiry.getTime() < Date.now()) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid OTP or has been Expired" });
//     }

//     experts.verified = true;
//     experts.otp = null;
//     experts.otp_expiry = null;

//     await experts.save();

//     sendToken(res, experts, 200, "Account Verified");
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

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
    const expert = await Expert.findById(req.user._id).populate({
      path: 'bookingsession',
      populate: {
        path: 'booking',
        populate: {
          path: 'user', // Populate the user field within the booking object
          select: 'fullName email', // Select the fields you want to include for the user
        },
      },
    });

    if (!expert) {
      return res.status(404).json({ success: false, message: "Expert not found" });
    }

    const bookingSessionsWithUsers = expert.bookingsession.map(session => ({
      _id: session._id,
      booking: session.booking,
      user: session.booking.user, // Include user details here
    }));

    res.status(200).json({ success: true, bookingSessions: bookingSessionsWithUsers });
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
      description,
      date,
      city,
      country,
      timing,
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
      description,
       specialization, 
      date, 
      city,
      country,
      timing,
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
      description,
       specialization,
      date,
      city,
      country,
      timing,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      feesPerConsaltation,
      _id: expertSchedule._id,
    });

    // Save the expert with the new association
    await expert.save();

    res.status(200).json({
      success: true,
      message: 'Expert schedule created successfully',
       data:ExpertSchedule,
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


export const blockExpert = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    // Update the expert's status
    expert.status = 'Unactived';
    await expert.save();

    res.status(200).json({ success: true, message: 'Expert blocked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unblockExpert = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    // Update the expert's status
    expert.status = 'active'; // Assuming 'active' is the status for unblocked experts
    await expert.save();

    res.status(200).json({ success: true, message: 'Expert unblocked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const NotReservedExpert = async (req, res) => {
  try {
    const expert = await Expert.find({ "expertSchedule.reserved": false });
    res.status(200).json({ success: true, data: expert });
  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}