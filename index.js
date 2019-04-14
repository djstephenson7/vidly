const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const config = require('config');
const genres = require('./app/routes/genres');
const customers = require('./app/routes/customers');
const movies = require('./app/routes/movies');
const rentals = require('./app/routes/rentals');
const users = require('./app/routes/users');
const auth = require('./app/routes/auth');

const app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL: jwtPrivateKey is not defined');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
  .then(() => console.log('Connecting to MongoDB...'))
  .catch(() => console.log('Could not connect to MongoDB!'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
