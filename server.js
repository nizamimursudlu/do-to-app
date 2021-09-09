const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json({ extended: true }));

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/todo', require('./routes/todo.route'));
app.use('/api/users', require('./routes/user.route'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

async function start() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}
start();
