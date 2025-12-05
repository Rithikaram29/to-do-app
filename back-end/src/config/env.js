const dotenv = require('dotenv');

dotenv.config();

const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // add your API keys later, e.g.
  // OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};

module.exports = { env };