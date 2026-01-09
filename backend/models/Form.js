const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    required: { type: Boolean, default: false },
    meta: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    conditional: {
        enabled: { type: Boolean, default: false },
        rules: [{
            id: String,
            operator: { type: String, enum: ['gt', 'lt', 'gte', 'lte', 'eq', 'neq'] },
            value: String,
            // We store follow-up questions nested here as per the user's request structure
            // However, for simplicity and queryability, we might just store IDs or a simplified structure.
            // But let's stick to a flexible structure for now.
            followUpQuestions: []
        }]
    }
}, { _id: false }); // We use 'id' from the frontend as the identifier

const FormSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, default: 'Untitled Form' },
    description: { type: String },
    questions: [QuestionSchema],
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Form', FormSchema);
