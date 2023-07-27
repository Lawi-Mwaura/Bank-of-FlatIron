import React, { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import SearchBar from './SearchBar';


function BankApp() {
  // Define state variables for transactions and search term
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch transactions data from the API when the component mounts
  useEffect(() => {
    fetch('http://localhost:8000/transactions')
      .then(response => response.json())
      .then(data => setTransactions(data));
  }, []);

  // Define a function to handle adding a new transaction
  function handleAddTransaction(newTransaction) {
    // Send a POST request to the API with the new transaction data
    fetch('http://localhost:8000/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTransaction)
    })
      .then(response => response.json())
      // Update the transactions state with the new transaction
      .then(data => setTransactions([...transactions, data]));
  }

  // Define a function to handle changes to the search input
  function handleSearchChange(event) {
    // Update the search term state with the current value of the search input
    setSearchTerm(event.target.value);
  }

  // Filter the transactions array to only include transactions with a description that matches the search term
  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Render the SearchBar component and pass it the current search term and the handleSearchChange function as props */}
      <SearchBar value={searchTerm} onChange={handleSearchChange} />
      {/* Render the TransactionForm component and pass it the handleAddTransaction function as a prop */}
      <TransactionForm onAddTransaction={handleAddTransaction} />
      {/* Render the TransactionTable component and pass it the filtered transactions as a prop */}
      <TransactionTable transactions={filteredTransactions} />
    </div>
  );
}

export default BankApp;
