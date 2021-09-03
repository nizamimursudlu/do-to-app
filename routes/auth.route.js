const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

router.post(
  '/registration',
  [
    check('email', 'False Email').isEmail(),
    check('password', 'Wrong Password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Wrong data during registration',
        });
      }

      const { email, password } = req.body;

      const isUsed = await User.findOne({ email });
      if (isUsed) {
        return res
          .status(300)
          .json({ message: 'This Email already has an account.' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        password: hashedPassword,
      });
      await user.save();
      res.status(201).json({ message: 'User created' });
    } catch (err) {
      console.log(err);
    }
  },
);

router.post(
  '/login',
  [
    check('email', 'False Email').isEmail(),
    check('password', 'Wrong Password').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Wrong data during registration',
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'This email has no account' });
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        throw new Error('Invalid password');
      }

      const jwtSecret =
        '$2b$12$iljjpi2ht6mcFMgRcuIviuMsfqhdB2Owtg2VhQ3u7bG.JjiUH.xka';
      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: '1h',
      });

      res.json({ token, userId: user.id });
    } catch (err) {
      console.log(err);
    }
  },
);

module.exports = router;
