const express = require("express")

const router = express.Router()

const {createCredit,getCredits} = require("../controllers/creditController")

const {protect,authorize} = require("../middleware/auth")

router.post("/",protect,authorize("Manager","Agent"),createCredit)

router.get("/",protect,getCredits)

module.exports = router