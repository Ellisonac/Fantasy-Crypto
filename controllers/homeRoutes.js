const {
  Challenge,
  Challenge_Coin_Data,
  Coin,
  Portfolio,
  Portfolio_Coin_Entry,
} = require("../models");

const router = require("express").Router();

router.get("/challenge", async (req, res) => {
  try {
    const challengeData = await Challenge.findAll();

    const challenges = challengeData.map((challenge) =>
      challenge.get({ plain: true })
    );

    res.render("all_challenges", {
      challenges,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/challenge/:id", async (req, res) => {
  try {
    const challengeData = await Challenge.findByPk(req.params.id, {
      include: [
        {
          model: Challenge_Coin_Data,
        },
      ],
    });

    const challenge = challengeData.get({ plain: true });

    const coinData = await Coin.findAll();

    const coins = coinData.map((coin) => coin.get({ plain: true }));

    res.render("challenge_form", {
      challenge,
      coins,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get an individual portfolio,
// TODO check if user is correct user

// May move functionality to /challenge/:id
// User may want to see current portfolio + challenge info
router.get("/portfolio/:id", async (req, res) => {
  try {
    const portfolioData = await Portfolio.findByPk(req.params.id, {
      include: [
        {
          model: Portfolio_Coin_Entry,
        },
      ],
    });

    const portfolio = portfolioData.get({ plain: true });

    if (portfolio.user_id != req.session.user_id) {
      console.log("INVALID USER");
    }

    const portfolioEntries = portfolio.portfolio_coin_entries;

    const coinEntryData = await Challenge_Coin_Data.findAll({
      where: {
        challenge_id: portfolioData.challenge_id,
      },
    });

    const coinEntries = coinEntryData.map((coin) => coin.get({ plain: true }));

    const coinData = await Coin.findAll();

    const coinLookup = coinData.map((coin) => coin.get({ plain: true }));

    // Build coins database
    let coins = [];
    for (const entry of portfolioEntries) {
      const amount = parseInt(entry.amount);
      const coinValues = coinEntries.filter(
        (coin) => coin.coin_id == entry.coin_id
      )[0];
      const value = amount * parseFloat(coinValues.start_value);
      const coin_name = coinLookup[entry.coin_id - 1].name;
      coins.push({
        id: coinLookup[entry.coin_id - 1].id,
        name: coin_name,
        amount,
        value,
      });
    }

    res.render("portfolio", {
      portfolio: portfolio,
      coinEntries: coins,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
