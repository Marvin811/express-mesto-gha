const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getIdUsers, updateUserInfo, updateAvatar, getCurrentUser,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getUsers);
// возвращает информацию о текущем пользователе
router.get('/me', getCurrentUser);
// возвращает пользователя по _id
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getIdUsers);
// обновляет профиль
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string.min(2).max(30).required(),
  }),
}), updateUserInfo);
// обновляет аватар
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().required()
      .regex(/https?:\/\/(www.)?[\w\-.~:/?#[\]@!$&'()*+,;=]{1,256}\.[a-z0-9]{2,6}\b([-\w()@:%.+~#=//?&]*)/),
  }),
}), updateAvatar);

module.exports = router;
