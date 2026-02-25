import { Form, useSubmit , useLoaderData } from "react-router";
import { useState } from "react";

export async function loader({ request }) {
    const apiUrl = "http://localhost:5000/transactions";
    const res = await fetch(apiUrl);
    const transactions = await res.json();
    
    return transactions;
}

export async function action({ request }) {
    const apiUrl = "http://localhost:5000/transactions";

    if (request.method === "POST") {
        const formData = await request.formData();
        const transactionData = {
            amount: formData.get("amount"),
            category: formData.get("category"),
            description: formData.get("description")
        };
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(transactionData)
        });
        return response.json();
    } else if (request.method === "DELETE") {
        const formData = await request.formData();
        const id = formData.get("id");
        const response = await fetch(`${apiUrl}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error("Failed to delete transaction: " + response.status + " " + response.statusText);
        }
        return response.json();
    }
}

function TransactionForm() {
    const [formData, setFormData] = useState({
        amount: "",
        category: "",
        description: ""
    });

    return (
        <Form method="POST">
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
        </Form>
    )
}

function TransactionList({ loaderData }) {
    let submit = useSubmit();
    const [transactions, setTransactions] = useState(loaderData);

    if (transactions === undefined) {
        return <p>No transactions found.</p>;
    }
    return (
        <div>
            {transactions.map(transaction => (
                <div key={transaction.id}>
                    <p>
                        {transaction.description}: ${transaction.amount} ({transaction.category}) | ({transaction.date})
                    </p>
                    <button onClick={() => {
                        submit({ id: transaction.id.toString() }, { method: "DELETE" });
                    }}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    )
}

export default function Dashboard() {
    const loaderData = useLoaderData();
    return (
        <div className="p-30">
            <h1>Smart Budget Dashboard</h1>
            <TransactionForm />

            <h2>Transactions</h2>
            <TransactionList loaderData={loaderData}/>
        </div>
    )
}