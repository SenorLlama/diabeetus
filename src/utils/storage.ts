import type { FoodEntry, BloodSugarEntry } from '../types';

const FOOD_ENTRIES_KEY = 'diabeetus_food_entries';
const BLOOD_SUGAR_ENTRIES_KEY = 'diabeetus_blood_sugar_entries';

export const storage = {
  // Food entries
  getFoodEntries: (): FoodEntry[] => {
    const data = localStorage.getItem(FOOD_ENTRIES_KEY);
    if (!data) return [];
    const entries = JSON.parse(data);
    // Convert timestamp strings back to Date objects
    return entries.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  },

  saveFoodEntry: (entry: FoodEntry): void => {
    const entries = storage.getFoodEntries();
    entries.push(entry);
    localStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(entries));
  },

  deleteFoodEntry: (id: string): void => {
    const entries = storage.getFoodEntries().filter((entry) => entry.id !== id);
    localStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(entries));
  },

  updateFoodEntry: (id: string, updatedEntry: FoodEntry): void => {
    const entries = storage.getFoodEntries().map((entry) =>
      entry.id === id ? updatedEntry : entry
    );
    localStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(entries));
  },

  // Blood sugar entries
  getBloodSugarEntries: (): BloodSugarEntry[] => {
    const data = localStorage.getItem(BLOOD_SUGAR_ENTRIES_KEY);
    if (!data) return [];
    const entries = JSON.parse(data);
    // Convert timestamp strings back to Date objects
    return entries.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  },

  saveBloodSugarEntry: (entry: BloodSugarEntry): void => {
    const entries = storage.getBloodSugarEntries();
    entries.push(entry);
    localStorage.setItem(BLOOD_SUGAR_ENTRIES_KEY, JSON.stringify(entries));
  },

  deleteBloodSugarEntry: (id: string): void => {
    const entries = storage.getBloodSugarEntries().filter((entry) => entry.id !== id);
    localStorage.setItem(BLOOD_SUGAR_ENTRIES_KEY, JSON.stringify(entries));
  },

  updateBloodSugarEntry: (id: string, updatedEntry: BloodSugarEntry): void => {
    const entries = storage.getBloodSugarEntries().map((entry) =>
      entry.id === id ? updatedEntry : entry
    );
    localStorage.setItem(BLOOD_SUGAR_ENTRIES_KEY, JSON.stringify(entries));
  },

  // Clear all data
  clearAll: (): void => {
    localStorage.removeItem(FOOD_ENTRIES_KEY);
    localStorage.removeItem(BLOOD_SUGAR_ENTRIES_KEY);
  },
};
