import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = "https://personal-finance-api.onrender.com"; // Replace with your actual backend URL

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ date: "", category: "", amount: "", description: "" });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const response = await fetch(`${API_URL}/expenses/`);
    const data = await response.json();
    setExpenses(Array.isArray(data) ? data : []);
  };

  const addExpense = async () => {
    await fetch(`${API_URL}/expenses/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    fetchExpenses();
    setForm({ date: "", category: "", amount: "", description: "" });
  };

  // **Process Data for Pie Chart**
  const getCategoryTotals = () => {
    const categoryTotals = {};
    expenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
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
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "700px", margin: "auto", textAlign: "center" }}>
      <h1 style={{ color: "#2c3e50" }}>Personal Finance Tracker</h1>

      <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Add Expense</h2>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={{ padding: "5px", width: "150px" }} />
        <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ padding: "5px", width: "120px" }} />
        <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={{ padding: "5px", width: "100px" }} />
        <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ padding: "5px", width: "150px" }} />
        <button onClick={addExpense} style={{ padding: "5px 10px", backgroundColor: "#3498db", color: "white", border: "none", cursor: "pointer" }}>Add</button>
      </div>

      <h2 style={{ marginTop: "20px", fontSize: "20px" }}>Expense List</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#3498db", color: "white" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Date</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Category</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Amount</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((exp, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{exp.date}</td>
                <td style={{ padding: "10px" }}>{exp.category}</td>
                <td style={{ padding: "10px" }}>{exp.amount}</td>
                <td style={{ padding: "10px" }}>{exp.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: "10px", textAlign: "center", color: "#999" }}>No expenses added yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2 style={{ marginTop: "30px", fontSize: "20px" }}>Expense Breakdown</h2>
      <div style={{ width: "80%", maxWidth: "400px", margin: "auto" }}>
        <Pie data={chartData} />
      </div>
    </div>
  );
}

export default App;
