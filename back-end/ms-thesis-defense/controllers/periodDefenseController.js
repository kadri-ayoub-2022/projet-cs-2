const DefensePeriod = require('../models/defensePeriod');
const Room = require("../models/room");
const JuryAvailability = require("../models/juryAvailablity");
const defenseSession = require("../models/defenseSession");
const {generateTimeSlots} = require('../services/sessionDefense');
const {sendEmail} = require('../services/SendEmailToStudent');

const addDefensePeriod = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    const user = await req.user;
    if (!user) return res.status(401).json({ message: 'Utilisateur non authentifié' });

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé : rôle admin requis' });
    }
  const { start, end } = req.body;

  if (!start || !end) {
    return res.status(400).json({ message: 'Start and end dates are required.' });
  }

  try {
    // Delete all existing documents
    await DefensePeriod.deleteMany({});

    // Add the new one
    const period = new DefensePeriod({ start:new Date(start), end: new Date(end) });
    await period.save();

    return res.status(201).json({ message: 'Defense period set successfully', period });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getDefensePeriod = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    const user = await req.user;
    if (!user) return res.status(401).json({ message: 'Utilisateur non authentifié' });

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé : rôle admin requis' });
    }
  try {
    const period = await DefensePeriod.findOne(); // Get the first (or only) document

    if (!period) {
      return res.status(404).json({ message: 'No defense period found.' });
    }

    return res.status(200).json(period);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// {
//   "themeId": 12,
//   "teacher": { "id": 3, "name": "Dr. Smith" ,email:"email@example.com"},
//   "student1": { "id": 101, "name": "Alice",email:"email@example.com" },
//   "student2": { "id": 102, "name": "Bob",email:"email@example.com" },
//   "jury": [
//     { "id": 201,email:"email@example.com", "name": "Prof. X" },
//     { "id": 202,email:"email@example.com", "name": "Prof. Y" }
//   ]
// }

const createDefense = async(req,res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    const user = await req.user;
    if (!user) return res.status(401).json({ message: 'Utilisateur non authentifié' });

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé : rôle admin requis' });
    }
    const {
            themeId,
            title,
            teacher,
            student1,
            student2,
            jury
        } = req.body;
    
        if (!themeId || !teacher || !student1 || !student2 || !jury || !title) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const formattedJury = jury.map(member => ({
        id: member.id,
        name: member.name,
        email:member.email,
        note: null
    }));

    const newDefense = new defenseSession({
        themeId,
        title,
        teacher: {
            id: teacher.id,
            name: teacher.name,
            email:teacher.email,
            note: null
        },
        student1: {
            id: student1.id,
            name: student1.name,
            email: student1.email
        },
        student2: {
            id: student2.id,
            name: student2.name,
            email: student2.email
        },
        jury: formattedJury,
        date: null,
        startTime: null,
        endTime: null,
        roomId: null,
        note: null
    });
    await newDefense.save();
    return res.status(201).json({ message: 'Defense created successfully', defense: newDefense });

}

