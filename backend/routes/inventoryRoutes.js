const express = require("express")
const router = express.Router()

const {getInventory,addInventory} = require("../controllers/inventoryController")

const {protect,authorize} = require("../middleware/auth")

router.get("/",protect,getInventory)

router.post("/",protect,authorize("Manager"),addInventory)

module.exports = router