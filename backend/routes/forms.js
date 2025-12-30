const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const Response = require('../models/Response');
const User = require('../models/User'); // Needed for bookmarks
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to protect all form routes (or optional for viewers?)
// For now, let's protect dashboard routes. Viewer routes (GET /:id) might need to be public or handled separately.
// The user said "actual users to login... lead to profile".
// Viewer page is public usually. But the Dashboard operations are protected.

// GET /api/forms - List MY forms
router.get('/', authMiddleware, async (req, res) => {
    try {
        const forms = await Form.find({ owner: req.user.id }).sort({ createdAt: -1 });
        const formsWithCounts = await Promise.all(forms.map(async (form) => {
            const count = await Response.countDocuments({ formId: form._id });
            return { ...form.toObject(), _count: { responses: count } };
        }));
        res.json(formsWithCounts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/forms/bookmarked - List Bookmarked forms
router.get('/bookmarked', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('bookmarks');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Calculate counts for bookmarked forms
        const formsWithCounts = await Promise.all(user.bookmarks.map(async (form) => {
            // Check if form still exists (populate might return null if deleted?)
            // Mongoose populate usually returns null if ref missing? 
            if (!form) return null;
            const count = await Response.countDocuments({ formId: form._id });
            return { ...form.toObject(), _count: { responses: count } };
        }));

        res.json(formsWithCounts.filter(f => f !== null));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/forms - Create a new form
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, questions } = req.body;
        const newForm = new Form({
            owner: req.user.id,
            title,
            description,
            questions
        });
        const savedForm = await newForm.save();
        res.json(savedForm);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create form' });
    }
});

// POST /api/forms/:id/bookmark - Toggle Bookmark
router.post('/:id/bookmark', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const formId = req.params.id;

        // Check if already bookmarked
        const index = user.bookmarks.indexOf(formId);
        if (index === -1) {
            user.bookmarks.push(formId);
        } else {
            user.bookmarks.splice(index, 1);
        }
        await user.save();
        res.json({ success: true, bookmarks: user.bookmarks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to toggle bookmark' });
    }
});

// GET /api/forms/:id - Get a specific form (Public for viewing? Or protected?)
// Usually public for respondents, but maybe protected for editing.
// Let's keep it public for now to avoid breaking Viewer, but we might need a separate endpoint for "Editor View" vs "Respondent View".
// For simplicity, public GET is fine, but editing (PUT) must be protected.
router.get('/:id', async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ error: 'Form not found' });
        res.json(form);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/forms/:id - Update a form
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, questions } = req.body;
        // Verify ownership
        const formCheck = await Form.findById(req.params.id);
        if (!formCheck) return res.status(404).json({ error: 'Form not found' });
        if (formCheck.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const form = await Form.findByIdAndUpdate(
            req.params.id,
            { title, description, questions, updatedAt: Date.now() },
            { new: true }
        );
        res.json(form);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update form' });
    }
});

// DELETE /api/forms/:id - Delete a form
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const formCheck = await Form.findById(req.params.id);
        if (!formCheck) return res.status(404).json({ error: 'Form not found' });
        if (formCheck.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await Form.findByIdAndDelete(req.params.id);
        // Also delete associated responses
        await Response.deleteMany({ formId: req.params.id });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete form' });
    }
});

// POST /api/forms/:id/submit - Submit a response (Public)
router.post('/:id/submit', async (req, res) => {
    try {
        const { answers } = req.body;
        const response = new Response({
            formId: req.params.id,
            answers
        });
        const savedResponse = await response.save();
        res.json(savedResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit response' });
    }
});

// GET /api/forms/:id/responses - Get responses for a form (Protected)
router.get('/:id/responses', authMiddleware, async (req, res) => {
    try {
        const formCheck = await Form.findById(req.params.id);
        if (!formCheck) return res.status(404).json({ error: 'Form not found' });
        if (formCheck.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const responses = await Response.find({ formId: req.params.id }).sort({ submittedAt: -1 });
        res.json(responses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch responses' });
    }
});

module.exports = router;
