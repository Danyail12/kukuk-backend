import { sendMail } from "../utils/sendMail.js";
import Stats from "../models/Stats.js";
import { User } from "../models/users.js";
import Expert from "../models/expert.js";
import onlineInspection from "../models/onlineInspection.js";
import onsiteInspection from "../models/onsiteInspection.js";
import course from "../models/course.js";
import eBooks from "../models/eBooks.js";
import BookingSession from "../models/bookingSession.js";
import PocketGarrage from "../models/pocketGarrage.js";



export const courseRequest = async (req, res) => {
    res.status(200).json({ success: true, message:
        
        "Course Requested Successfully" });
}


export const contact = async (req, res) => {

    const {name,email,message} = req.body;
    const to = process.env.my_mail;
    const subject = "Contact Request";
    const text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

    await sendMail(to, subject, text);
    res.status(200).json({ success: true, message:
        
        "Contact Requested Successfully" });
}


export const adminStats = async (req, res) => {
res.status(200).json({ success: true, message: "Stats" });

    
}



export const getaDashboardStats = async (req, res) => {
    const stats = await Stats.find({}).sort({createdAt: "desc"}).limit(12);
    
    const statsData = [];
    
    for (let i = 0; i < stats.length; i++) {
        statsData.unshift(stats[i]);
        
    }
    const requiredSize = 12-stats.length;

    for (let i = 0; i < requiredSize; i++) {
        statsData.unshift({
            users: 0,
            subscription: 0,
            views: 0,
        });
        
    }

    const usersCount = statsData[11].user;
    const subscriptionCount = statsData[11].subscription;
    const viewsCount = statsData[11].views;

    let usersProfile=true, subscriptionProfile=true, viewsProfile=true;
    let userPercentage=0, subscriptionPercentage=0, viewsPercentage= 0;

    if(statsData[10].user===0)userPercentage = usersCount *100;
    if(statsData[10].subscription===0)subscriptionPercentage = subscriptionCount *100;
    if(statsData[10].views===0)viewsPercentage = viewsCount *100;
    
    else{

        const difference={
            users:statsData[11].user - statsData[10].user,
            subscription:statsData[11].subscription - statsData[10].subscription,
            views:statsData[11].views - statsData[10].views
        };
        userPercentage = ((difference.users) / statsData[10].user) * 100;
        subscriptionPercentage = ((difference.subscription) / statsData[10].subscription) * 100;
        viewsPercentage = ((difference.views) / statsData[10].views) * 100;
        if(userPercentage<0)usersProfile=false;
        if(subscriptionPercentage<0)subscriptionProfile=false;
        if(viewsPercentage<0)viewsProfile=false;
        // userPercentage = ((usersCount - statsData[10].users) / statsData[10].users) * 100;
        // subscriptionPercentage = ((subscriptionCount - statsData[10].subscription) / statsData[10].subscription) * 100;
        // viewsPercentage = ((viewsCount - statsData[10].views) / statsData[10].views) * 100;
    }
    res.status(200).json({
        success:true,
        stats: statsData,
        usersCount,
        subscriptionCount,
        viewsCount,
        userPercentage,
        subscriptionPercentage,
        viewsPercentage,
        usersProfile,
        subscriptionProfile,
        viewsProfile
    })
}


export const totalData = async (req, res) => {
   
   try{

       const users= await User.countDocuments();
       const expert= await Expert.countDocuments();
       const courses= await course.countDocuments();
       const onlineInspections= await onlineInspection.countDocuments();
       const onsiteInspections= await onsiteInspection.countDocuments();
    const ebooks= await eBooks.countDocuments();
    const bookingSession= await BookingSession.countDocuments();
    const pocket= await PocketGarrage.countDocuments();
    
    res.json({
        success:true,
        users,
        expert,
        onlineInspections,
        onsiteInspections,
        ebooks,
        bookingSession,
        pocket,
        courses
    })
}
catch(error){
    console.log(error);
    res.status(500).json({
        success:false,
        message:error
    })
}

}


export const getBookingSessionsForExpert = async (req, res) => {
    try {
        // Find the expert by ID
        const expert = await Expert.findById(req.params.expertId);
        if (!expert) {
            return res.status(404).json({ success: false, message: 'Expert not found' });
        }

        res.status(200).json({ 
            success: true,
             
           bookingSession: expert.bookingsession });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getallOnlineInspectionForExpert = async (req, res) => {
    try {
        const expertId = req.params.id;
        const expert = await Expert.findById(expertId).populate('onlineInspection');

        if (!expert) {
            return res.status(404).json({
                success: false,
                message: "Expert not found",
            });
        }

        res.status(200).json({
            success: true,
            onlineInspection: expert.onlineInspection || [],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
  



export const getallOnsiteInspectionForExpert = async (req, res) => {

    try {
        const expertId = req.params.id;
        const expert = await Expert.findById(expertId).populate('onsiteInspection');

        if (!expert) {
            return res.status(404).json({
                success: false,
                message: "Expert not found",
            });
        }

        res.status(200).json({
            success: true,
            onsiteInspection: expert.onsiteInspection || [],
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}



export const getallPocketGarrageForExpert = async (req, res) => {

    try {
        const expertId = req.params.id;
        const expert = await Expert.findById(expertId).populate('pocketGarrage');

        if (!expert) {
            return res.status(404).json({
                success: false,
                message: "Expert not found",
            });
        }

        res.status(200).json({
            success: true,
            onsiteInspection: expert.pocketGarrage || [],
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}



export const getAllOnlineInspection = async (req, res) => {
    try {
        const onlineInspections = await onlineInspection.find();
        res.status(200).json({ success: true,onlineInspection: onlineInspections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const getAllonsiteInspection = async (req, res) => {
    try {
        const onsiteInspections = await onsiteInspection.find();
        res.status(200).json({ success: true,onsiteInspection: onsiteInspections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}