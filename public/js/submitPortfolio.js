const req = require("express/lib/request");

let inputs = document.querySelectorAll('.coin-input-amount');


const addPortfolio = (e) => {
  e.preventDefault();

  const coinInputs =  inputs.map(input => [input.getAttribute("data-id"), input.value]);


  const reqBody = {
    challengeID,
    coinInputs
  }



  const response = await fetch('/api/portfolio', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  });
}