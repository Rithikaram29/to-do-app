const { parseTranscript } = require('../services/parserService');

async function parseVoiceHandler(req, res, next) {
  try {
    const { parserId, transcript } = req.body;
    const result = await parseTranscript(parserId, transcript);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  parseVoiceHandler,
};