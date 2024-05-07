import express from "express";
import User from "./routes/userRoute.js";
import Courses from "./routes/CourseRoute.js";
import ebooking from "./routes/EbookRoute.js";
import Expert  from "./routes/ExpertRoute.js";
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
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {  ListBucketsCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
// import {ListObjectsCommand} from '@aws-sdk/client-s3';
// import { formatUrl } from '@aws-sdk/util-format-url';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';



dotenv.config({
    path: "./config/config.env",
});

const corsOptions = {
    origin: '*',
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

console.log(process.env.AWS_ACCESS_KEY_ID)

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

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        signatureVersion: 'v4',
      }
});

async function getObjectUrl(key) {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key
    });
    const url = await getSignedUrl(s3, command);
    return url;

    // console.log(url + 'url');
}

async function putObject(fileName, contentType) {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: `/uploads/user-uploads/${fileName}`,
        ContentType: contentType
    });
    const url = await getSignedUrl(s3, command);
    return url;
}
const listBuckets = async () => {
  try {
    const data = await s3.send(new ListBucketsCommand({}));
    console.log('Buckets:', data.Buckets);
  } catch (err) {
    console.error('Error listing buckets:', err);
  }
};


async function init(){
    // console.log("url is "+ await getObjectUrl("uploads/user-uploads/image-201714679201722.jpg"  ));
    // console.log("put object url is "+ await putObject(`image ${Date.now()}/.jpg`, "image/jpg"));
    listBuckets();
}

init();



app.get("/", (req, res) => {
  res.send("Server is working");
});




export default app;