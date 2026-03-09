const express = require("express")

const router = express.Router()

const {addProcurement} = require("../controllers/procurementController")

const {protect,authorize} = require("../middleware/auth")

router.post("/",protect,authorize("Manager"),addProcurement)

module.exports = router