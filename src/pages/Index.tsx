
import { useState } from "react";
import { TransactionProvider } from "@/context/TransactionContext";
import Header from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import TransactionsPage from "@/pages/TransactionsPage";
import TabNavigation from "@/components/TabNavigation";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <TransactionProvider>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 pb-12">
          <TabNavigation activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "transactions" && <TransactionsPage />}
        </main>
      </div>
    </TransactionProvider>
  );
};

export default Index;
