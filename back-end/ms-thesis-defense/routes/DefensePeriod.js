const express = require("express");
const {authMiddleware} = require('../services/AuthService');
const {addDefensePeriod,getDefensePeriod,generatePeriodDefense,updateJury,updateRoom,generateOneDefenseManually,updateDefenseTime,updateNote,updatePv} = require('../controllers/periodDefenseController');

const router = express.Router();

router.post('/',authMiddleware,addDefensePeriod);
router.get('/',authMiddleware,getDefensePeriod);
router.post('/generate',authMiddleware,generatePeriodDefense);
router.post('/generate/forOne',authMiddleware,generateOneDefenseManually);
router.put('/update-jury/:id',authMiddleware,updateJury);
router.put('/update-room/:id',authMiddleware,updateRoom);
router.put('/update-time/:id',authMiddleware,updateDefenseTime);
router.put('/update-noteByTeacher/:id',authMiddleware,updateNote);
router.put('/addPv/:id',authMiddleware,updatePv);


module.exports = router;


