const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  title      : { type: String, required: true },
  text       : { type: String, required: true },
  userId     : { type: mongoose.Schema.Types.ObjectId, required: true },
  date       : { type: Date, default: Date.now },
  lastUpdate : { type: Date, default: Date.now },
  status     : { type: String, enum: ['draft', 'pending', 'published' ], default: 'draft' },
});

const questionModel = mongoose.model('Question', questionSchema);

module.exports = { questionModel };
