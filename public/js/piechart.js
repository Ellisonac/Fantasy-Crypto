const createPieChart = async () => {
    const coinsData = document.querySelectorAll(".coin-card li");

    let coins = [];

    for(let i = 0; i < 3; i++){
        let coinName = coinsData[i].childNodes[1].textContent;
        coinName = coinName.split(" ");
        let coinAmount = coinsData[i].childNodes[3].textContent;
        coinAmount = coinAmount.split(" ");
        let coinCurrVal = coinsData[i].childNodes[7].textContent;
        coinCurrVal = coinCurrVal.split(" ");

        let ratio = coinAmount[1] * coinCurrVal[2];

        let coin = {
            "name": coinName[1],
            "amount": coinAmount[1],
            "currVal": coinCurrVal[1],
            "ratio": ratio
        }

        coins.push(coin);
    };

    const data = {
        labels: [
          coins[0].name,
          coins[1].name,
          coins[2].name
        ],
        datasets: [{
          label: 'Portfolio Breakdown',
          data: [coins[0].ratio, coins[1].ratio, coins[2].ratio],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4,
          datalabels:{
              color: 'rgb(255, 255, 255)',
              font: {
                  size: 16
              },
              formatter: function(value, context){
                  return context.chart.data.labels[context.dataIndex];
              },
          }
        }]
      };

    const config = {
      type: "pie",
      data: data,
      plugins: [ChartDataLabels],
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "rgb(255, 255, 255)",
              font: {
                  size: 16
              }
            },
          },
          title: {
            color: "rgb(255, 255, 255)",
            font:{
                size: 16
            },
            display: true,
            text: "Portfolio Breakdown",
          },
        },
      },
    };

      var myChart = new Chart(
        document.getElementById('pie_chart'),
        config
      );
};

if(document.readyState === 'loading'){
    document
    .addEventListener('DOMContentLoaded', createPieChart);
}