import mongoose from "mongoose";



const pocketGarrageSchema = new mongoose.Schema({

   
    description:{
        type: String,
        // required: true
    },
    expires:{
        type: Date,
        // required: true
    },
    carBrand:{
        type: String,
        // required: true
    },
    carModel:{
        type: String,
        // required: true
    },
    year:{
        type: String,
        // required: true
    },
    certificates:{
        type: String,
        // required: true
    },
    carImages:{
        type:String,
        // required: true
    },
    Registration:{
        type:String,
        // required: true
    },
    InspectionCertificates:{
        type:String,
        // required: true
    },
    TÜVInspectionCertificate:{
        type:String,
        // required: true
    },
    historyFile:{
        type:String,
        // required: true
    },
    ownershipHistory:{
        type:String,
        // required: true
    },
    invoicesBill:{
        type:String,
        // required: true
    },
    AdditionalPhotos:{
        type:String,
        // required: true
    },
    additionalDocuments:{
        type:String,
        // required: true
    },
   
})




export default mongoose.model("PocketGarrage", pocketGarrageSchema)