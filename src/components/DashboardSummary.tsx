
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySummary, CATEGORY_LABELS } from "@/types";
import { useTransactions } from "@/context/TransactionContext";
import { format } from "date-fns";

const SummaryCard = ({ title, value, description }: { title: string; value: string; description?: string }) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

const TopCategoriesCard = ({ categories }: { categories: CategorySummary[] }) => {
  const topCategories = categories.slice(0, 3);

  return (
    <Card className="col-span-1 lg:col-span-2 h-full">
      <CardHeader>
        <CardTitle className="text-sm sm:text-base font-medium">Top Spending Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topCategories.length > 0 ? (
          topCategories.map((category, index) => (
            <div key={category.category} className="flex items-center">
              <div className={`w-3 h-3 rounded-full bg-expense-${category.category} mr-2`}></div>
              <div className="flex-1 flex justify-between items-center">
                <span className="text-sm">{CATEGORY_LABELS[category.category]}</span>
                <div className="text-sm font-medium">${category.total.toFixed(2)}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-2">No transactions yet</div>
        )}
      </CardContent>
    </Card>
  );
};

const RecentTransactionsCard = ({ transactions }: { transactions: any[] }) => {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card className="col-span-1 lg:col-span-2 h-full">
      <CardHeader>
        <CardTitle className="text-sm sm:text-base font-medium">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div className="overflow-hidden">
          {recentTransactions.length > 0 ? (
            <div className="divide-y">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <div className="flex items-center mt-1">
                      <div className={`w-2 h-2 rounded-full bg-expense-${tx.category} mr-1.5`}></div>
                      <p className="text-xs text-muted-foreground">
                        {CATEGORY_LABELS[tx.category]}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${tx.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(tx.date, 'MMM d')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-6">
              No transactions yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardSummary = () => {
  const { totalExpenses, categoryTotals, sortedTransactions } = useTransactions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <SummaryCard
        title="Total Expenses"
        value={`$${totalExpenses.toFixed(2)}`}
        description="All time expense total"
      />
      
      <SummaryCard
        title="Average Transaction"
        value={sortedTransactions.length > 0
          ? `$${(totalExpenses / sortedTransactions.length).toFixed(2)}`
          : "$0.00"
        }
      />
      
      <TopCategoriesCard categories={categoryTotals} />
      
      <RecentTransactionsCard transactions={sortedTransactions} />
    </div>
  );
};

export default DashboardSummary;
