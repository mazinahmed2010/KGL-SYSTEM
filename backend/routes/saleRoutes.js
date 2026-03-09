const express = require("express")

const router = express.Router()

const {createSale} = require("../controllers/saleController")

const {protect,authorize} = require("../middleware/auth")

router.post("/",protect,authorize("Manager","Agent"),createSale)

module.exports = router