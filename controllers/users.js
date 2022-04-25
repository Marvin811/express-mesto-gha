/* eslint-disable consistent-return */
const User = require('../models/user');

const ERROR_NOT_FOUND = 404;
const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERR = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Нет таких пользователей' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getIdUsers = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Нет пользователя с таким id' });
      } else {
        res.status(INTERNAL_SERVER_ERR).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) return res.status(400).send({ message: 'Email или пароль введены не верно' });
  User.create({
    email, password, name, about, avatar,
  })
    .then(() => res.status(200).send({ message: `Пользователь ${email} успешно создан` }))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Такой пользователь уже существует' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
      }
      return res.status(INTERNAL_SERVER_ERR).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((users) => {
      if (users) {
        res.status(200).send(users);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'передан некорректный id' });
      }
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((users) => {
      if (users) {
        res.status(200).send(users);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'передан некорректный id' });
      }
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Что-то пошло не так' });
    });
};
