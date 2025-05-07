const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        const conn = await mongoose.connect("mongodb://root:root@localhost:27017",{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log(`mongodb connected: ${conn.connection.host}`)
    }catch(err){
        console.log(err);
        process.exit();
    }
}

module.exports =connectDB;