const express = require ("express")
const router = express.Router();
const {protect } = require ("../middlewares/authmiddleware");
const {addMood,getMoodTrends} = require ( "../controllers/moodcontroller")


router.post("/add",protect, addMood);
router.get("/trends", protect, getMoodTrends)

module.exports = router;
