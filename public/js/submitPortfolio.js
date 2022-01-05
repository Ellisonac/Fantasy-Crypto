let challengeForm = document.querySelector(".challenge-form");
let inputs = document.querySelectorAll(".coin-input-amount");
let challengeFormButton = document.querySelector(".challenge-form button");
let allocationEl = document.querySelector("#allocation");
let capital = parseFloat(
  document.querySelector("#challenge-capital").innerHTML
);

let allocChart;

const getCoinInputs = (inputs) => {
  return Array.from(inputs).map((input) => {
    const coin_id = input.getAttribute("data-id");
    const coin_name = input.getAttribute("data-name");
    const start_value = parseFloat(
      document.querySelector(`#coin${coin_id}-start`).innerHTML
    );

    return [
      coin_id,
      parseFloat(input.value) || 0, // Input amount
      start_value,
      coin_name,
    ];
  });
};

const addPortfolio = async (e) => {
  const challengeID = challengeForm.getAttribute("data-id");

  const coinInputs = getCoinInputs(inputs);

  const response = await fetch("/api/portfolio", {
    method: "POST",
    body: JSON.stringify({ challengeID, coinInputs }),
    headers: { "Content-Type": "application/json" },
  });

  if (response.status == 200) {
    challengeFormButton.removeEventListener("click", addPortfolio);
    challengeFormButton.setAttribute("Style", "background-color:green");
    challengeFormButton.innerHTML = "Submitted!";
    challengeFormButton.disabled = true;
  } else {
    challengeFormButton.setAttribute("Style", "background-color:red");
    challengeFormButton.innerHTML = "Error";
  }
};

const updateAllocation = () => {
  const coinInputs = getCoinInputs(inputs);

  let totalAllocation = 0;
  for (const coin of coinInputs) {
    totalAllocation += coin[1];
  }

  allocationEl.innerHTML = `${((totalAllocation / capital) * 100).toFixed(2)}% Funds Allocated`;

  if (totalAllocation > capital) {
    challengeFormButton.disabled = true;
    allocationEl.setAttribute("style", "color:red");
  } else {
    challengeFormButton.disabled = false;
    allocationEl.setAttribute("style", "color:black");
  }

  createAllocationChart();
};

// Code to show responsive allocation pie chart
const createAllocationChart = async () => {
  if (allocChart) {
    allocChart.destroy();
  }

  const coinInputs = getCoinInputs(inputs);

  let alloc = coinInputs.map((coin) => coin[1]);

  alloc.push(Math.max(0, capital - alloc.reduce((a, b) => a + b, 0)));

  let labels = coinInputs.map((coin) => coin[3]);

  labels.push("Unallocated");

  const data = {
    labels,
    datasets: [
      {
        label: "Allocation Breakdown",
        data: alloc,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(100, 100, 100)",
        ],
        hoverOffset: 4,
        datalabels: {
          color: "rgb(255, 255, 255)",
          font: {
            size: 16,
          },
          formatter: function (value, context) {
            return context.chart.data.labels[context.dataIndex];
          },
        },
      },
    ],
  };

  const config = {
    type: "pie",
    data: data,
    options: {
      responsive: true,
      
      legend: {
          labels: {
              fontColor: "white",
              fontSize: 14
          }
      },
    },
  };

  allocChart = new Chart(document.querySelector("#allocation-chart"), config);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createAllocationChart);
}

for (let ii = 1; ii < inputs.length + 1; ii++) {
  const coinInput = document.querySelector(`#coin${ii}-input`);
  const coinStart = parseFloat(
    document.querySelector(`#coin${ii}-start`).innerHTML
  );
  const coinTicker = document.querySelector(`#coin${ii}-ticker`).innerHTML;
  const coinPurchase = document.querySelector(`#coin${ii}-purchase`);

  coinInput.addEventListener("change", (e) => {
    if (coinInput.value < 0) {
      coinInput.value = 0;
    }
    const value = coinInput.value / coinStart;
    coinPurchase.innerHTML = `${value} ${coinTicker}`;
    updateAllocation();
  });
}

challengeFormButton.addEventListener("click", addPortfolio);

updateAllocation();
