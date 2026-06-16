const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const { getGastos, createGasto, updateGasto, deleteGasto } = require('../controllers/gastosController');

router.use(auth);

router.get('/', getGastos);
router.post('/', createGasto);
router.put('/:id', updateGasto);
router.delete('/:id', deleteGasto);

module.exports = router;
