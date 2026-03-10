const express = require('express');
const { loadConfig } = require('./config/env');

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'omni-voice-ai' });
});

if (require.main === module) {
  const { port } = loadConfig();
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`OmniVoice AI server is running on port ${port}`);
  });
}

module.exports = app;
