const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DefenseSchema = new Schema({
    themeId: {
        type: Number,  
        required: true
    },
    title:{type: String},
    teacher: {
        id: { type: Number, required: true },
        name:{type:String,required:true},
        email:{type:String,required:true},
        note: { type: Number, required: false} 
    },
    student1: {
        id : {type: Number,required: true},
        email:{type:String,required:true},
        name:{type:String,required:true},
    },
    student2: {
        id : {type: Number,required: true},
        name:{type:String,required:true},
        email:{type:String,required:true}
    },
    jury: [
    {
        id: { type: Number, required: true },
        name:{type:String,required:true},
        email:{type:String,required:true},
        note: { type: Number, required: false }
    }],
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    date: {
        type: Date
    },
    startTime: {
        type: String // hh:mm format
    },
    endTime: {
       type: String // hh:mm format
    },
    note: { type: Number, required: false },
    pv:{ type: String ,required: false}
});

module.exports = mongoose.model("Defense", DefenseSchema);
