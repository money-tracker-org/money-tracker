import React from "react";
import "./App.css";
import TransactionList from "./components/TransactionList";
import CreateNewUser from "./components/CreateNewUser";
import CreateTransactionForm from "./components/CreateTransactionForm";

function App() {
  return (
    <>
      <CreateNewUser />
      <CreateTransactionForm />
      <TransactionList />
    </>
  );
}

export default App;
