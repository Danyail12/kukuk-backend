import Report from "../models/report.js";
import Expert from "../models/expert.js";
import {User} from "../models/users.js";



export const createReport = async (req, res) => {
  try {
    const expert = await User.findById(req.user._id);
    const user = await Expert.findById(req.body.id);
    const { name, email, description, expires } = req.body;
    
    if (!experts) {
      return res.status(404).json({ success: false, message: 'expert not found' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const report = await Report.create({
      expertId: expert._id, // Use expert._id here
      userId: user._id, // Use user._id here
      name,
      email,
      description,
      expires,
    });

    if (!report) {
      return res.status(500).json({ success: false, message: 'Failed to create report' });
    }

    await report.save();

    user.report.push(report);

    expert.reportDelivery.push({
      report
    });

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      report: report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
