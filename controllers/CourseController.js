import course from "../models/course.js";
import Stats from "../models/Stats.js";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { formatUrl } from '@aws-sdk/util-format-url';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import multerS3 from 'multer-s3';
// import {upload} from "../utils/aws_serverice.js"

import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config({
    path: './config/config.env'
});



// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: 'us-east-1',
// });

// const s3 = new AWS.S3({ endpoint: 'https://s3.hidrive.strato.com', params: { Bucket: 'kukuk' } });

// const aws_upload = (params) => {
//     return new Promise((resolve, reject) => {
//         const { fileName, file } = params.image; // Destructure fileName and file directly from params.image
//         const buf = Buffer.from(file.replace(/^data:.+;base64,/, ""), "base64");
//         const currentTime = new Date().getTime(); // Add parentheses to getTime() to call the function
//         const data = {
//             Key: `${currentTime}`,
//             Body: params.file,
//             ContentEncoding: 'base64',
//             ACL: 'public-read',
//         };
//         s3.putObject(data, function(err, s3Data) { // Pass data instead of params to putObject
//             if (err) {
//                 console.log(err);
//                 reject(err);
//             } else {
//                 console.log(`File uploaded successfully. ${s3Data}`);
//                 resolve(s3Data);
//             }
//         });
//     });
// };

// export const upload_aws = async (req, res) => {
//     try {
//         // if (!req.file || !req.file.buffer) {
//         //     return res.status(400).json({ error: 'No file uploaded' });
//         // }

//         const fileData = req.file.buffer.toString('base64');
//         const fileName = req.file.originalname;

//         const uploadResponse = await processPublicFileUpload(fileData, fileName);

//         res.status(200).json({ url: uploadResponse.Location });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }

// };

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: 'https://s3.hidrive.strato.com',
    credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID
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

async function putObject(key, contentType) {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: `/uploads/user-uploads/${key}`,
        contentType: file
    });
    const url = await getSignedUrl(s3, command);
    return url;
}
async function init(){
    console.log("url is "+await getObjectUrl("test.jpg"));
}

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        }
    }),
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

export const upload_aws = async (req, res) => {
    try {
        console.log(req.file);
        // console.log(req.fileName);
                if (!req.file || !req.file.buffer) { // Check if req.file or req.file.buffer is undefined
            return res.status(400).json({ error: error.message });
        }

        const fileData = req.file.buffer.toString('base64');
        const fileName = req.file.originalname;

        const uploadResponse = await aws_upload({ fileName, file: fileData });

        res.status(200).json({ url: formatUrl(uploadResponse.Location) });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const aws_upload = async (params) => {
    const { fileName, file } = params;

    const data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(file, 'base64'),
        ACL: 'public-read'
    };

    try {
        const response = await s3.send(new PutObjectCommand(data));
        return response;
    } catch (error) {
        throw error;
    }
};

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images only (jpeg, jpg, png, gif, mp4, mov, png)!');
    }
}



export const fileUpload = async (req, res) => {
    if (!req?.file) {
        res.status(403).json({ status: false, error: "please upload a file" })
        return;
    }
    let data = {}
    if (!!req?.file) {
        data = {
            url: req.file.location,
            type: req.file.mimetype
        }
    }
    try {
        res.send({
            data: data,
            status: true
        })
    } catch (error) {
        res.status(403).json({ status: false, error: error })
    }
}

export const getCourse = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const category = req.query.category || "";
        const courses = await course.find({
            name: {
                $regex: keyword,
                $options: "i",
            },
            category: {
                $regex: keyword,
                $options: "i",
            },
        }).select("-lectures");
        res.status(200).json({
            
           success: true,
            courses
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}



export const createCourse = async (req, res) => {
    
    const { name, description, category, createby,price,duration,stars } = req.body;
    
    // if(!name || !description || !category || !createby || !price) {
    //     return res.status(400).json({ message: "All fields are required." });
    // }
    console.log("Incoming data:", req.body)
    
    // const file = req.file;
   await course.create({
       name,
       description,
       category,
       duration,
       stars,
       price,
       createby,
       poster:{
        public_id:"temp",
        url: "temp"
       },
   })

   res.status(201).json({ 
    success: true,
    message: "Course created successfully."
 });
    
}

export const getCourseLectures = async (req, res) => {
        const courses = await course.findById(req.params.id)
        
        if(!courses){
            return res.status(404).json({message:"Course not found"})
        }
        courses.views +=  1;
        await courses.save();

        res.status(200).json({
            success: true,
            lectures: courses.lectures
        })

}


export const addLecture = async (req, res) => {
    const { title, description } = req.body;
    const { id } = req.params;

    try {
        const courses = await course.findById(id);

        if (!courses) {
            return res.status(404).json({ message: "Course not found" });
        }

        courses.lectures.push({
            title,
            description,
            video: {
                public_id: "temp",
                url: "temp"
            }
        });

        courses.video = courses.lectures.length + 1;
        courses.numOfVideos = courses.lectures.length + 1;

        await courses.save();

        res.status(200).json({
            success: true,
            message: "Lecture added successfully",
        });
    } catch (error) {
        console.error("Error adding lecture:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


    export const deleteCourse = async (req, res) => {
        const{id} = req.params
      const courses =  await course.findById(id)
        if(!courses){
            return res.status(404).json({message:"Course not found"})
        }

        for(let i = 0; i < courses.lectures.length; i++) {
            const video = courses.lectures[i].video.public_id
            // await cloudinary.v2.uploader.destroy(video)
        }

        await courses.deleteOne();
        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        })

    }


    course.watch().on('change', async () => {
        const stats = await Stats.find({}).sort({ createdAt: 'desc' }).limit(1);
       const courses=await course.find({});
       let totalviews=0;
       for(let i=0;i<courses.length;i++){
           totalviews+=courses[i].views

       }

    //    stats[0].views = totalviews;
    //    stats[0].createdAt = Date.now();
    //    await stats[0].save();
    })