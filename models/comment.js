const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const commentSchema = new Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    message: String,
    
})

const Comment=mongoose.model('comment',commentSchema)
module.exports=Comment;