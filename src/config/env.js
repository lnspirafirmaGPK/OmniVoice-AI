function loadConfig() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 3000)
  };
}

module.exports = {
  loadConfig
};
