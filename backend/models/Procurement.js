const mongoose = require("mongoose")

const procurementSchema = new mongoose.Schema({

produceName:{
type:String,
required:true
},

produceType:{
type:String,
required:true
},

tonnage:{
type:Number,
required:true
},

cost:{
type:Number,
required:true
},

supplier:{
type:String,
required:true
},

branch:{
type:String,
enum:["Maganjo","Matugga"],
required:true
},

date:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Procurement",procurementSchema)