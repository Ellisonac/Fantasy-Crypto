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
  for (const coin of challengeCoins) {
    let coinUrl = `https://api.coinpaprika.com/v1/coins/${
      coinToID[coin.coin.name]
    }/markets`;
    try {
      const response = await axios(coinUrl);
      const coinData = response.json();

      coin = {
        ...coin,
        current_value: coinData[0].quotes.USD.price,
      };
    } catch (err) {
      console.log(err);
      // Pause for a moment and try again
      //setTimeout(singleCall(coinID),1000);
    }
  }

  return challengeCoins;
};

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
    gain: currentTotal - startTotal,
  };
};

module.exports = {
  evaluatePortfolio,
  getCoinValues,
};
