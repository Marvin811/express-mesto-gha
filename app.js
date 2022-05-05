const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleError } = require('./errors/handleError');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(requestLogger); // подключаем логгер запросов

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use((err, req, res, next) => handleError({ res, err, next }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Cсылка на сервер ${PORT}`);
});
