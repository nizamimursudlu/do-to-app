const express = require('express');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json({ extended: true }));

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/todo', require('./routes/todo.route'));
app.use('/api/users', require('./routes/user.route'));

async function start() {
  try {
    await mongoose.connect(
      'mongodb+srv://nizami-to-do-app:EjKNpRopnvBeRzU1@cluster0.wy4db.mongodb.net/to-do-app?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}
start();
