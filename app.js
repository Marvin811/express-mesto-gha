const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { errors } = require('celebrate');
const router = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError');
const handleError = require('./errors/handleError');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);
app.use((req, res, next) => next(new NotFoundError('Ошибка: данный ресурс не найден.')));
app.use(errors());

app.use((err, res, req, next) => handleError({ res, err, next }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Cсылка на сервер ${PORT}`);
});
