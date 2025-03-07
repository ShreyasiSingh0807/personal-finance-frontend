import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const API_URL = "https://personal-finance-backend-mfax.onrender.com";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ date: "", category: "", amount: "", description: "" });

  // ✅ Fetch expenses when the app starts
  useEffect(() => {
    fetchExpenses();
  }, []);

  // ✅ Function to fetch expenses from the backend
  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_URL}/expenses/`);
      if (!response.ok) throw new Error("Failed to fetch expenses");
      const data = await response.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // ✅ Function to add an expense
  const addExpense = async () => {
    if (!form.date || !form.category || !form.amount || !form.description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/expenses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to add expense");

      setForm({ date: "", category: "", amount: "", description: "" });
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  // ✅ Function to generate chart data
  const getCategoryTotals = () => {
    const categoryTotals = {};
    expenses.forEach((exp) => {
      if (!categoryTotals[exp.category]) {
        categoryTotals[exp.category] = 0;
      }
      categoryTotals[exp.category] += parseFloat(exp.amount);
    });
    return categoryTotals;
  };

  const categoryData = getCategoryTotals();
  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: ["#3498db", "#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6"],
      },
    ],
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial" }}>
      <h1>Personal Finance Tracker - Latest Update</h1>

      <h2>Add Expense</h2>
      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
      <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <button onClick={addExpense}>Add</button>

      <h2>Expense List</h2>
      <table border="1" style={{ width: "80%", margin: "auto" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No expenses added yet.</td>
            </tr>
          ) : (
            expenses.map((exp, index) => (
              <tr key={index}>
                <td>{exp.date}</td>
                <td>{exp.category}</td>
                <td>{exp.amount}</td>
                <td>{exp.description}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2 style={{ marginTop: "30px" }}>Expense Breakdown</h2>
      <div style={{ width: "80%", maxWidth: "400px", margin: "auto" }}>
        {expenses.length > 0 ? <Pie data={chartData} /> : <p>No data to display</p>}
      </div>
    </div>
  );
}

export default App;
