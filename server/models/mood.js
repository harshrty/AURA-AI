const mongoose = require('mongoose')

const moodSchema = new mongoose.Schema ({

    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
        required: true,

    },
    
    moodScore : {
        type : Number,
        required: true,
        min :[1],
        max :[10]
    },
    emotionTag : {
        type : String,
        required : true,
        enum: ['Happy', 'Anxious', 'Sad', 'Calm', 'Stressed', 'Neutral']

        
    }, 
    note : {
        type : String     
        
    }
    

}, {timestamps: true

})

const Mood = mongoose.model("Mood", moodSchema);
module.exports = Mood;