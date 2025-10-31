// Food data types based on USDA FoodData Central API
export interface Food {
  fdcId: number;
  description: string;
  dataType: string;
  brandOwner?: string;
  foodNutrients: FoodNutrient[];
}

export interface FoodNutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
}

export interface SearchResult {
  foods: Food[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

// App-specific types
export interface FoodEntry {
  id: string;
  food: Food;
  servingSize: number;
  servingUnit: string;
  timestamp: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface BloodSugarEntry {
  id: string;
  level: number; // in mg/dL
  timestamp: Date;
  notes?: string;
  context?: 'fasting' | 'before-meal' | 'after-meal' | 'bedtime' | 'random';
}

export interface DailyStats {
  date: Date;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  averageBloodSugar: number;
  bloodSugarReadings: number;
}

export interface NutrientSummary {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar: number;
}
