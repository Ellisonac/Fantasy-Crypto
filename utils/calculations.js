const { default: axios } = require("axios");

// Call https://api.coinpaprika.com/v1/coins get for more info
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

const getCoinValues = async (challengeCoins) => {
  // Add api values for current coin evaluation
  for (let ii = 0; ii < challengeCoins.length; ii++) {
    const coin = challengeCoins[ii];
    let coinUrl = `https://api.coinpaprika.com/v1/coins/${
      coinToID[coin.coin.name]
    }/markets?quotes=USD&exchange_id=binance`;
    
    try {
      const response = await axios.get(coinUrl);
      console.log(`${coin.coin.name} Request Done`);
      const coinData = response.data;

      challengeCoins[ii] = {
        ...coin,
        current_value: coinData[0].quotes.USD.price.toFixed(4),
      };
      
    } catch (err) {
      console.log(err);
      // Pause for a moment and try again
      //setTimeout(singleCall(coinID),1000);
    }
  }

  return challengeCoins;
};

const historicCall = async (coin,date) => {
  let dateStr =  Math.floor(date.getTime()/1000);

  let coinUrl = `https://api.coinpaprika.com/v1/coins/${
    coinToID[coin.coin.name]
  }/ohlcv/historical?quote=USD&start=${dateStr}&end=${dateStr}`;
  
  try {
    const response = await axios.get(coinUrl);
    return response.data[0].high;
  } catch (err) {
    console.log(err);
    throw err

  }
 }


const getHistoricCoinValues = async (challengeCoins,date,type) => {

  for (let ii = 0; ii < challengeCoins.length; ii++) {
    const coin = challengeCoins[ii];
    
    try {
      
      // const response = await axios.get(coinUrl);
      const coinData = historicCall(coin,date);

      if (type === "start") {
        coin.start_value = coinData.toFixed(4);
      } else {
        coin.end_value = coinData.toFixed(4);
      }

      challengeCoins[ii] = {...coin};
      
    } catch (err) {
      console.log(err);
      // Pause for a moment and try again
      //setTimeout(singleCall(coinID),1000);
    }
  }

  return challengeCoins;


}

const evaluatePortfolio = (portfolioEntries, coins) => {
  let values = [];
  let endTotal = 0;
  let currentTotal = 0;
  let startTotal = 0;
  for (const entry of portfolioEntries) {
    const amount = parseFloat(entry.amount);
    const coinValues = coins.filter((coin) => coin.coin_id == entry.coin_id)[0];
    const startValue = parseFloat(coinValues.start_value);
    const currentValue = parseFloat(coinValues.current_value);
    const endValue = parseFloat(coinValues.end_value);

    endTotal += amount * endValue;
    currentTotal += amount * currentValue;
    startTotal += amount * startValue;

    values.push({
      id: coinValues.coin_id,
      name: coinValues.coin.name,
      amount,
      startValue,
      currentValue,
      endValue,
    });
  }

  return {
    values,
    startValue: startTotal,
    currentValue: currentTotal,
    endValue: endTotal,
    gain: currentTotal - startTotal,
  };
};

module.exports = {
  evaluatePortfolio,
  getCoinValues,
  getHistoricCoinValues,
  historicCall
};
