import { useFetcher } from "react-router";
import { useState } from "react";

export async function loader({ request }) {
    const apiUrl = "http://localhost:5000/transactions";
    const res = await fetch(apiUrl);
    const transactions = await res.json();
    
    return transactions;
}

export async function action({ request }) {
    const apiUrl = "http://localhost:5000";

    if (request.method === "POST") {
        const formData = await request.formData();
        const transactionData = {
            amount: formData.get("amount"),
            category: formData.get("category"),
            description: formData.get("description")
        };
        const response = await fetch(apiUrl + request.action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(transactionData)
        });
        return response.json();
    } else if (request.method === "DELETE") {
        const response = await fetch(apiUrl + request.action, {
            method: "DELETE"
        });
        return response.json();
    }
}

function TransactionForm() {
    let fetcher = useFetcher();
    const [formData, setFormData] = useState({
        amount: "",
        category: "",
        description: ""
    });

    return (
        <fetcher.Form method="POST" action="/transactions">
            <input 
                type="number"
                name="amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="Amount"
            />
            <input 
                type="text"
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Category"
            />
            <input 
                type="text"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description"
            />
            <button type="submit">Add Transaction</button>
        </fetcher.Form>
    )
}

function TransactionList({ loaderData }) {
    let fetcher = useFetcher();
    const [transactions, setTransactions] = useState(loaderData);

    return (
        <div>
            {transactions.map(transaction => (
                <div key={transaction.id}>
                    <p>
                        {transaction.description}: ${transaction.amount} ({transaction.category}) | ({transaction.date})
                    </p>
                    <button onClick={() => {
                        fetcher.submit(null, { method: "DELETE", action: `/transactions/${transaction.id}` });
                    }}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    )
}

export default function Dashboard() {
    return (
        <div className="p-30">
            <h1>Smart Budget Dashboard</h1>
            <TransactionForm />

            <h2>Transactions</h2>
            <TransactionList />
        </div>
    )
}