// components/TransactionList.tsx
import React from "react";
import { TransactionCard, type TransactionData } from "./TransactionCard";

interface TransactionListProps {
  transactions: TransactionData[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="space-y-3">
      {transactions.map((transaction, index) => (
        <TransactionCard key={index} transaction={transaction} />
      ))}
    </div>
  );
};

export default TransactionList;
