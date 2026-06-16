const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const {
  getPerfil,
  updatePerfil,
  getPresupuesto,
  updatePresupuesto,
} = require('../controllers/configuracionController');

router.use(auth);

router.get('/perfil', getPerfil);
router.put('/perfil', updatePerfil);
router.get('/presupuesto', getPresupuesto);
router.put('/presupuesto', updatePresupuesto);

module.exports = router;
