const Mood = require("../models/mood");
const mood = require("../models/mood")



exports.addMood = async (req , res) => { 
    try {
        const {moodScore,emotionTag , note} = req.body
        const UserId = req.User;

        const newMood = await mood.create ( {
            user : UserId,
            moodScore,
            emotionTag,
            note

        });
        res.status(201).json({sucess : true , data : newMood})



    } catch (error) {
        res.status(500).json ({message : "error saving Mood", error : error.message});

    }


} 

exports.getMoodTrends = async (req , res) => {
    try {
        const UserId = req.user;

        const trends = await Mood.find({user : UserId})
        .sort({createdAt : -1})
        .limit(7);

        res.status(200).json({sucess : true, data: trends});
    } catch (error) {
        res.status(500).json({message : "Error fetching trends", error : error.message})
    }
};