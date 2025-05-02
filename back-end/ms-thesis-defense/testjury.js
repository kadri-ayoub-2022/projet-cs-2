const mongoose = require("mongoose");
const Defense = require("./models/defenseSession");
const connectDB = require('./db/db'); // chemin vers ton modèle
connectDB(); // remplace par ton URL MongoDB

const teachers = [
  { id: 1, name: "Pr. A", email: "kadriayoub122@gmail.com" },
  { id: 2, name: "Pr. B", email: "b@esi-sba.dz" },
  { id: 3, name: "Pr. C", email: "c@esi-sba.dz" },
  { id: 4, name: "Pr. D", email: "d@esi-sba.dz" },
  { id: 5, name: "Pr. E", email: "e@esi-sba.dz" },
  { id: 6, name: "Pr. F", email: "f@esi-sba.dz" },
  { id: 7, name: "Pr. G", email: "g@esi-sba.dz" },
  { id: 8, name: "Pr. H", email: "h@esi-sba.dz" }
];

const students = [
  { id: 100, name: "Ayyoub", email: "ay.kadri@esi-sba.dz" },
  { id: 101, name: "Sara", email: "sara@esii-sba.dz" },
  { id: 102, name: "Karim", email: "karim@esii-sba.dz" },
  { id: 103, name: "Lina", email: "lina@esii-sba.dz" },
  { id: 104, name: "Nabil", email: "nabil@esii-sba.dz" },
  { id: 105, name: "Yasmine", email: "yasmine@esii-sba.dz" },
  { id: 106, name: "Amine", email: "amine@esii-sba.dz" },
  { id: 107, name: "Nour", email: "nour@esii-sba.dz" }
];


const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function insertDefenses() {
  const defenses = [];

  for (let i = 0; i < 20; i++) {
    const teacher = getRandom(teachers);

    // S'assurer que student1 != student2
    let student1 = getRandom(students);
    let student2;
    do {
      student2 = getRandom(students);
    } while (student2.id === student1.id);

    // Choix aléatoire de 2 membres de jury (différents du teacher)
    const juryMembers = teachers
      .filter(t => t.id !== teacher.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const defense = {
      themeId: i + 1,
      title:"fjfsj qf",
      teacher: { ...teacher, note: null },
      student1: student1,
      student2: student2,
      jury: juryMembers.map(j => ({ ...j, note: null })),
      roomId: null,
      date: null,
      startTime: null,
      endTime: null,
      note: null
    };

    defenses.push(defense);
  }

  await Defense.insertMany(defenses);
  console.log("✅ 20 defenses insérées avec succès.");
  mongoose.disconnect();
}

insertDefenses().catch(console.error);











 