/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SALT_ROUNDS = 10;
const { NotFoundError } = require('../errors/notFoundError');
const { ValidationError } = require('../errors/validationError');

// module.exports.getUsers = (_req, res) => {
// User.find({})
// .then((user) => res.status(200).send({ data: user }))
// .catch((err) => {
//  if (err.name === 'CastError') {
//   res.status(400).send({ message: 'Нет таких пользователей' });
// } else {
//  res.status(500).send({ message: 'Произошла ошибка' });
// }
// });
// };

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

//  module.exports.getIdUsers = (req, res, next) => {
//   User.findById(req.params.id)
//     .then((user) => {
//      if (!user) {
//       res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
//   }
//  res.status(200).send({ data: user });
//  })
//  .catch((err) => {
//    if (err.name === 'CastError') {
//      res.status(400).send({ message: 'Нет пользователя с таким id' });
//   } else {
//     res.status(500).send({ message: 'Что-то пошло не так' });
//       }
//    });
//  };

module.exports.getIdUsers = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(NotFoundError).send({ message: 'Пользователь с указанным _id не найден' });
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.findCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send({ date: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Нет пользователя с таким id' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) return res.status(400).send({ message: 'Email или пароль введены не верно' });
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      email, name, about, avatar, password: hash,
    }))
    .then(() => res.status(200).send({ message: `Пользователь ${email} успешно создан` }))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Такой пользователь уже существует' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', {
          expiresIn: '7d',
        }),
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
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
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'передан некорректный id' });
      }
      res.status(500).send({ message: 'Что-то пошло не так' });
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
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'передан некорректный id' });
      }
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};
