import type { FoodEntry, NutrientSummary } from '../types';

// USDA nutrient IDs
const NUTRIENT_IDS = {
  ENERGY: 1008,
  PROTEIN: 1003,
  FAT: 1004,
  CARBS: 1005,
  FIBER: 1079,
  SUGAR: 2000,
};

export const getNutrientValue = (
  foodEntry: FoodEntry,
  nutrientId: number
): number => {
  const nutrient = foodEntry.food.foodNutrients.find(
    (n) => n.nutrientId === nutrientId
  );
  if (!nutrient) return 0;

  // Adjust for serving size (nutrients are per 100g in USDA data)
  const multiplier = foodEntry.servingSize / 100;
  return nutrient.value * multiplier;
};

export const calculateNutrientSummary = (
  foodEntries: FoodEntry[]
): NutrientSummary => {
  return foodEntries.reduce(
    (summary, entry) => ({
      calories: summary.calories + getNutrientValue(entry, NUTRIENT_IDS.ENERGY),
      carbs: summary.carbs + getNutrientValue(entry, NUTRIENT_IDS.CARBS),
      protein: summary.protein + getNutrientValue(entry, NUTRIENT_IDS.PROTEIN),
      fat: summary.fat + getNutrientValue(entry, NUTRIENT_IDS.FAT),
      fiber: summary.fiber + getNutrientValue(entry, NUTRIENT_IDS.FIBER),
      sugar: summary.sugar + getNutrientValue(entry, NUTRIENT_IDS.SUGAR),
    }),
    {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
    }
  );
};

export const formatNutrientValue = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals);
};