const generatePeriodDefense = async (req,res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    const user = await req.user;
    if (!user) return res.status(401).json({ message: 'Utilisateur non authentifié' });

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé : rôle admin requis' });
    }
    const { defenseStart, defenseEnd } = req.body;

    const themes = await defenseSession.find({
        "jury.1": { $exists: true }, // jury[1] existe => jury.length >= 2
        roomId: null,
        date: null,
        startTime: null,
        endTime: null
    });

    const rooms = await Room.find();

    const timeSlots = generateTimeSlots(defenseStart, defenseEnd);

    const scheduledDefenses = [];
    const NotScheduledDefenses = [];

    for (const theme of themes) {
        const {teacher,jury} = theme;
        const participants = [...jury, teacher];

        let scheduled = false;

        for (const date of timeSlots){
            for (const slot of date.slots){
                let allAvailable = true;
                for (const participant of participants) {
                    const availability = await JuryAvailability.findOne({ "teacher.id": participant.id });
                    if (availability) {
                        const isUnavailable = availability.unavailable.some(unav => {
                            return (
                                new Date(unav.date).toDateString() === new Date(date.date).toDateString() &&
                                (slot.startTime < unav.endTime &&
                                slot.endTime > unav.startTime)
                            )
                        });
                        if (isUnavailable){
                            allAvailable = false;
                            break;
                        }
                    }
                }
                if (!allAvailable) continue;
                for (const room of rooms) {
                    const isRoomOccupied = await defenseSession.findOne({
                        roomId: room._id,
                        date: new Date(date.date),
                        $or: [
                            {
                                startTime: { $lt: slot.endTime },
                                endTime: { $gt: slot.startTime }
                            }
                        ]
                    });
                    if (isRoomOccupied) continue;
                    theme.roomId = room._id;
                    theme.date = new Date(date.date);
                    theme.startTime = slot.startTime;
                    theme.endTime = slot.endTime;

                    await theme.save(); // sauvegarde en base
                    scheduledDefenses.push(theme); // pour suivi
                    for (const participant of participants){
                        const availability = await JuryAvailability.findOne({ "teacher.id": participant.id });
                        const newUnavailability = {
                            date: theme.date,
                            startTime: theme.startTime,
                            endTime: theme.endTime
                        };
                        if (!availability) {
                            // 🔹 Créer un nouveau document si non existant
                            const newAvailability = new JuryAvailability({
                                teacher: {
                                    id: participant.id,
                                    name: participant.name,
                                    email:participant.email
                                },
                                unavailable: [newUnavailability]
                            });
                            await newAvailability.save();
                        } else {
                            // 🔹 Ajouter la plage si elle n’existe pas déjà
                            const exists = availability.unavailable.some(unav =>
                                new Date(unav.date).toDateString() === new Date(theme.date).toDateString() &&
                                unav.startTime === theme.startTime &&
                                unav.endTime === theme.endTime
                            );

                            if (!exists) {
                                availability.unavailable.push(newUnavailability);
                                await availability.save();
                            }
                        }
                    }
                    
                    scheduled = true;
                    const emailSubject = `Soutenance de votre PFE planifiée`;
                    const emailMessage = `
                        <p>Bonjour,</p>
                        <p>Votre soutenance de projet de fin d'études a été planifiée :</p>
                        <ul>
                            <li><strong>Titre du projet :</strong> ${theme.title}</li>
                            <li><strong>Date :</strong> ${new Date(theme.date).toLocaleDateString()}</li>
                            <li><strong>Heure :</strong> de ${theme.startTime} à ${theme.endTime}</li>
                            <li><strong>Salle :</strong> ${room.name}</li>
                        </ul>
                        <p>Merci de vous présenter à l'heure.</p>
                        <p>— ESI-PFE</p>
                    `;
                    if (theme.student1?.email) {
                        await sendEmail({
                            email: theme.student1?.email,
                            subject: emailSubject,
                            message: emailMessage,
                        });
                    }

                    if (theme.student2?.email) {
                        await sendEmail({
                            email: theme.student2?.email,
                            subject: emailSubject,
                            message: emailMessage,
                        });
                    }

                    // 🔸 2. Encadrant (teacher)
                    const teacherSubject = "🧑‍🏫 Soutenance planifiée pour votre encadrement";
                    const teacherMessage = `
                        <p>Bonjour,</p>
                        <p>La soutenance du projet <strong> pour le theme "${theme.title}" </strong> que vous encadrez a été planifiée :</p>
                        <ul>
                            <li><strong>Date :</strong>${new Date(theme.date).toLocaleDateString()}</li>
                            <li><strong>Heure :</strong> de ${theme.startTime} à ${theme.endTime}</li>
                            <li><strong>Salle :</strong> ${room.name}</li>
                        </ul>
                        <p>Merci d'être présent en tant qu'encadrant.</p>
                        <p>— ESI-PFE</p>
                    `;
                    if (theme.teacher?.email) {
                        await sendEmail({
                            email: theme.teacher.email,
                            subject: teacherSubject,
                            message: teacherMessage,
                        });
                    }

                    // 🔸 3. Membres du jury
                    const jurySubject = "👨‍⚖️ Convocation à une soutenance PFE";
                    const juryMessage = `
                        <p>Bonjour,</p>
                        <p>Vous êtes convoqué(e) en tant que membre du jury pour la soutenance suivante :</p>
                        <ul>
                            <li><strong>Titre du projet :</strong> ${theme.title}</li>
                            <li><strong>Date :</strong> ${new Date(theme.date).toLocaleDateString()}</li>
                            <li><strong>Heure :</strong> de ${theme.startTime} à ${theme.endTime}</li>
                            <li><strong>Salle :</strong> ${room.name}</li>
                        </ul>
                        <p>Merci pour votre participation.</p>
                        <p>— ESI-PFE</p>
                    `;

                    for (const juror of theme.jury) {
                        if (juror?.email) {
                            await sendEmail({
                                email: juror.email,
                                subject: jurySubject,
                                message: juryMessage,
                            });
                        }
                    }
                    break;
                }
                if(scheduled) break;
            }
            if(scheduled) break;
        }
        console.log(theme.themeId);
        if(!scheduled){
            NotScheduledDefenses.push(theme)
        }
    }

    res.status(200).json(NotScheduledDefenses);

} 

