const router = require('express').Router();
const {
  getUsers, getIdUsers, createUsers, updateUserInfo, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getIdUsers);
router.post('/', createUsers);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
