const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const { User } = require('../models/userModel');

const router = express();

router.use(express.json());

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = jwt.sign({ _id: user._id }, 'jwtPrivateKey');
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(250).required()
      .email(),
    password: Joi.string().min(5).max(1000).required(),
  };
  return Joi.validate(req, schema);
}

module.exports = router;
