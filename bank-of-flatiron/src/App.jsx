import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, useFilters } from 'react-table';
import './App.css';

// TransactionForm Component: Form to add new transactions
const TransactionForm = ({ onAddTransaction }) => {
  // State to store form data
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    category: '',
    amount: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTransaction(formData);
    // Clear form inputs or show a success message
    setFormData({
      date: '',
      description: '',
      category: '',
      amount: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <input
        type="text"
        name="date"
        value={formData.date}
        onChange={handleChange}
        placeholder="Date"
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
      />
      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Amount"
      />
      {/* Submit button */}
      <button type="submit">Add Transaction</button>
    </form>
  );
};

// SearchBar Component: Search input to filter transactions
const SearchBar = ({ onSearch }) => {
  // State to store the search term
  const [searchTerm, setSearchTerm] = useState('');

  // Handle search input changes
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Use useEffect to delay the search and prevent excessive calls
  useEffect(() => {
    // Create a timer to delay the search
    const delaySearch = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // Wait for 300 milliseconds after user stops typing before triggering the search

    // Cleanup the timer when component unmounts or the search term changes
    return () => clearTimeout(delaySearch);
  }, [searchTerm, onSearch]);

  return (
    <input
      type="text"
      placeholder="Search by description..."
      value={searchTerm}
      onChange={handleChange}
    />
  );
};

// BankApp Component: Main component to display transactions and search/filter options
const BankApp = () => {
  // State to store all transactions from the API
  const [transactions, setTransactions] = useState([]);

  // State to store filtered transactions based on search term
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Fetch transactions from the API on component mount
  useEffect(() => {
    axios.get('http://localhost:8000/transactions')
      .then((response) => setTransactions(response.data))
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });
  }, []);

  // Handle adding a new transaction
  const handleAddTransaction = (formData) => {
    axios.post('http://localhost:8000/transactions', formData)
      .then(() => {
        // After successful addition, fetch the updated transaction list again from the server
        axios.get('http://localhost:8000/transactions')
          .then((response) => setTransactions(response.data))
          .catch((error) => {
            console.error('Error fetching transactions:', error);
          });
      })
      .catch((error) => {
        console.error('Error adding transaction:', error);
      });
  };

  // Handle search to filter transactions
  const handleSearch = (searchTerm) => {
    // Filter transactions based on the search term and update the filteredTransactions state
    const filteredData = transactions.filter((transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(filteredData);
  };

  // Table columns for react-table
  const columns = [
    { Header: 'Date', accessor: 'date' },
    { Header: 'Description', accessor: 'description' },
    { Header: 'Category', accessor: 'category' },
    { Header: 'Amount', accessor: 'amount' },
  ];

  // Use filteredTransactions if search term exists, otherwise use all transactions
  const data = filteredTransactions.length > 0 ? filteredTransactions : transactions;

  // Create a react-table instance
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        filters: [],
      },
    },
    useFilters
  );

  // Destructuring necessary properties from the react-table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div>
      {/* Transaction Form */}
      <TransactionForm onAddTransaction={handleAddTransaction} />

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Transaction Table */}
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BankApp;
