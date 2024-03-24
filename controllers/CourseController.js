import course from "../models/course.js";
import Stats from "../models/Stats.js";


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