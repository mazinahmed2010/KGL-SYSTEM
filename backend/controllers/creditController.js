const CreditSale = require("../models/CreditSale")

exports.createCredit = async(req,res)=>{

try{

const credit = new CreditSale(req.body)

await credit.save()

res.status(201).json(credit)

}catch(error){

res.status(400).json({message:error.message})

}

}

exports.getCredits = async(req,res)=>{

try{

const credits = await CreditSale.find()

res.json(credits)

}catch(error){

res.status(500).json({message:error.message})

}

}