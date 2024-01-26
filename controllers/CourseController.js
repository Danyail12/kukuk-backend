import course from "../models/course.js";


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
    
    const { name, description, category, createby } = req.body;
    
    if(!name || !description || !category || !createby) {
        return res.status(400).json({ message: "All fields are required." });
    }
    
    // const file = req.file;
   await course.create({
       name,
       description,
       category,
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
    const{title,description} = req.body
    const{id} = req.params
    const courses = await course.findById(id)
    if(!courses){
        return res.status(404).json({message:"Course not found"})
    }

    
    courses.lectures.push({
        title,description,video:{
            public_id:"url",
            url: "url"
        }
    })
        courses.video = courses.lectures.length + 1
        await courses.save();


        res.status(200).json({
            success: true,
            message: "Lecture added successfully",
        })
    }



    export const deleteCourse = async (req, res) => {
        const{id} = req.params
        await course.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        })

    }