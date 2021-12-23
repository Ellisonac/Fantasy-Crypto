const { Challenge, Portfolio, Challenge_Coin_Data } = require("../../models");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    // Get all challenges
    const challengeData = await Challenge.findAll();

    // Serialize data so the template can read it
    const challenges = challengeData.map((challenge) =>
      challenge.get({ plain: true })
    );

    // Flag challenges based on status (Open, Closed, Ended)

    // Pass serialized data and session flag into template
    // res.render('allChallenges', {
    //   challenges,
    //   logged_in: req.session.logged_in
    // });
    res.status(200).json(challenges);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Get challenge by ID
    const challengeData = await Challenge.findByPk(req.params.id, {
      include: [
        {
          model: Portfolio,
        },
        {
          model: Challenge_Coin_Data,
        },
      ],
    });

    // Serialize data so the template can read it
    const challenge = challengeData.get({ plain: true });

    // Flag challenges based on status (Open, Closed, Ended)

    // Pass serialized data and session flag into template
    // res.render('challenge', {
    //   challenge,
    //   logged_in: req.session.logged_in
    // });
    res.status(200).json(challenge);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    // Create challenge by post
    const challenge = await Challenge.create({
      ...req.body
    });

    // Flag challenges based on status (Open, Closed, Ended)

    // Pass serialized data and session flag into template
    // res.render('challenge', {
    //   challenge,
    //   logged_in: req.session.logged_in
    // });
    res.status(200).json(challenge);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
