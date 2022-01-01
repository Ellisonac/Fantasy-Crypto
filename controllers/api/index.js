const router = require('express').Router();
const userRoutes = require('./userRoutes');
const challengeRoutes = require('./challengeRoutes');
const portfolioRoutes = require('./portfolioRoutes');

router.use('/users', userRoutes);
router.use('/challenges', challengeRoutes);
router.use('/portfolio', portfolioRoutes);

module.exports = router;
