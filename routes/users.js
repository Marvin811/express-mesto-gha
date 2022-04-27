const router = require('express').Router();
const {
  getUsers, getIdUsers, updateUserInfo, updateAvatar, getCurrentUser,
} = require('../controllers/users');
// возвращает всех пользователей
router.get('/', getUsers);
// возвращает пользователя по _id
router.get('/:id', getIdUsers);
// возвращает информацию о текущем пользователе
router.get('/me', getCurrentUser);
// обновляет профиль
router.patch('/me', updateUserInfo);
// обновляет аватар
router.patch('/me/avatar', updateAvatar);

module.exports = router;
