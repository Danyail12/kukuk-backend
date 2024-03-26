import mongoose from 'mongoose';



const onlineInspectionSchema = new mongoose.Schema({

    make:{
        type: String,
        required: true
    },
    model:{
        type: String,
        required: true
    },
    year:{
        type: Number,
        required: true
    },
    vechicleVin:{
        type: String,
        required: true
    },
    body:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    licensePlates:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    handTruck:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    glass:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    wiperBlades:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    Reflectors:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    mudFlaps:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    racking:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    coldCurtains:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    doorIssues:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    insurance:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    headlights:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    turnsignals:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    makerlights:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    brakeLights:{
        type: String,
        enum: ['Defective', 'working'],
        default: 'Defective'
    },
    carImages:{
        public_id: String,
        url: String
    },
    RegistrationImages:{
        public_id: String,
        url: String
    },
    Documents:{
        public_id: String,
        url: String
    },
    location: {
        type: {
          type: String,
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          default: [0, 0],
  
        },
        expertId:{
            type:Object
        },
        user:{
            type:Object
        }
      }
})



export default mongoose.model('OnlineInspection', onlineInspectionSchema)