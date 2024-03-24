import mongoose from "mongoose";


const eBookSchema = new mongoose.Schema({

    name: {
        type: String,
        // required: true
    },
    createdby: {
        type: String,
        // required: true
    },
    price:{
        type: Number,
        // required: true
    },
    stars:{
        type: String,
    },
    author:{
        type: String,
    },
   
    poster:{
        public_id: {
            type: String,
            // required: true
        },
        url:{
            type: String,
            // required: true
        }
    },
    description:{
        type: String,
        // required: true
    },
    category: {
        type: String,
        // required: [true, "Please add a category"]
    },
    numOfEbooks: {
        type: Number,
        default: 0
    },
    fullBook: [{
      title: {
        type: String,
        // required: [true, "Please add a title"]
      },
      description: {
        type: String,
        // required: [true, "Please add a description"]
      },
      file: {
        public_id: {
          type: String,
          // required: [true, "Please add a public_id"]
    },
    url:{
      type: String,
      // required: [true, "Please add a url"]
    }
      },
      url:{
        type: String,
        // required: [true, "Please add a url"]
      }
    }],
    
        //  timestamps: true
         

})


export default mongoose.model("eBook", eBookSchema)