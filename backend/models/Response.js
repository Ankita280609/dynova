const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    answers: [{
        questionId: { type: String, required: true },
        value: { type: mongoose.Schema.Types.Mixed } // Can be string, number, array, etc.
    }],
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', ResponseSchema);
