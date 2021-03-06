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
const challengeData = require("./challengeData.json");
const { historicCall } = require("../utils/calculations");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const challenges = await Challenge.bulkCreate(challengeData, {
    returning: true,
  });
  // const statuses = ["Open", "Closed", "Ended"];
  // const capital = [5000,10000,50000,100000];
  // let challenges = [];
  // for (let ii = 0; ii < 8; ii++) {
  //   const day = Math.floor(Math.random() * 30) + 1;
  //   const time_start = new Date(`January ${day}, 2022 00:00:00`);
  //   const time_end = new Date(`January ${day}, 2022 23:59:59`);
  //   // Add functionality for status check

  //   const chall = await Challenge.create(
  //     {
  //       capital: capital[Math.floor(Math.random() * capital.length)],
  //       time_start,
  //       time_end,
  //       status: statuses[Math.floor(Math.random() * statuses.length)],
  //     },
  //     {
  //       returning: true,
  //     }
  //   );
  //   challenges.push(chall.get({ plain: true }));
  // }

  const allCoins = await Coin.bulkCreate(coinData, {
    individualHooks: true,
    returning: true,
  });

  let coins = allCoins.map((coin) => coin.get({ plain: true }));

  // Collect current coin data  for start value seed
  // for (let ii = 0; ii < coins.length; ii++) {
  //   let = coins[ii];

  //   let coinUrl = `https://api.coinpaprika.com/v1/coins/${
  //     coinToID[coin.name]
  //   }/markets?quotes=USD&exchange_id=binance`;

  //   try {
  //     const response = await axios.get(coinUrl);
  //     console.log(`${coin.name} Request Done`);
  //     const coinData = response.data;

  //     coins[ii] = {
  //       ...coin,
  //       start_value: coinData[0].quotes.USD.price.toFixed(4),
  //     };

  //   } catch (err) {
  //     console.log(err);
  //     // Pause for a moment and try again
  //     //setTimeout(singleCall(coinID),1000);
  //   }
  // }

  // Populate each coins value for each challenge example
  for (const challenge of challenges) {
    for (const coin of coins) {
      coin.coin = { name: coin.name };

      let start_value = await historicCall(coin, challenge.time_start);

      let end_value = -1;
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      if (challenge.time_end < today) {
        end_value = await historicCall(coin, challenge.time_end);
      }

      await Challenge_Coin_Data.create({
        challenge_id: challenge.id,
        coin_id: coin.id,
        start_value,
        end_value,
        // end_value: coin.start_value*(1+ (Math.random()-.5) * .5),
      });
    }
  }

  // Populate portfolios and assign to random users/challenges
  let portfolios = [];
  let perUser = 4;
  for (let ii = 0; ii < users.length * perUser; ii++) {
    const port = await Portfolio.create({
      user_id: Math.floor(ii % perUser) + 1,
      challenge_id:
        challenges[Math.floor(Math.random() * challenges.length)].id,
    });
    portfolios.push(port);
  }

  // Populate random portfolio amounts
  // TODO change to seed based on values not amounts
  let snapshot = [47834,.17,3772]

  for (const portfolio of portfolios) {
    for (const coin of coins) {
      await Portfolio_Coin_Entry.create({
        portfolio_id: portfolio.id,
        coin_id: coin.id,
        amount: Math.random() * 10000 / snapshot[coin.id-1],
      });
    }
  }

  process.exit(0);
};

seedDatabase();
