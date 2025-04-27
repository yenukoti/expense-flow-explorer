
import { Card } from "@/components/ui/card";
import DashboardSummary from "@/components/DashboardSummary";
import ExpenseCharts from "@/components/ExpenseCharts";
import BudgetManager from "@/components/BudgetManager";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      <DashboardSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ExpenseCharts />
        <BudgetManager />
      </div>
    </div>
  );
};

export default Dashboard;
