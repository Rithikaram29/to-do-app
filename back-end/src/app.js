const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const tasksRoutes = require('./routes/tasksRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
const parsersRoutes = require('./routes/parsersRoutes');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', // your Vite frontend
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'voice-task-tracker-backend' });
});

app.use('/api/tasks', tasksRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/parsers', parsersRoutes);

// error handler should be last
app.use(errorHandler);

module.exports = app;