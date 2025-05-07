function generateTimeSlots(startDate, endDate) {
  const slots = [];
  const dayMs = 24 * 60 * 60 * 1000;
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let date = new Date(start); date <= end; date = new Date(date.getTime() + dayMs)) {
    slots.push({
      date: new Date(date),
      slots: [
        { startTime: "08:00", endTime: "10:00" },
        { startTime: "10:00", endTime: "12:00" },
        { startTime: "13:00", endTime: "15:00" },
        { startTime: "15:00", endTime: "17:00" }
      ]
    });
  }

  return slots;
}

module.exports ={
    generateTimeSlots
}
