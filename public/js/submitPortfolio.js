let challengeForm = document.querySelector(".challenge-form");
let inputs = document.querySelectorAll(".coin-input-amount");
// let inputForms = document.querySelectorAll(".coin-inputs");
let challengeFormButton = document.querySelector(".challenge-form button");

const addPortfolio = async (e) => {
  e.preventDefault();

  const challengeID = challengeForm.getAttribute("data-id");

  const coinInputs = Array.from(inputs).map((input) => [
    input.getAttribute("data-id"),
    input.value,
  ]);

  const response = await fetch("/api/portfolio", {
    method: "POST",
    body: JSON.stringify({ challengeID, coinInputs }),
    headers: { "Content-Type": "application/json" },
  });

  if (response.status == 200) {
    challengeFormButton.removeEventListener("click", addPortfolio);
    challengeFormButton.setAttribute("Style","background-color:green");
    challengeFormButton.innerHTML = "Submitted!";
    challengeFormButton.disabled = true;
  } else {
    challengeFormButton.setAttribute("Style","background-color:red");
    challengeFormButton.innerHTML = "Error";
  }

};

challengeFormButton.addEventListener("click", addPortfolio);

console.log(inputs.length);

for (let ii = 1; ii < inputs.length+1; ii++) {

  const coinInput = document.querySelector(`#coin${ii}-input`);
  const coinStart = parseFloat(document.querySelector(`#coin${ii}-start`).innerHTML);
  const coinTicker = document.querySelector(`#coin${ii}-ticker`).innerHTML;
  const coinPurchase = document.querySelector(`#coin${ii}-purchase`);

  console.log(coinInput);

  coinInput.addEventListener("change",(e) => {
    const value = coinInput.value/coinStart;
    coinPurchase.innerHTML = `${value} ${coinTicker}`
    

  })

}