const generateOneDefenseManually = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    const user = await req.user;
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé : rôle admin requis' });
    }

    const { themeId, roomId, date, startTime, endTime } = req.body;

    const theme = await defenseSession.findOne({ themeId });
    if (!theme) return res.status(404).json({ message: "Thème introuvable" });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Salle introuvable" });

    const conflict = await defenseSession.findOne({
        roomId,
        date: new Date(date),
        $or: [
            {
                startTime: { $lt: endTime },
                endTime: { $gt: startTime }
            }
        ]
    });

    if (conflict) {
        return res.status(409).json({ message: "Salle occupée durant cette période" });
    }

    const participants = [theme.teacher, ...theme.jury];
    for (const participant of participants) {
        const availability = await JuryAvailability.findOne({ "teacher.id": participant.id });
        const isUnavailable = availability?.unavailable?.some(unav => {
            return (
                new Date(unav.date).toDateString() === new Date(date).toDateString() &&
                startTime < unav.endTime &&
                endTime > unav.startTime
            );
        });

        if (isUnavailable) {
            return res.status(409).json({ message: `Le participant ${participant.name} est indisponible.` });
        }
    }

    // ✅ Update theme
    theme.roomId = room._id;
    theme.date = new Date(date);
    theme.startTime = startTime;
    theme.endTime = endTime;
    await theme.save();

    // ✅ Update availability for all participants
    const newUnavailability = {
        date: new Date(date),
        startTime,
        endTime
    };

    for (const participant of participants) {
        let availability = await JuryAvailability.findOne({ "teacher.id": participant.id });
        if (!availability) {
            availability = new JuryAvailability({
                teacher: {
                    id: participant.id,
                    name: participant.name,
                    email: participant.email
                },
                unavailable: [newUnavailability]
            });
        } else {
            availability.unavailable.push(newUnavailability);
        }
        await availability.save();
    }

    // ✅ Send emails
    const formattedDate = new Date(date).toLocaleDateString();
    const emailBody = `
        <p>Bonjour,</p>
        <p>Votre soutenance de PFE a été programmée :</p>
        <ul>
            <li><strong>Titre :</strong> ${theme.title}</li>
            <li><strong>Date :</strong> ${formattedDate}</li>
            <li><strong>Heure :</strong> de ${startTime} à ${endTime}</li>
            <li><strong>Salle :</strong> ${room.name}</li>
        </ul>
        <p>Merci de vous présenter à l'heure.</p>
        <p>— ESI-PFE</p>
    `;

    await sendEmail({ email: theme.student1.email, subject: "📅 Soutenance PFE programmée", message: emailBody });
    await sendEmail({ email: theme.student2.email, subject: "📅 Soutenance PFE programmée", message: emailBody });
    await sendEmail({ email: theme.teacher.email, subject: "🧑‍🏫 Soutenance de votre encadrement", message: emailBody });

    for (const juror of theme.jury) {
        await sendEmail({ email: juror.email, subject: "👨‍⚖️ Convocation à une soutenance", message: emailBody });
    }

    res.status(200).json({ message: "Soutenance programmée avec succès", theme });
};


