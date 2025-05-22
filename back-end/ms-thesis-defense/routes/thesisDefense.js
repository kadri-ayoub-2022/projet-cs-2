const express = require("express");
const {authMiddleware} = require('../services/AuthService');
const {createDefense,getAllDefensesWithRooms,getDefensesByStudent,getDefensesByTeacherOrJury,getJuryByThemeId} = require('../controllers/periodDefenseController');

const router = express.Router();

router.post('/',authMiddleware,createDefense);

router.get('/',authMiddleware,getAllDefensesWithRooms);

router.get('/ForStudent/:studentId',authMiddleware,getDefensesByStudent);

router.get('/ForTeacher/:teacherId',authMiddleware,getDefensesByTeacherOrJury);

router.get('/jury/:themeId',getJuryByThemeId);

module.exports = router;