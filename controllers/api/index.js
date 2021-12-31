const router = require('express').Router();
const userRoutes = require('./userRoutes');
const challengeRoutes = require('./challengeRoutes');

router.use('/users', userRoutes);
router.use('/challenges', challengeRoutes);

module.exports = router;
