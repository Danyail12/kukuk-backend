import Expert from "../models/expert.js";

export const createExpert = async (req, res) => {
    try {
      const {
        fullName,
        userName,
        email,
        password,
        location,
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
      } else {
        const latitude = parseFloat(location.latitude);
        const longitude = parseFloat(location.longitude);
  
        if (isNaN(latitude) || isNaN(longitude)) {
          return res.status(400).json({
            success: false,
            message: "Invalid coordinates",
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
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        });
  
        await newExpert.save();
  
        res.status(200).json({
          success: true,
          message: "Expert created successfully",
          expert: newExpert,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  

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
      const expert = await Expert.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(expert);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


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
