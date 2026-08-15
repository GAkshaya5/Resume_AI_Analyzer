const express = require('express');
const router = express.Router();
const { analyzeResume, getHistory } = require('../controllers/resumeController');
const upload = require('../middleware/uploadMiddleware');

router.post('/analyze', upload.single('resume'), analyzeResume);
router.get('/history', getHistory);

module.exports = router;