const router = require('express').Router();

const { createUser, login } = require('../controllers/users');
const cardRoutes = require('./cards');
const userRoutes = require('./users');

router.post('/signin', login);
router.post('/signup', createUser);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

module.exports = router;
