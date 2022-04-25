const router = require('express').Router();
const {
  getCards, deleteCards, createCards, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', deleteCards);
router.post('/', createCards);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
