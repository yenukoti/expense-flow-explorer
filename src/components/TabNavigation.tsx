
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar, List } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

const TabNavigation = ({ activeTab, onChange }: TabNavigationProps) => {
  return (
    <div className="mb-6">
      <Tabs value={activeTab} onValueChange={onChange}>
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Transactions</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TabNavigation;
