const Card = require('../models/card');

const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const { resCheck } = require('../errors/researchCheck');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Не корректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCards = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((data) => resCheck(data))
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        throw new ForbiddenError('Попытка удалить чужую карточку');
      }
      return card;
    })
    .then((card) => Card.findByIdAndRemove(card._id.toString())
      .then((data) => res.send({ data })))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else if (err.statusCode === 404 || err.name === 'NotFoundError') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((data) => resCheck(data))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Не получилось поставить лайк'));
      } else if (err.statusCode === 404 || err.name === 'NotFoundError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).then((data) => resCheck(data))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Не получилось поставить лайк'));
      } else if (err.statusCode === 404 || err.name === 'NotFoundError') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};
