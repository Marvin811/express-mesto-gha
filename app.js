const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cardRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6258126030a5f4c1433895da', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use((req, res) => {
  res.status(404).send({ message: 'Ошибка: данный ресурс не найден.' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Ссылка на сервер');
});
