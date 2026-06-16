const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const { getCategorias, createCategoria, deleteCategoria } = require('../controllers/categoriasController');

router.use(auth);

router.get('/', getCategorias);
router.post('/', createCategoria);
router.delete('/:id', deleteCategoria);

module.exports = router;
