import course from "../models/course.js";
import Stats from "../models/Stats.js";

import AWS from 'aws-sdk';



AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
});

const s3 = new AWS.S3({ endpoint: 'https://s3.hidrive.strato.com', params: { Bucket: 'kukuk' } });

const aws_upload = (params) => {
    return new Promise((resolve, reject) => {
        // const { fileName, file } = params.image; // Destructure fileName and file directly from params.image
        // const buf = Buffer.from(file.replace(/^data:.+;base64,/, ""), "base64");
        const currentTime = new Date().getTime(); // Add parentheses to getTime() to call the function
        const data = {
            Key: `${currentTime}`,
            Body: params.file,
            ContentEncoding: 'base64',
            ACL: 'public-read',
        };
        s3.putObject(data, function(err, s3Data) { // Pass data instead of params to putObject
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(`File uploaded successfully. ${s3Data}`);
                resolve(s3Data);
            }
        });
    });
};

export const upload_aws = async (req, res) => {
    try {
        const location = await aws_upload(req.body); // Pass req.body directly
        res.status(200).json({ location });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

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