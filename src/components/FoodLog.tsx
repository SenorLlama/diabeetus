import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { FoodEntry } from '../types';
import { storage } from '../utils/storage';
import { calculateNutrientSummary, formatNutrientValue } from '../utils/nutrients';

interface FoodLogProps {
  refreshTrigger?: number;
}

export const FoodLog = ({ refreshTrigger }: FoodLogProps) => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    loadEntries();
  }, [selectedDate, refreshTrigger]);

  const loadEntries = () => {
    const allEntries = storage.getFoodEntries();
    const filtered = allEntries.filter(
      (entry) => format(entry.timestamp, 'yyyy-MM-dd') === selectedDate
    );
    // Sort by timestamp descending
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setEntries(filtered);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      storage.deleteFoodEntry(id);
      loadEntries();
    }
  };

  const summary = calculateNutrientSummary(entries);

  const groupedEntries = entries.reduce((acc, entry) => {
    const meal = entry.mealType;
    if (!acc[meal]) {
      acc[meal] = [];
    }
    acc[meal].push(entry);
    return acc;
  }, {} as Record<string, FoodEntry[]>);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Food Log</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {entries.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Daily Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Calories:</span>{' '}
              <span className="font-semibold">{formatNutrientValue(summary.calories, 0)} kcal</span>
            </div>
            <div>
              <span className="text-gray-600">Carbs:</span>{' '}
              <span className="font-semibold">{formatNutrientValue(summary.carbs)} g</span>
            </div>
            <div>
              <span className="text-gray-600">Protein:</span>{' '}
              <span className="font-semibold">{formatNutrientValue(summary.protein)} g</span>
            </div>
            <div>
              <span className="text-gray-600">Fat:</span>{' '}
              <span className="font-semibold">{formatNutrientValue(summary.fat)} g</span>
            </div>
            <div>
              <span className="text-gray-600">Fiber:</span>{' '}
              <span className="font-semibold">{formatNutrientValue(summary.fiber)} g</span>
            </div>
            <div>
              <span className="text-gray-600">Sugar:</span>{' '}
              <span className="font-semibold">{formatNutrientValue(summary.sugar)} g</span>
            </div>
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No food entries for this date.</p>
      ) : (
        <div className="space-y-6">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => {
            const mealEntries = groupedEntries[mealType] || [];
            if (mealEntries.length === 0) return null;

            return (
              <div key={mealType}>
                <h3 className="font-semibold text-lg mb-2 capitalize">{mealType}</h3>
                <div className="space-y-2">
                  {mealEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium">{entry.food.description}</div>
                          <div className="text-sm text-gray-600">
                            {entry.servingSize}g • {format(entry.timestamp, 'h:mm a')}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="ml-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
