// Coinpaprika calls to populate challenges

// Coin lookup
var coinToID = {
  'Bitcoin (BTC)': 'btc-bitcoin',
  'Ethereum (ETH)': 'eth-ethereum',
  'Tether (USDT)': 'usdt-tether',
  'Cardano (ADA)': 'ada-cardano',
  'Binance Coin (BNB)': 'bnb-binance-coin',
  'XRP (XRP)': 'xrp-xrp',
  'Solana (SOL)': 'sol-solana',
  'USD Coin (USDC)': 'usdc-usd-coin',
  'Polkadot (DOT)': 'dot-polkadot',
  'Dogecoin (DOGE)':'doge-dogecoin',
  }


let currentUrl= "https://api.coinpaprika.com/v1/coins/" +coinToID[searchValue] +"/markets";

// Long series of .then calls to make sure that both historical and current price data are passed to the charting functions
fetch(historicalUrl)
  .then(function(historicalResponse){
  return historicalResponse.json()
  }).then(function(historical){
    fetch(currentUrl)
      .then(function(response){
        return response.json()
      }).then(function(data){
        calcAndChart(searchValue,data[0].quotes.USD.price,historical,'coin');
        getTweet();
      }) 
  })