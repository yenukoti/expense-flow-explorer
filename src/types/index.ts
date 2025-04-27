
export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  category: Category;
}

export type Category = 
  | "food" 
  | "utilities" 
  | "transport" 
  | "entertainment" 
  | "shopping" 
  | "health" 
  | "housing" 
  | "education" 
  | "other";

export interface Budget {
  category: Category;
  limit: number;
}

export interface CategorySummary {
  category: Category;
  total: number;
  percentage: number;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  food: "Food & Dining",
  utilities: "Utilities",
  transport: "Transportation",
  entertainment: "Entertainment",
  shopping: "Shopping",
  health: "Health & Medical",
  housing: "Housing",
  education: "Education",
  other: "Other"
};

export const ALL_CATEGORIES: Category[] = [
  "food",
  "utilities",
  "transport", 
  "entertainment",
  "shopping",
  "health",
  "housing",
  "education",
  "other"
];
