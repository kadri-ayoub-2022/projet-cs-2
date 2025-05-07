const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    date: {
        type: Date
    },
    startTime: {
        type: String // Format "HH:mm"
    },
    endTime: {
        type: String // Format "HH:mm"
    }
});

const juryAvailabilitySchema = new mongoose.Schema({
    teacher: {
        id: { type: Number, required: true,unique: true },
        name:{type:String,required:true},
        email:{type:String,required:true},
        note: { type: Number, required: false } 
    },
    unavailable: [availabilitySchema]
});

module.exports = mongoose.model('JuryAvailability', juryAvailabilitySchema);
