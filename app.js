const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const auth = require('./middlewares/auth');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(auth);
app.use(router);
app.use((req, res) => {
  res.status(404).send({ message: 'Ошибка: данный ресурс не найден.' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Cсылка на сервер ${PORT}`);
});
