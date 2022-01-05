const createPieChart = async () => {
    const coinsData = document.querySelectorAll("li.card");

    let coins = [];
    for(let i = 0; i < 3; i++){
        let coinName = coinsData[i].childNodes[1].textContent;
        coinName = coinName.split(" ");
        let coinAmount = coinsData[i].childNodes[3].textContent;
        coinAmount = coinAmount.split(" ");
        
        let coin = {
            "name": coinName[1],
            "amount": coinAmount[1]
        }

        coins.push(coin);
    };

    console.log(coins);

    const data = {
        labels: [
          'Red',
          'Blue',
          'Yellow'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      };

    const config = {
        type: 'pie',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Portfolio Breakdown'
            }
          }
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