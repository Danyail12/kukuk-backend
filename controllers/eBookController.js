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
    const { name, description, category, createby ,price,stars,author} = req.body;
    
    // if(!name || !description || !category || !createby) {
    //     return res.status(400).json({ message: "All fields are required." });
    // }
    
    // const file = req.file;
   await eBooks.create({
       name,
       description,
       category,
       createby,
       stars,
       author,
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
      
      export const removeEbookFromFullBook = async (req, res) => {
        try {
          const userId = req.user._id;
          const ebookId = req.query.id;
      
          // Find the user
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }
      
          // Find the eBook
          const ebook = await eBooks.findById(ebookId);
          if (!ebook) {
            return res.status(400).json({ success: false, message: 'Ebook not found' });
          }
      
          // Filter out the eBook from the user's fullbook list
          const updatedFullBook = user.fullbook.filter(item => item.ebooks.toString() !== ebookId);
      
          // Update the user's fullbook list
          user.fullbook = updatedFullBook;
          await user.save();
      
          res.status(200).json({ success: true, message: 'Ebook removed from full book list' });
        } catch (error) {
          console.error('Error removing ebook from full book:', error);
          res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
      };

      export const addToReadEbook = async (req, res) => {
        try {
          const userId = req.user._id;
        //   const {ebookId } = req.query; // Extract ebookId from req.query
      
          // Find the user
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }
      
          // Find the eBook
          const ebook = await eBooks.findById(req.body.id);
          console.log(ebook);
          if (!ebook) {
            return res.status(400).json({ success: false, message: 'Ebook not found' });
          }
      
          // Check if the eBook already exists in the user's reading list
          const existingEbook = user.fullbook.find(item => item.ebooks.toString() === req.body.id);
          if (existingEbook) {
            return res.status(400).json({ success: false, message: 'Ebook already exists in reading list' });
          }
      
          // Add the eBook to the user's reading list
          user.fullbook.push({ ebooks: req.body.id });
          await user.save();
      
          res.status(200).json({ success: true, message: 'Ebook added to reading list' });
        } catch (error) {
          console.error('Error adding ebook to reading list:', error);
          res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
      };
      