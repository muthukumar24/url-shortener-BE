const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

router.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'smuthukumar2443@gmail.com',
    pass: 'btiyawjbmmgyhdvj'
  }
});

// Register a new user
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }
  
      const activationToken = jwt.sign({ email }, 'secret', { expiresIn: '1d' });
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ firstName, lastName, email, password: hashedPassword, activationToken });
  
      await newUser.save();
  
      const url = `http://localhost:5173/activate/${activationToken}`;
      transporter.sendMail({
        to: email,
        subject: 'Activate your account',
        html: `Click <a href="${url}">here</a> to activate your account.`
      });
  
      res.status(201).json({ message: 'User registered. Please check your email to activate your account.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong.' });
    }
  });
  
  // Activate User Account
  router.get('/activate/:token', async (req, res) => {
    const { token } = req.params;
  
    try {
      // console.log('Received token:', token);
      const decoded = jwt.verify(token, 'secret');
      // console.log('Decoded token:', decoded);
      const user = await User.findOne({ email: decoded.email });
  
      if (!user || user.activationToken !== token) {
        return res.status(400).json({ message: 'Invalid token.' });
      }
  
      if (user.isActive) {
        return res.status(200).json({ message: 'Account is already activated.' });
      }
  
      user.isActive = true;
      user.activationToken = undefined;
  
      await user.save();
      res.status(200).json({ message: 'Account activated successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong.' });
    }
  });

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    // console.log(isPasswordCorrect);
    // console.log(password);
    // console.log(user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    const token = jwt.sign({ email: user.email }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ token, firstName: user.firstName, lastName: user.lastName });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});



// Forgot password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const resetToken = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
    user.resetToken = resetToken;

    await user.save();

    const url = `http://localhost:5173/reset-password/${resetToken}`;
    transporter.sendMail({
      to: email,
      subject: 'Reset your password',
      html: `Click <a href="${url}">here</a> to reset your password.`
    });

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, 'secret');
    const user = await User.findOne({ _id: decoded.id, resetToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token.' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;

    await user.save();
    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

module.exports = router;
