const format_date = (date) => {
  // Format date as MM/DD/YYYY
  return date.toLocaleDateString();
};

const format_amount = (amount) => {
  // format large numbers with commas
  return parseInt(amount).toLocaleString();
};

module.exports = { format_date, format_amount };
