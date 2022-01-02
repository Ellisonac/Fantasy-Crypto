const { render } = require("express/lib/response");
const {
  Challenge,
  Challenge_Coin_Data,
  Coin,
  Portfolio,
  Portfolio_Coin_Entry,
  User,
} = require("../models");
const { evaluatePortfolio, getCoinValues } = require("../utils/calculations");

const router = require("express").Router();

router.get("/", async (req, res) => {
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
        {
          model: Challenge,
          include: [{
            model: Challenge_Coin_Data,
            include: [{
              model: Coin
            }]
          }]
        }
      ],
    });

    const portfolio = portfolioData.get({ plain: true });

    if (portfolio.user_id != req.session.user_id) {
      console.log("INVALID USER");
    }

    const portfolioEntries = portfolio.portfolio_coin_entries;

    const coinEntries = portfolio.challenge.challenge_coin_data;

    const coins = evaluatePortfolio(portfolioEntries,coinEntries);

    res.render("portfolio", {
      portfolio: portfolio,
      coinEntries: coins.values,
      startValue: coins.startValue,
      currentValue: coins.currentValue
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/profile/', async (req,res) => {
  try {

    // TEST ONLY
    if (!req.session.user_id) {
      req.session.user_id = 3;
    }


    const userData = await User.findByPk(req.session.user_id, {
      include: [
        {
          model: Portfolio
        }
      ]
    });

    const user = userData.get({ plain: true })

    console.log(user);

    res.render("profile",{
      user,
      portfolios: user.portfolios
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

router.get("/leaderboard", async (req,res) => {
  try {
    const challengeData = await Challenge.findAll({
      include: [
        {
          model: Portfolio,
          include: {
            model: Portfolio_Coin_Entry
          }
        },
        {
          model: Challenge_Coin_Data,
          include: {
            model: Coin
          }
        },
      ]
    });

    const challenges = challengeData.map(challenge => challenge.get({ plain: true }));

    let closedChallenges = [];
    for (const challenge of challenges) {
      if (challenge.status !== 'Ended' || !challenge.portfolios) {
        continue
      }

      // const coinValues = getCoinValues(challenge.challenge_coin_data)

      challenge.maxGain = -10000;
      for (const portfolio of challenge.portfolios) {
        const evaluation = evaluatePortfolio(portfolio.portfolio_coin_entries, challenge.challenge_coin_data);

        if (evaluation.gain > challenge.maxGain) {
          challenge.maxGain = evaluation.gain;
          challenge.topPortfolio = portfolio
        }
      }

      closedChallenges.push(challenge);
    }

    res.render("leaderboard",{
      challenges: closedChallenges
    })

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

module.exports = router;
