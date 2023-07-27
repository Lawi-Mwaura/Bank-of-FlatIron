import React, { useState } from 'react';

function TransactionForm({ onAddTransaction }) {
  // Define a state variable for form data
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    category: '',
    amount: ''
  });

  // Define a function to handle changes to form inputs
  function handleChange(event) {
    // Update the form data state with the current value of the changed input
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  // Define a function to handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    // Create a new transaction object from the form data
    const newTransaction = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    // Call the onAddTransaction prop function with the new transaction
    onAddTransaction(newTransaction);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Render an input for date and bind its value and change event to the form data state */}
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />
      {/* Render an input for description and bind its value and change event to the form data state */}
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      {/* Render an input for category and bind its value and change event to the form data state */}
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
      />
      {/* Render an input for amount and bind its value and change event to the form data state */}
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
      />
      {/* Render a submit button for the form */}
      <button type="submit">Add Transaction</button>
    </form>
  );
}

export default TransactionForm;
