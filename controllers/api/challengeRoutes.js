const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    // Get all challenges
    const challengeData = await Challenge.findAll({
      // include: [
      //   {
      //     model: Challenge,
      //   },
      // ],
    });

    // Serialize data so the template can read it
    const challenges = userData.map((challenge) => challenge.get({ plain: true }));

    // Flag challenges based on status (Open, Closed, Ended)

    // Pass serialized data and session flag into template
    res.render('allChallenges', { 
      challenges, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Get challenge by ID
    const challengeData = await Challenge.findByPk({
      // include: [
      //   {
      //     model: Challenge,
      //   },
      // ],
    });

    // Serialize data so the template can read it
    const challenge = challengeData.get({ plain: true });

    // Flag challenges based on status (Open, Closed, Ended)

    // Pass serialized data and session flag into template
    res.render('challenge', { 
      challenge, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});