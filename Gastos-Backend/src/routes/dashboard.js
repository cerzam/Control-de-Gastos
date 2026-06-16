const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const { getDashboard } = require('../controllers/dashboardController');

router.use(auth);

router.get('/', getDashboard);

module.exports = router;
