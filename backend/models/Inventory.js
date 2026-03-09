const mongoose = require("mongoose")

const inventorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    tonnage:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    branch:{
        type:String,
        enum:["Maganjo","Matugga"],
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Inventory",inventorySchema)