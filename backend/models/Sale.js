const mongoose = require("mongoose")

const saleSchema = new mongoose.Schema({

produce:{
type:String,
required:true
},

quantity:{
type:Number,
required:true
},

price:{
type:Number,
required:true
},

amountPaid:{
type:Number,
required:true
},

buyer:{
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

module.exports = mongoose.model("Sale",saleSchema)