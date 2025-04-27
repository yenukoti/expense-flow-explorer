
import { useState, useEffect } from "react";
import { Transaction, Category, CATEGORY_LABELS, ALL_CATEGORIES } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactions } from "@/context/TransactionContext";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  transaction?: Transaction;
  onComplete: () => void;
}

const TransactionForm = ({ transaction, onComplete }: TransactionFormProps) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const [amount, setAmount] = useState(transaction ? transaction.amount.toString() : "");
  const [date, setDate] = useState<Date>(transaction ? transaction.date : new Date());
  const [description, setDescription] = useState(transaction ? transaction.description : "");
  const [category, setCategory] = useState<Category>(transaction ? transaction.category : "other");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!date) {
      newErrors.date = "Date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const transactionData = {
      amount: parseFloat(amount),
      date,
      description,
      category,
    };
    
    if (transaction) {
      updateTransaction({ ...transactionData, id: transaction.id });
    } else {
      addTransaction(transactionData);
    }
    
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className={cn(errors.amount && "border-red-500")}
        />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
                errors.date && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {ALL_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat} className="capitalize flex items-center">
                <div className={`w-3 h-3 rounded-full bg-expense-${cat} mr-2`}></div>
                {CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className={cn(errors.description && "border-red-500")}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" className="w-full">
          {transaction ? "Update Transaction" : "Add Transaction"}
        </Button>
        <Button type="button" variant="outline" onClick={onComplete} className="w-full">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
