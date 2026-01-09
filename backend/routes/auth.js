const express = require('express');
const router = express.Router();
const { signup, signin, getMe, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

module.exports = router;
