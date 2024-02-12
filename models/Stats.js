const statsSchema = new mongoose.Schema({
    views: {
        type: Number,
        default: 0
    },
    downloads: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    
})




export default mongoose.model('Stats', statsSchema)



