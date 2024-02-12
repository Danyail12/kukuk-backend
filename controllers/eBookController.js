import eBooks from "../models/eBooks.js";


export const getEBooks = async (req, res) => {

    try {
        const eBook = await eBooks.find();
        res.status(200).json(
            {
                success: true,
                message: "All eBooks",
                eBook
            });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const createEbooks = async (req, res) => {
    const { name, description, category, createby } = req.body;
    
    if(!name || !description || !category || !createby) {
        return res.status(400).json({ message: "All fields are required." });
    }
    
    // const file = req.file;
   await eBooks.create({
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
    message: "Ebook created successfully."
 });


}


export const getEbookPdf = async (req, res) => {
    const Ebooks = await eBooks.findById(req.params.id)
    
    if(!Ebooks){
        return res.status(404).json({message:"Ebook not found"})
    }
    // courses.views +=  1;
    await Ebooks.save();

    res.status(200).json({
        success: true,
        fullBook: Ebooks.fullBook
    })

}
export const addEbook = async (req, res) => {
    const{title,description} = req.body
    const{id} = req.params
    const eBook = await eBooks.findById(id)
    if(!eBook){
        return res.status(404).json({message:"Ebook not found"})
    }

    
    eBook.fullBook.push({
        title,description,file:{
            public_id:"url",
            url: "url"
        }
    })
        eBook.file = eBooks.fullBook.length + 1
        await eBook.save();


        res.status(200).json({
            success: true,
            message: "Ebook added successfully",
        })
    }



    export const deleteEbook = async (req, res) => {
        const{id} = req.params
        await course.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: "Ebook deleted successfully"
        })

    }


