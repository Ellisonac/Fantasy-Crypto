const { Challenge, Challenge_Coin_Data, Coin } = require('../models');

const router = require('express').Router();

router.get('/challenge/:id', async (req, res) => {
  try {
    const challengeData = await Challenge.findByPk(req.params.id, {
      include: [
        {
          model: Challenge_Coin_Data
        }
      ]
    });

    const challenge = challengeData.get({ plain: true });

    const coinData = await Coin.findAll();

    const coins = coinData.map((coin) =>
      coin.get({ plain: true })
    );

    res.render("challenge_form", {
      challenge,
      coins
    })



  } catch (err) {
    console.log(err);
    res.status(500).json(err)
  }
});

module.exports = router;