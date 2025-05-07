const mongoose = require('mongoose');
const defensePeriodSchema = new mongoose.Schema({
  start: {
    type: Date,
    required: true,
    set: (val) => new Date(val.toISOString().split('T')[0]) // Keep only YYYY-MM-DD
  },
  end: {
    type: Date,
    required: true,
    set: (val) => new Date(val.toISOString().split('T')[0]) // Keep only YYYY-MM-DD
  }
});

module.exports = mongoose.model('DefensePeriod', defensePeriodSchema);
