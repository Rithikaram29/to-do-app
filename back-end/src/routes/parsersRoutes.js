const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const parsers = [
    {
      id: 'local_rules',
      label: 'Local Rules',
      description: 'Heuristic parser implemented on the backend.',
      isRemote: false,
    },
    {
      id: 'openai',
      label: 'OpenAI LLM',
      description: 'Cloud AI parser using OpenAI (coming soon).',
      isRemote: true,
    },
    {
      id: 'gemini',
      label: 'Gemini LLM',
      description: 'Cloud AI parser using Gemini (coming soon).',
      isRemote: true,
    },
  ];

  res.json(parsers);
});

module.exports = router;