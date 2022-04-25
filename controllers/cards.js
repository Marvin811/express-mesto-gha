const Card = require('../models/card');

const ERROR_NOT_FOUND = 404;
const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERR = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERR).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.createCards = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Не корректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERR).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.deleteCards = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Не получилось поставить лайк' });
        return;
      }
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Не получилось поставить лайк' });
        return;
      }
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).then((card) => {
    if (!card) {
      res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
    }
    res.status(200).send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Не получилось поставить лайк' });
        return;
      }
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Что-то пошло не так' });
    });
};
