/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const { resCheck } = require('../errors/researchCheck');
const ConflictError = require('../errors/ConflictError');

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
    .then((data) => resCheck(data))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные id пользователя'));
      } if (err.statusCode === 404 || err.name === 'NotFoundError') {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        next(err);
      }
    });
};

// module.exports.getCurrentUser = (req, res) => {
//  User.findById(req.user._id)
//   .then((user) => {
//     res.status(200).send({ date: user });
//  })
//  .catch((err) => {
//    if (err.name === 'CastError') {
//     res.status(400).send({ message: 'Нет пользователя с таким id' });
//      } else {
//        res.status(500).send({ message: 'Что-то пошло не так' });
//      }
//    });
// };

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((data) => resCheck(data))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные id пользователя'));
      } if (err.statusCode === 404 || err.name === 'NotFoundError') {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email или пароль введены не верно');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, name, about, avatar, password: hash,
    }))
    .then(() => res.send({ message: `Пользователь ${email} успешно создан` }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
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

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((data) => resCheck(data))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные id пользователя'));
      } if (err.statusCode === 404 || err.name === 'NotFoundError') {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((data) => resCheck(data))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные id пользователя'));
      } if (err.statusCode === 404 || err.name === 'NotFoundError') {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        next(err);
      }
    });
};
