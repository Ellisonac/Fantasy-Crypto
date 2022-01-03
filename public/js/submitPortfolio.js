let challengeForm = document.querySelector(".challenge-form");
let inputs = document.querySelectorAll(".coin-input-amount");

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

};



document
  .querySelector(".challenge-form button")
  .addEventListener("click", addPortfolio);
