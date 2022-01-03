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
const { default: axios } = require("axios");

const coinToID = {
  Bitcoin: "btc-bitcoin",
  Ethereum: "eth-ethereum",
  Tether: "usdt-tether",
  Cardano: "ada-cardano",
  "Binance Coin": "bnb-binance-coin",
  XRP: "xrp-xrp",
  Solana: "sol-solana",
  "USD Coin": "usdc-usd-coin",
  Polkadot: "dot-polkadot",
  Dogecoin: "doge-dogecoin",
};

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const statuses = ["Open", "Closed", "Ended"];
  const capital = [5000,10000,50000,100000];
  let challenges = [];
  for (let ii = 0; ii < 8; ii++) {
    const day = Math.floor(Math.random() * 30) + 1;
    const time_start = new Date(`January ${day}, 2022 00:00:00`);
    const time_end = new Date(`January ${day}, 2022 23:59:59`);
    // Add functionality for status check

    const chall = await Challenge.create(
      {
        capital: capital[Math.floor(Math.random() * capital.length)],
        time_start,
        time_end,
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

  let coins = allCoins.map((coin) => coin.get({ plain: true }));

  // Collect current coin data  for start value seed
  for (let ii = 0; ii < coins.length; ii++) {
    const coin = coins[ii];
    let coinUrl = `https://api.coinpaprika.com/v1/coins/${
      coinToID[coin.name]
    }/markets?quotes=USD&exchange_id=binance`;
    
    try {
      const response = await axios.get(coinUrl);
      console.log(`${coin.name} Request Done`);
      const coinData = response.data;

      // console.log(Object.keys(response));
      // console.log(coinData[0]);

      coins[ii] = {
        ...coin,
        start_value: coinData[0].quotes.USD.price.toFixed(4),
      };
      
    } catch (err) {
      console.log(err);
      // Pause for a moment and try again
      //setTimeout(singleCall(coinID),1000);
    }
  }

  // Populate each coins value for each challenge example
  for (const challenge of challenges) {
    for (const coin of coins) {
      await Challenge_Coin_Data.create({
        challenge_id: challenge.id,
        coin_id: coin.id,
        start_value: coin.start_value,
        end_value: coin.start_value*(1+ (Math.random()-.5) * .5),
      });
    }
  }

  // Populate portfolios and assign to random users/challenges
  let portfolios = [];
  for (let ii = 0; ii < users.length*3; ii++) {
    const port = await Portfolio.create({
      user_id: Math.floor(ii/3) + 1,
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
