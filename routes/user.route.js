const { Router } = require('express');
const router = Router();

const User = require('../models/User');

router.get('/users', async (req, res) => {
  try {
    const todo = await User.find();
    res.json(todo);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
