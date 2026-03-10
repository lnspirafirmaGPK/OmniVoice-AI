const { handleCallSession } = require('../services/voiceAgent');

async function handleWebhook(req, res) {
  const result = await handleCallSession(req.body);
  res.status(200).json(result);
}

module.exports = {
  handleWebhook
};
