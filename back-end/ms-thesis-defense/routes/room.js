const express = require("express");
const {authMiddleware} = require('../services/AuthService');
const {addRoom,deleteRoom,getAllRooms} = require('../controllers/roomController');


const router = express.Router();


router.post('/',authMiddleware,addRoom);
router.get('/',authMiddleware,getAllRooms);
router.delete('/:id',authMiddleware,deleteRoom);

module.exports = router;