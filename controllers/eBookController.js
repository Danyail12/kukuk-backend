import eBooks from "../models/eBooks.js";
import { User } from "../models/users.js";

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
    const { name, description, category, createby ,price} = req.body;
    
    // if(!name || !description || !category || !createby) {
    //     return res.status(400).json({ message: "All fields are required." });
    // }
    
    // const file = req.file;
   await eBooks.create({
       name,
       description,
       category,
       createby,
       price,
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
    // await Ebooks.save();

    res.status(200).json({
        success: true,
        fullBook: Ebooks.fullBook
    })

}
export const addEbook = async (req, res) => {
    const{title,description} = req.body
    // const file = req.file
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
        // eBook.numOfEbooks = eBooks.fullBook.length + 1
        await eBook.save();


        res.status(200).json({
            success: true,
            message: "Ebook added successfully",
        })
    }



    export const deleteEbook = async (req, res) => {
        const{id} = req.params
       const ebooks = await eBooks.findById(id)

        if(!ebooks){
            return res.status(404).json({message:"Ebook not found"})
        }

        await ebooks.remove()



        res.status(200).json({
            success: true,
            message: "Ebook deleted successfully"
        })

    }


    export const removeToUser = async (req, res) => {
        try {
          const { id } = req.params;
          const user = await User.findById(req.user._id);
      
          // Remove the eBook from user's fullbook array
          user.fullbook.pull(id);
      
          // Save the updated user document
          await user.save();
      
          res.status(200).json({
            success: true,
            message: "Ebook removed successfully",
          });
        } catch (error) {
          console.error('Error removing ebook:', error);
          res.status(500).json({
            success: false,
            message: "Something went wrong while removing the ebook",
          });
        }
      };
      

