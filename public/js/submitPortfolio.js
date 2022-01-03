let challengeForm = document.querySelector(".challenge-form");
let inputs = document.querySelectorAll(".coin-input-amount");
let inputForms = document.querySelectorAll(".coin-inputs");
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

  console.log(response);

  challengeFormButton.removeEventListener("click", addPortfolio);
  challengeFormButton.setAttribute("Style","background-color:green");
  challengeFormButton.innerHTML = "Submitted!";
  challengeFormButton.disabled = true;

};

challengeFormButton.addEventListener("click", addPortfolio);
