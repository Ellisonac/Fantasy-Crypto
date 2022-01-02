const getCoinValues = (challengeCoins) => {};

const evaluatePortfolio = (portfolioEntries, coins) => {
  let values = [];
  let currentTotal = 0;
  let startTotal = 0;
  for (const entry of portfolioEntries) {
    const amount = parseFloat(entry.amount);
    const coinValues = coins.filter((coin) => coin.coin_id == entry.coin_id)[0];
    const startValue = parseFloat(coinValues.start_value);
    const endValue = parseFloat(coinValues.end_value);

    currentTotal += amount * endValue;
    startTotal += amount * startValue;

    values.push({
      id: coinValues.coin_id,
      name: coinValues.coin.name,
      amount,
      startValue,
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
