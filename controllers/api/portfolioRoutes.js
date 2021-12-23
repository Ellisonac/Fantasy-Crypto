const { Challenge, Portfolio, Challenge_Coin_Data } = require("../../models");

const router = require("express").Router();

router.post("/", async (req, res) => {
  try {
    Portfolio.create({
      ...req.body
    })


  } catch (err) {
    res.status(500).json(err);
  }
});