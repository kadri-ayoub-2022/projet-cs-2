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



// Code for Ishak
// const mongoose = require("mongoose");
//
// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect("mongodb://localhost:27017/pfe", {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log(`MongoDB connected: ${conn.connection.host}`);
//     } catch (err) {
//         console.error("MongoDB connection error:", err);
//         process.exit(1); // Exit with a failure code
//     }
// };
//
// module.exports = connectDB;
