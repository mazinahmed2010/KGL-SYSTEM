const mongoose = require("mongoose")

const creditSaleSchema = new mongoose.Schema({

buyerName:{
type:String,
required:true
},

NIN:{
type:String,
required:true
},

produce:{
type:String,
required:true
},

quantity:{
type:Number,
required:true
},

amountDue:{
type:Number,
required:true
},

branch:{
type:String,
required:true
},

status:{
type:String,
default:"Pending"
},

date:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("CreditSale",creditSaleSchema)