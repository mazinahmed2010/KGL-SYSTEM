const Procurement = require("../models/Procurement")
const Inventory = require("../models/Inventory")

exports.addProcurement = async(req,res)=>{

try{

const procurement = new Procurement(req.body)

await procurement.save()

let item = await Inventory.findOne({name:req.body.produceName})

if(item){

item.tonnage += req.body.tonnage

await item.save()

}else{

await Inventory.create({

name:req.body.produceName,
type:req.body.produceType,
tonnage:req.body.tonnage,
price:req.body.cost,
branch:req.body.branch

})

}

res.status(201).json(procurement)

}catch(error){

res.status(400).json({message:error.message})

}

}