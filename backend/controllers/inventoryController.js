const Inventory = require("../models/Inventory")

exports.getInventory = async(req,res)=>{

try{

const inventory = await Inventory.find()

res.json(inventory)

}catch(error){

res.status(500).json({message:error.message})

}

}

exports.addInventory = async(req,res)=>{

try{

const item = new Inventory(req.body)

await item.save()

res.status(201).json(item)

}catch(error){

res.status(400).json({message:error.message})

}

}