const updateJury = async (req, res) => {

    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token manquant' });

    const user = await req.user;
    if (!user) return res.status(401).json({ message: 'Utilisateur non authentifié' });

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé : rôle admin requis' });
    }
    const { jury } = req.body; // tableau de { id, name, note }
    const defenseId = req.params.id;

    try {
        const defense = await defenseSession.findById(defenseId).populate('roomId');
        if (!defense) return res.status(404).json({ message: "Soutenance introuvable" });

        const { date, startTime, endTime } = defense;
        const existingJury = defense.jury;

        const unavailableJury = [];

        for (const newMember of jury) {
            const alreadyInJury = existingJury.find(j => j.id === newMember.id);
            // Ne pas revérifier s’il est déjà là et n’a pas changé
            if (alreadyInJury) continue;

            const availability = await JuryAvailability.findOne({ "teacher.id": newMember.id });

            if (availability) {
                const isUnavailable = availability.unavailable.some(unav => {
                    return (
                        new Date(unav.date).toDateString() === new Date(date).toDateString() &&
                        startTime < unav.endTime &&
                        endTime > unav.startTime
                    );
                });

                if (isUnavailable) {
                    unavailableJury.push(newMember.name);
                }
            }
        }

        if (unavailableJury.length > 0) {
            return res.status(400).json({
                message: "Certains membres du jury ne sont pas disponibles",
                unavailable: unavailableJury
            });
        }


        for(const participant of defense.jury ){
            const availability = await JuryAvailability.findOne({ "teacher.id": participant.id });
            const newUnavailability = {
                date: defense.date,
                startTime: defense.startTime,
                endTime: defense.endTime
            };
            availability.unavailable.pop(newUnavailability);
            await availability.save();
        }

        // Mise à jour du jury
        defense.jury = jury;
        const jurySubject = "👨‍⚖️ Convocation à une soutenance PFE";
        const juryMessage = `
                        <p>Bonjour,</p>
                        <p>Vous êtes convoqué(e) en tant que membre du jury pour la soutenance suivante :</p>
                        <ul>
                            <li><strong>Titre du projet :</strong> ${defense.title}</li>
                            <li><strong>Date :</strong> ${new Date(defense.date).toLocaleDateString()}</li>
                            <li><strong>Heure :</strong> de ${defense.startTime} à ${defense.endTime}</li>
                            <li><strong>Salle :</strong> ${defense.roomId.name}</li>
                        </ul>
                        <p>Merci pour votre participation.</p>
                        <p>— ESI-PFE</p>
        `;
        for(const participant of jury ){
            const availability = await JuryAvailability.findOne({ "teacher.id": participant.id });
            const newUnavailability = {
                date: defense.date,
                startTime: defense.startTime,
                endTime: defense.endTime
            };
            if (!availability) {
                // 🔹 Créer un nouveau document si non existant
                const newAvailability = new JuryAvailability({
                    teacher: {
                        id: participant.id,
                        name: participant.name,
                        email:participant.email
                    },
                    unavailable: [newUnavailability]
                });
                await newAvailability.save();
            } else {
                // 🔹 Ajouter la plage si elle n’existe pas déjà
                const exists = availability.unavailable.some(unav =>
                    new Date(unav.date).toDateString() === new Date(defense.date).toDateString() &&
                    unav.startTime === defense.startTime &&
                    unav.endTime === defense.endTime
                );

                if (!exists) {
                    availability.unavailable.push(newUnavailability);
                    await availability.save();
                }
            }
            if (participant?.email) {
                await sendEmail({
                    email: participant.email,
                    subject: jurySubject,
                    message: juryMessage,
                });
            }
        }
        await defense.save();

        res.status(200).json({ message: "Jury mis à jour avec succès" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

const updateRoom = async (req, res) => {
    const { roomId } = req.body;
    const defenseId = req.params.id;

    try {
        const defense = await defenseSession.findById(defenseId);
        if (!defense) {
            return res.status(404).json({ message: 'Soutenance introuvable' });
        }

        const { date, startTime, endTime } = defense;

        // Vérifier conflit de salle
        const conflicts = await defenseSession.find({
            _id: { $ne: defenseId },
            roomId: roomId,
            date: date,
            $or: [
                {
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime }
                }
            ]
        });

        if (conflicts.length > 0) {
            return res.status(400).json({ message: "Salle déjà occupée à cet horaire" });
        }

        // Mise à jour
        defense.roomId = roomId;
        await defense.save();

        // Emails à envoyer
        const recipients = [
            defense.teacher,
            defense.student1,
            defense.student2,
            ...defense.jury
        ];

        const rm = await Room.findById(roomId);

        const message = `
            <p>Bonjour,</p>
            <p>La salle de votre soutenance prévue le <strong>${new Date(date).toLocaleDateString()}</strong> 
            de <strong>${startTime}</strong> à <strong>${endTime}</strong> a été mise à jour.</p>
            <p>Nouvelle salle ID : <strong>${rm.name}</strong></p>
            <p>Merci de prendre note du changement.</p>
            <p>— Équipe PFE ESI</p>
        `;

        // Envoi email à tous
        for (const person of recipients) {
            if (person?.email) {
                await sendEmail({
                    email: person.email,
                    subject: "📢 Changement de salle pour la soutenance",
                    message: message
                });
            }
        }

        res.status(200).json({ message: "Salle mise à jour et notifications envoyées" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const getAllDefensesWithRooms = async (req, res) => {
    try {
        // Find all defense sessions and populate the 'roomId' field with room data
        const defenses = await defenseSession.find().populate('roomId'); 

        res.status(200).json(defenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const getDefensesByStudent = async (req, res) => {
    const { studentId } = req.params; // Assuming you send student ID as a URL parameter

    try {
        // Find all defenses where the student is involved in either student1 or student2
        const defenses = await defenseSession.find({
            $or: [
                { 'student1.id': studentId },
                { 'student2.id': studentId }
            ]
        }).populate('roomId'); // Populate roomId to get room details

        // If no defenses found for this student
        if (defenses.length === 0) {
            return res.status(404).json({ message: "Aucune soutenance trouvée pour cet étudiant" });
        }

        res.status(200).json(defenses); // Return the found defenses
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const getDefensesByTeacherOrJury = async (req, res) => {
    const { teacherId } = req.params; // teacherId = the teacher's ID to search for

    try {
        const defenses = await defenseSession.find({
            $or: [
                { 'teacher.id': parseInt(teacherId) },
                { 'jury.id': parseInt(teacherId) } // Checks if teacher is in jury
            ]
        }).populate('roomId').sort({ date: 1 });

        if (defenses.length === 0) {
            return res.status(404).json({ message: "Aucune soutenance trouvée pour cet enseignant" });
        }

        res.status(200).json(defenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const updateDefenseTime = async (req, res) => {
    const {  date, startTime, endTime } = req.body;
    const themeId = req.params.id;

    const defense = await defenseSession.findOne({ themeId });
    if (!defense) {
        return res.status(404).json({ message: "Soutenance non trouvée" });
    }

    const roomId = defense.roomId;
    const newDate = new Date(date);

    // ✅ Check if room is available
    const roomConflict = await defenseSession.findOne({
        _id: { $ne: defense._id }, // exclude current defense
        roomId,
        date: newDate,
        $or: [
            {
                startTime: { $lt: endTime },
                endTime: { $gt: startTime }
            }
        ]
    });

    if (roomConflict) {
        return res.status(409).json({ message: "La salle est déjà réservée à cette heure." });
    }

    const participants = [defense.teacher, ...defense.jury];

    // ✅ Check jury availability
    for (const participant of participants) {
        const availability = await JuryAvailability.findOne({ "teacher.id": participant.id });
        const isUnavailable = availability?.unavailable?.some(unav =>
            new Date(unav.date).toDateString() === newDate.toDateString() &&
            startTime < unav.endTime &&
            endTime > unav.startTime
        );
        if (isUnavailable) {
            return res.status(409).json({ message: `${participant.name} est indisponible à cette heure.` });
        }
    }

    const oldSlot ={date:defense.date,startTime:defense.startTime,endTime:defense.endTime};
    // ✅ Update defense time
    defense.date = newDate;
    defense.startTime = startTime;
    defense.endTime = endTime;
    await defense.save();

    // ✅ Update jury unavailability
    const newSlot = { date: newDate, startTime, endTime };

    for (const participant of participants){
        let availability = await JuryAvailability.findOne({ "teacher.id": participant.id });
        availability.unavailable.pop(oldSlot);
        await availability.save();
    }
    for (const participant of participants) {
        let availability = await JuryAvailability.findOne({ "teacher.id": participant.id });
        if (!availability) {
            availability = new JuryAvailability({
                teacher: {
                    id: participant.id,
                    name: participant.name,
                    email: participant.email
                },
                unavailable: [newSlot]
            });
        } else {
            const exists = availability.unavailable.some(unav =>
                new Date(unav.date).toDateString() === newDate.toDateString() &&
                unav.startTime === startTime &&
                unav.endTime === endTime
            );
            if (!exists) {
                availability.unavailable.push(newSlot);
            }
        }
        await availability.save();
    }

    return res.status(200).json({ message: "Heure de soutenance mise à jour avec succès", defense });
};


const updateNote = async (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Accès refusé : rôle teacher requis' });
    }
    const userId = req.user.teacherId; // Assuming you're using authentication middleware
    const { note } = req.body;
    const themeId = req.params.id;

    const defense = await defenseSession.findOne({ themeId });
    if (!defense) {
        return res.status(404).json({ message: "Soutenance non trouvée" });
    }

    let updated = false;

    // 🧑‍🏫 Check if the user is the teacher
    if (defense.teacher.id === userId) {
        defense.teacher.note = note;
        updated = true;
    }

    // 🎓 Check if the user is one of the jury
    if(!updated){
        for (let juryMember of defense.jury) {
            if (juryMember.id === userId) {
                juryMember.note = note;
                updated = true;
                break;
            }
        }
    }

    if (!updated) {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à noter cette soutenance." });
    }
    const notes = [];

    if (typeof defense.teacher.note === 'number') {
        notes.push(defense.teacher.note);
    }

    for (let juryMember of defense.jury) {
        if (typeof juryMember.note === 'number') {
            notes.push(juryMember.note);
        }
    }

    if (notes.length > 0) {
        const sum = notes.reduce((acc, val) => acc + val, 0);
        defense.note = parseFloat((sum / notes.length).toFixed(2)); // arrondi à 2 décimales
    }

    await defense.save();
    return res.status(200).json({ message: "Note mise à jour avec succès", defense });
};

const updatePv = async (req, res) => {
    const user = req.user;
    const { pv } = req.body; // Assuming it's a string (e.g., URL or base64)
    const themeId = req.params.id;

    // Optional: Check role
    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé : rôle non autorisé' });
    }

    try {
        const defense = await defenseSession.findOne({ themeId });
        if (!defense) {
            return res.status(404).json({ message: "Soutenance non trouvée" });
        }

        defense.pv = pv; // Set new value
        await defense.save();

        return res.status(200).json({ message: "PV mis à jour avec succès", defense });
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

const getJuryByThemeId = async (req,res) => {
    const {themeId} =req.params;

    try {
        const defense = await defenseSession.findOne({ themeId: themeId }, { jury: 1, _id: 0 });

        // if (!defense) {
        //     return { message: "No defense found with this themeId." };
        // }

        return res.json(defense);
    } catch (error) {
        console.error("Error fetching jury:", error);
        throw error;
    }
};

module.exports = {
    addDefensePeriod,
    getDefensePeriod,
    createDefense,
    generatePeriodDefense ,
    updateJury,
    updateRoom,
    getAllDefensesWithRooms,
    getDefensesByStudent,
    getDefensesByTeacherOrJury,
    generateOneDefenseManually,
    updateDefenseTime,
    updateNote,
    updatePv,
    getJuryByThemeId
}