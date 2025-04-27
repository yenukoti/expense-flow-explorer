
import { useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ALL_CATEGORIES, CATEGORY_LABELS, Category } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BudgetManager = () => {
  const { budgets, setBudget, categoryTotals } = useTransactions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("food");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [error, setError] = useState("");

  const handleSaveBudget = () => {
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      setError("Please enter a valid budget amount");
      return;
    }

    setBudget(selectedCategory, parseFloat(budgetAmount));
    setIsDialogOpen(false);
    setBudgetAmount("");
    setError("");
  };

  const getCategorySpending = (category: string) => {
    const categoryTotal = categoryTotals.find((c) => c.category === category);
    return categoryTotal ? categoryTotal.total : 0;
  };

  const getProgressPercentage = (category: string, limit: number) => {
    const spent = getCategorySpending(category);
    const percentage = (spent / limit) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-destructive";
    if (percentage >= 80) return "bg-orange-500";
    return "bg-primary";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Budget Tracking</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)}>Set Budget</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            No budgets set yet. Set a budget to start tracking your spending.
          </div>
        ) : (
          budgets.map((budget) => {
            const spent = getCategorySpending(budget.category);
            const percentage = getProgressPercentage(budget.category, budget.limit);
            const progressColor = getProgressColor(percentage);
            
            return (
              <div key={budget.category} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-expense-${budget.category} mr-2`}></div>
                    <span className="text-sm">{CATEGORY_LABELS[budget.category]}</span>
                  </div>
                  <div className="text-sm">
                    ${spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                  </div>
                </div>
                <Progress value={percentage} className={progressColor} />
              </div>
            );
          })
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as Category)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full bg-expense-${category} mr-2`}></div>
                        {CATEGORY_LABELS[category]}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Budget Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="0.00"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveBudget} className="w-full">
                Save Budget
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setError("");
                }}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BudgetManager;
