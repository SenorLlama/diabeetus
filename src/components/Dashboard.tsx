import { useState, useEffect } from 'react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { storage } from '../utils/storage';
import { calculateNutrientSummary } from '../utils/nutrients';

interface DashboardProps {
  refreshTrigger?: number;
}

export const Dashboard = ({ refreshTrigger }: DashboardProps) => {
  const [days] = useState(7); // Show last 7 days
  const [chartData, setChartData] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [days, refreshTrigger]);

  const loadData = () => {
    const allBloodSugar = storage.getBloodSugarEntries();
    const allFood = storage.getFoodEntries();

    // Prepare chart data for the last N days
    const data = [];
    const newInsights: string[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const dayBloodSugar = allBloodSugar.filter(
        (entry) => entry.timestamp >= dayStart && entry.timestamp <= dayEnd
      );

      const dayFood = allFood.filter(
        (entry) => entry.timestamp >= dayStart && entry.timestamp <= dayEnd
      );

      const avgBloodSugar =
        dayBloodSugar.length > 0
          ? dayBloodSugar.reduce((sum, entry) => sum + entry.level, 0) / dayBloodSugar.length
          : null;

      const nutrients = calculateNutrientSummary(dayFood);

      data.push({
        date: format(date, 'MMM dd'),
        bloodSugar: avgBloodSugar ? parseFloat(avgBloodSugar.toFixed(1)) : null,
        carbs: nutrients.carbs > 0 ? parseFloat(nutrients.carbs.toFixed(1)) : null,
        calories: nutrients.calories > 0 ? parseFloat(nutrients.calories.toFixed(0)) : null,
      });
    }

    setChartData(data);

    // Generate insights
    const recentBloodSugar = allBloodSugar
      .filter((entry) => entry.timestamp >= subDays(new Date(), 7))
      .map((entry) => entry.level);

    if (recentBloodSugar.length > 0) {
      const avgRecent = recentBloodSugar.reduce((a, b) => a + b, 0) / recentBloodSugar.length;
      const highReadings = recentBloodSugar.filter((level) => level > 140).length;
      const lowReadings = recentBloodSugar.filter((level) => level < 70).length;

      newInsights.push(
        `Your average blood sugar over the last 7 days is ${avgRecent.toFixed(1)} mg/dL.`
      );

      if (highReadings > 0) {
        newInsights.push(
          `You had ${highReadings} high reading${highReadings > 1 ? 's' : ''} (>140 mg/dL) in the past week.`
        );
      }

      if (lowReadings > 0) {
        newInsights.push(
          `You had ${lowReadings} low reading${lowReadings > 1 ? 's' : ''} (<70 mg/dL) in the past week. Consider adjusting your diet or medication.`
        );
      }

      if (avgRecent >= 70 && avgRecent <= 140 && highReadings === 0 && lowReadings === 0) {
        newInsights.push('Great job! Your blood sugar levels have been in the normal range.');
      }
    }

    // Food insights
    const recentFood = allFood.filter((entry) => entry.timestamp >= subDays(new Date(), 7));
    if (recentFood.length > 0) {
      const totalNutrients = calculateNutrientSummary(recentFood);
      const avgDailyCarbs = totalNutrients.carbs / 7;
      const avgDailyCalories = totalNutrients.calories / 7;

      newInsights.push(
        `Your average daily intake is ${avgDailyCalories.toFixed(0)} calories and ${avgDailyCarbs.toFixed(0)}g carbs.`
      );

      if (avgDailyCarbs > 200) {
        newInsights.push(
          'Consider reducing carbohydrate intake to help manage blood sugar levels.'
        );
      }

      const carbRatio = (totalNutrients.carbs / totalNutrients.calories) * 4 * 100; // 4 cal per gram
      if (carbRatio > 50) {
        newInsights.push(
          'Your diet is high in carbohydrates. Try incorporating more protein and healthy fats.'
        );
      }
    }

    if (newInsights.length === 0) {
      newInsights.push('Start tracking your food and blood sugar to see insights here!');
    }

    setInsights(newInsights);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">7-Day Trends</h2>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Blood Sugar Levels</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 200]} label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="bloodSugar"
                stroke="#3b82f6"
                name="Avg Blood Sugar"
                strokeWidth={2}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Carbohydrate Intake</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'grams', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="carbs"
                stroke="#10b981"
                name="Carbs (g)"
                strokeWidth={2}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Insights & Recommendations</h2>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm">{insight}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold mb-2">Tips for Managing Blood Sugar</h3>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>Eat protein and healthy fats with carbohydrates to slow sugar absorption</li>
            <li>Choose complex carbs (whole grains, vegetables) over simple sugars</li>
            <li>Exercise regularly to improve insulin sensitivity</li>
            <li>Monitor blood sugar before and 1-2 hours after meals to understand food impact</li>
            <li>Stay hydrated and get adequate sleep</li>
            <li>Work with your healthcare provider to establish personalized targets</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
