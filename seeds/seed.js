const sequelize = require("../config/connection");
const {
  Challenge_Coin_Data,
  Challenge,
  Coin,
  Portfolio_Coin_Entry,
  Portfolio,
  User,
} = require("../models");

const userData = require("./userData.json");
const coinData = require("./coinData.json");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const statuses = ["Open", "Closed", "Ended"];
  let challenges = [];
  for (let ii = 0; ii < 5; ii++) {
    const day = Math.floor(Math.random() * 30) + 1;
    const chall = await Challenge.create(
      {
        capital: Math.floor(Math.random() * 100000),
        time_start: new Date(`December ${day}, 2021 00:00:00`),
        time_end: new Date(`December ${day}, 2021 23:59:59`),
        status: statuses[Math.floor(Math.random() * statuses.length)],
      },
      {
        returning: true,
      }
    );
    challenges.push(chall.get({ plain: true }));
  }

  const allCoins = await Coin.bulkCreate(coinData, {
    individualHooks: true,
    returning: true,
  });

  const coins = allCoins.map((coin) => coin.get({ plain: true }));

  console.log(coins, challenges);

  // Populate each coins value for each challenge example
  for (const challenge of challenges) {
    for (const coin of coins) {
      console.log(coin.id, challenge.id);
      await Challenge_Coin_Data.create({
        challenge_id: challenge.id,
        coin_id: coin.id,
        start_value: Math.random() * 100,
        end_value: Math.random() * 100,
      });
    }
  }

  // Populate portfolios and assign to random users/challenges
  let portfolios = [];
  for (let ii = 0; ii < users.length; ii++) {
    const port = await Portfolio.create({
      user_id: ii + 1,
      challenge_id:
        challenges[Math.floor(Math.random() * challenges.length)].id,
    });
    portfolios.push(port);
  }

  // Populate random portfolio amounts
  for (const portfolio of portfolios) {
    for (const coin of coins) {
      await Portfolio_Coin_Entry.create({
        portfolio_id: portfolio.id,
        coin_id: coin.id,
        amount: Math.random() * 10,
      });
    }
  }

  process.exit(0);
};

seedDatabase();
