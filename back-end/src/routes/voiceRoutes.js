const express = require('express');
const { z } = require('zod');
// const { validateBody } = require('../middleware/validateRequesst.js');
const { parseVoiceHandler } = require('../controllers/voiceController');

const router = express.Router();

const parseSchema = z.object({
  parserId: z.enum(['local_rules', 'openai', 'gemini']),
  transcript: z.string().min(1),
});

router.post('/parse', parseVoiceHandler);

module.exports = router;