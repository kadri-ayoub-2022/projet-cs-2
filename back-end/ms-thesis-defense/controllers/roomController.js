const Room = require('../models/room');



const addRoom = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    const user = await req.user;
    if (!user) return res.status(401).json({ message: 'Utilisateur non authentifié' });

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé : rôle admin requis' });
    }

    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Nom de la salle requis' });

    try {
        const existingRoom = await Room.findOne({ name });
        if (existingRoom) {
            return res.status(409).json({ message: 'Une salle avec ce nom existe déjà' });
        }

        const room = new Room({ name });
        await room.save();

        return res.status(201).json({ message: 'Salle ajoutée avec succès', room });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

const deleteRoom = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    const user = await req.user;
    if (!user) return res.status(401).json({ message: 'Utilisateur non authentifié' });

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé : rôle admin requis' });
    }

    const roomId = req.params.id;

    try {
        await Room.findByIdAndDelete(roomId);
        return res.status(200).json({ message: 'Salle supprimée avec succès' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getAllRooms = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    const user = await req.user;
    if (!user) return res.status(401).json({ message: 'Utilisateur non authentifié' });

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé : rôle admin requis' });
    }

    try {
        const rooms = await Room.find();
        return res.status(200).json({ rooms });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};



module.exports ={
    addRoom,
    deleteRoom,
    getAllRooms

}
