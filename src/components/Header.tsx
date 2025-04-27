
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransactionForm from "./TransactionForm";
import { Plus } from "lucide-react";

const Header = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 sm:px-8 mb-8 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Expense Flow Explorer</h1>
          <p className="text-sm opacity-80">Track, visualize and optimize your spending</p>
        </div>

        <Button 
          variant="secondary" 
          className="flex items-center gap-2"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>New Transaction</span>
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm onComplete={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
