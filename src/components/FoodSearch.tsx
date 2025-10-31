import { useState } from 'react';
import { USDAService } from '../services/usda';
import type { Food, FoodEntry } from '../types';
import { storage } from '../utils/storage';

interface FoodSearchProps {
  onFoodAdded?: () => void;
}

export const FoodSearch = ({ onFoodAdded }: FoodSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [servingSize, setServingSize] = useState('100');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchResult = await USDAService.searchFoods(query, 1, 20);
      setResults(searchResult.foods);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Failed to search foods. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = () => {
    if (!selectedFood) return;

    const entry: FoodEntry = {
      id: Date.now().toString(),
      food: selectedFood,
      servingSize: parseFloat(servingSize),
      servingUnit: 'g',
      timestamp: new Date(),
      mealType,
    };

    storage.saveFoodEntry(entry);
    setSelectedFood(null);
    setServingSize('100');
    setQuery('');
    setResults([]);
    onFoodAdded?.();
    alert('Food added successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Search Foods</h2>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for foods..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {results.length > 0 && !selectedFood && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <h3 className="font-semibold text-lg mb-2">Search Results:</h3>
          {results.map((food) => (
            <div
              key={food.fdcId}
              onClick={() => setSelectedFood(food)}
              className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <div className="font-medium">{food.description}</div>
              {food.brandOwner && (
                <div className="text-sm text-gray-600">{food.brandOwner}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedFood && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Add Food Entry</h3>
          <div className="mb-3">
            <div className="font-medium">{selectedFood.description}</div>
            {selectedFood.brandOwner && (
              <div className="text-sm text-gray-600">{selectedFood.brandOwner}</div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serving Size (grams)
              </label>
              <input
                type="number"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
                min="1"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal Type
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddFood}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Food
              </button>
              <button
                onClick={() => setSelectedFood(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
