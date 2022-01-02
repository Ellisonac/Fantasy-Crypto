const getCoinValues = (challengeCoins) => {};

const evaluatePortfolio = (portfolioEntries, coins) => {
  let values = [];
  let total = 0;
  for (const entry of portfolioEntries) {
    const amount = parseFloat(entry.amount);
    const coinValues = coins.filter((coin) => coin.coin_id == entry.coin_id)[0];
    const coinValue = amount * parseFloat(coinValues.start_value);
    values.push({
      id: coinValues.coin_id,
      amount,
      coinValue,
    });
    total += amount * coinValue;
  }
  console.log(total);
  return {
    values,
    total,
  };

};

module.exports = {
  evaluatePortfolio,
  getCoinValues,
};
