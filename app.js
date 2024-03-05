import express from "express";
import User from "./routes/userRoute.js";
import Courses from "./routes/CourseRoute.js";
import ebooking from "./routes/EbookRoute.js";
import  Expert from "./routes/ExpertRoute.js";
import Report from "./routes/ReportRoute.js";
import Pocket from "./routes/PocketRoute.js";
import Product from "./routes/ProductRoute.js";
import other from "./routes/otherRoute.js";
import payment from "./routes/paymentRoute.js";
import cron from 'node-cron';
import {sendMail} from './utils/sendMail.js';
import report from "./models/report.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import Stripe from "stripe";


dotenv.config({
    path: "./config/config.env",
});

const corsOptions = {
    origin: 'https://admin-panel-eight-delta.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH','HEAD'],
    credentials: true,
}
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions))
app.use("/api/v1", User);
app.use("/api/v1", Courses);
app.use("/api/v1",ebooking);
app.use("/api/v1",Expert);
app.use("/api/v1",Report);
app.use("/api/v1",Pocket)
app.use("/api/v1",Product)
app.use("/api/v1",other)
app.use("/api/v1",payment)


cron.schedule('0 12 * * *', async () => {
  try {
    const currentDate = new Date();

    // Find reports with expiration dates matching the current date
    const reportsToSendReminder = await report.find({
      expires: {
        $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
        $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
      },
      reminderSent: false,
    });

    // Send reminders for each report
    for (const report of reportsToSendReminder) {
      await sendMail(report.email, 'Report Expiration Reminder', 'Your report is expiring today.');
      // Mark the reminder as sent
      await Report.findByIdAndUpdate(report._id, { $set: { reminderSent: true } });
    }

    console.log('Reminder check completed.');
  } catch (error) {
    console.error('Error:', error);
  }
});


cron.schedule('0 0 1 * *', async () => {
  try {
   await Stats.create({});

}
  catch (error) {
    console.log(error);
  }})

app.get("/", (req, res) => {
  res.send("Server is working");
});




export default app;