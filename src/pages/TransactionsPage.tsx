
import TransactionList from "@/components/TransactionList";

const TransactionsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
      <TransactionList />
    </div>
  );
};

export default TransactionsPage;
