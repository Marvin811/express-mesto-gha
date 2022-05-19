require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const allowedCors = [
  'localhost:3000',
  'http://localhost:3000',
  'https://marvin.nomoredomains.xyz',
  'http://marvin.nomoredomains.xyz',
];
const { handleError } = require('./errors/handleError');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
  return null;
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use((err, req, res, next) => handleError({ res, err, next }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Cсылка на сервер ${PORT}`);
});
