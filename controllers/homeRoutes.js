const {
  Challenge,
  Challenge_Coin_Data,
  Coin,
  Portfolio,
  Portfolio_Coin_Entry,
  User,
} = require("../models");
const { evaluatePortfolio, getCoinValues, getHistoricCoinValues } = require("../utils/calculations");

const router = require("express").Router();

image_urls = [
  "/assets/bitcoin.jpeg",
  "/assets/binance.jpg",
  "/assets/cardano.jpg",
  "/assets/doge.webp",
  "/assets/eth.jpg",
  "/assets/solana.jpg",
  "/assets/tether.jpg",
  "/assets/xrp.jpg",
];

// Main dashboard get route
router.get("/", async (req, res) => {
  try {
    let logged_in = req.session.logged_in;

    // Get and serialize all challenges
    let challengeData = await Challenge.findAll();

    let challenges = challengeData.map((challenge) =>
      challenge.get({ plain: true })
    );

    // Assign image_urls to each challenge
    for (let ii = 0; ii < challenges.length; ii++) {
      // Cyclic image style
      challenges[ii].image_url = image_urls[ii % image_urls.length];

      // Random image style
      // challenges[ii].image_url = image_urls[Math.floor(Math.random()*image_urls.length)];
    }

    res.render("all_challenges", { data: challenges, logged_in });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/challenge/:id", async (req, res) => {
  try {
    // Get current challenge and coin values
    const challengeData = await Challenge.findByPk(req.params.id, {
      include: [
        {
          model: Challenge_Coin_Data,
          include: {
            model: Coin,
          },
        },
      ],
    });

    const challenge = challengeData.get({ plain: true });

    // If logged in find if the user has a submission
    let portfolioData = [];
    if (req.session.logged_in) {
      portfolioData = await Portfolio.findAll({
        where: {
          challenge_id: req.params.id,
          user_id: req.session.user_id,
        },
        include: {
          model: Portfolio_Coin_Entry,
          include: {
            model: Coin,
          },
        },
      });
    }

    // Get submission status and information for user
    let submission;
    let hasSubmission = false;
    if (portfolioData.length > 0) {
      console.log(portfolioData);
      submission = portfolioData[0].get({ plain: true });
      submission.coinEntries = submission.portfolio_coin_entries.map(
        (entry) => {
          return {
            ...entry,
            name: entry.coin.name,
            ticker_symbol: entry.coin.ticker_symbol,
          };
        }
      );
      hasSubmission = true;
      console.log(submission);
    }

    // Serialize and reorgainize coin entries for challenges
    let coinEntries = challenge.challenge_coin_data.map((coin) => {
      return {
        ...coin,
        name: coin.coin.name,
        ticker_symbol: coin.coin.ticker_symbol,
      };
    });

    res.render("challenge", {
      challenge,
      submission,
      coins: coinEntries,
      isForm:
        challenge.status === "Open" && req.session.logged_in && !hasSubmission,
      hasSubmission,
      isEnded: challenge.status === "Ended",
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get an individual portfolio,
router.get("/portfolio/:id", async (req, res) => {
  // Redirect if no user is logged in
  if (!req.session.logged_in) {
    res.redirect('/login');
    return
  }

  try {
    // Find requested portfolio data
    const portfolioData = await Portfolio.findByPk(req.params.id, {
      include: [
        {
          model: Portfolio_Coin_Entry,
        },
        {
          model: Challenge,
          include: [
            {
              model: Challenge_Coin_Data,
              include: [
                {
                  model: Coin,
                },
              ],
            },
          ],
        },
      ],
    });

    const portfolio = portfolioData.get({ plain: true });

    // Return a user to their profile if they are accessing the wrong portfolio
    if (portfolio.user_id != req.session.user_id) {
      res.redirect('/profile');
      return
    }

    const portfolioEntries = portfolio.portfolio_coin_entries;

    let coinEntries = portfolio.challenge.challenge_coin_data;

    // Update coin values with current api values
    coinEntries = await getCoinValues(coinEntries);

    let today = new Date();
    today.setHours(0,0,0,0);
    if (coinEntries.end_value === '-1' && portfolio.challenge.time_end < today) {
      coinEntries = await getHistoricCoinValues(coinEntries,portfolio.challenge.time_end);
    }
    

    const coins = evaluatePortfolio(portfolioEntries, coinEntries);

    res.render("portfolio", {
      portfolio: portfolio,
      coinEntries: coins.values,
      startValue: coins.startValue,
      currentValue: coins.currentValue,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/profile/", async (req, res) => {
  // Redirect if no user is logged in
  if (!req.session.logged_in) {
    res.redirect('/login');
    return
  }

  try {
    // Get user and submitted portfolios
    const userData = await User.findByPk(req.session.user_id, {
      include: [
        {
          model: Portfolio,
          include: [
            {
              model: Challenge,
            },
          ],
        },
      ],
    });

    const user = userData.get({ plain: true });

    res.render("profile", {
      user,
      portfolios: user.portfolios,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const challengeData = await Challenge.findAll({
      include: [
        {
          model: Portfolio,
          include: [
            {
              model: Portfolio_Coin_Entry,
            },  
            {
              model: User,
            }
          ]
        },
        {
          model: Challenge_Coin_Data,
          include: {
            model: Coin,
          },
        },
      ],
    });

    const challenges = challengeData.map((challenge) =>
      challenge.get({ plain: true })
    );

    // Collect all ended challenges for the leaderboard
    let closedChallenges = [];
    for (const challenge of challenges) {
      if (challenge.status !== "Ended" || !challenge.portfolios) {
        continue;
      }

      // Get current valuation of coin values per challenge
      const coinValues = await getCoinValues(challenge.challenge_coin_data);

      challenge.maxGain = Number.NEGATIVE_INFINITY;
      for (const portfolio of challenge.portfolios) {
        const evaluation = await evaluatePortfolio(
          portfolio.portfolio_coin_entries,
          coinValues
        );
        
        // Track top portfolio evaluation
        if (evaluation.gain > challenge.maxGain) {
          challenge.maxGain = evaluation.gain;
          challenge.topPortfolio = portfolio;
          challenge.topPortfolio.username = portfolio.user.username;
        }
      }

      // Skip adding challenge if no high score
      if (challenge.maxGain === Number.NEGATIVE_INFINITY) {
        continue
      }

      closedChallenges.push(challenge);
    }

    res.render("leaderboard", {
      challenges: closedChallenges,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("login");
  return;
});

router.get("/signup", (req, res) => {
  res.render("signup");
  return;
});

module.exports = router;
