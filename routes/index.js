const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const cardRoutes = require('./cards');
const userRoutes = require('./users');
const { auth } = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/, 'URL'),
  }),
}), createUser);

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

module.exports = router;
