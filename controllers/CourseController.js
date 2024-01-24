import course from "../models/course";


export const getCourse = async (req, res) => {
    try {
        const courses = await course.find().select("-lectures");
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
    
    const file = req.file;
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