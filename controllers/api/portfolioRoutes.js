const {
  Challenge,
  Portfolio,
  Challenge_Coin_Data,
  Portfolio_Coin_Entry,
} = require("../../models");

const router = require("express").Router();

router.post("/", async (req, res) => {
  try {
    const newPortfolio = await Portfolio.create(
      {
        user_id: req.session.user_id,
        challenge_id: req.body.challengeID,
      },
      { returning: true, }
    );

    const portID = newPortfolio.id;

    let coinEntries = [];
    for (coin of req.body.coinInputs) {
      console.log({
        coin_id: coin[0],
        portfolio_id: portID,
        amount: coin[1],
      },);
      const newCoinEntry = await Portfolio_Coin_Entry.create(
        {
          coin_id: coin[0],
          portfolio_id: portID,
          amount: coin[1],
        },
        { returning: true }
      );
      coinEntries.push(newCoinEntry);
    }
    res.status(200).json(newPortfolio)
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
