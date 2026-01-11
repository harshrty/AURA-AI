const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema ({

    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
        required: true,

    },
    
    content : {
        type : String,
        required : [true,"message cannot be empty"],
        trim : true,
    },
     role : {
        type : String,
        required : true,
        enum: ['user','aura']
        
    }
   
    

}, {timestamps: true

});
MessageSchema.index({user :1,createdAt:-1})

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;