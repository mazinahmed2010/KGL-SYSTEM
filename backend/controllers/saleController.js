const Sale = require("../models/Sale")
const Inventory = require("../models/Inventory")

exports.createSale = async(req,res)=>{

try{

const sale = new Sale(req.body)

await sale.save()

const item = await Inventory.findOne({name:req.body.produce})

if(item){

item.tonnage -= req.body.quantity

await item.save()

}

res.status(201).json(sale)

}catch(error){

res.status(400).json({message:error.message})

}

}