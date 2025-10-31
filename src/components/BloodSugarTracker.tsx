import { useState } from 'react';
import type { BloodSugarEntry } from '../types';
import { storage } from '../utils/storage';

interface BloodSugarTrackerProps {
  onEntryAdded?: () => void;
}

export const BloodSugarTracker = ({ onEntryAdded }: BloodSugarTrackerProps) => {
  const [level, setLevel] = useState('');
  const [notes, setNotes] = useState('');
  const [context, setContext] = useState<BloodSugarEntry['context']>('random');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bloodSugarLevel = parseFloat(level);
    if (isNaN(bloodSugarLevel) || bloodSugarLevel <= 0) {
      alert('Please enter a valid blood sugar level.');
      return;
    }

    const entry: BloodSugarEntry = {
      id: Date.now().toString(),
      level: bloodSugarLevel,
      timestamp: new Date(),
      notes: notes.trim() || undefined,
      context,
    };

    storage.saveBloodSugarEntry(entry);
    setLevel('');
    setNotes('');
    setContext('random');
    onEntryAdded?.();
    alert('Blood sugar entry added successfully!');
  };

  const getStatusColor = (value: number): string => {
    if (!value) return 'text-gray-600';
    if (value < 70) return 'text-red-600';
    if (value <= 140) return 'text-green-600';
    if (value <= 180) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusText = (value: number): string => {
    if (!value) return '';
    if (value < 70) return 'Low';
    if (value <= 140) return 'Normal';
    if (value <= 180) return 'Elevated';
    return 'High';
  };

  const currentLevel = parseFloat(level);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Log Blood Sugar</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Blood Sugar Level (mg/dL)
          </label>
          <input
            type="number"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            min="1"
            step="0.1"
            placeholder="e.g., 110"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {currentLevel > 0 && (
            <p className={`text-sm mt-1 font-semibold ${getStatusColor(currentLevel)}`}>
              {getStatusText(currentLevel)} - {currentLevel} mg/dL
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Context
          </label>
          <select
            value={context}
            onChange={(e) => setContext(e.target.value as BloodSugarEntry['context'])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="random">Random</option>
            <option value="fasting">Fasting (before breakfast)</option>
            <option value="before-meal">Before Meal</option>
            <option value="after-meal">After Meal (1-2 hours)</option>
            <option value="bedtime">Bedtime</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Entry
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Blood Sugar Guidelines (mg/dL)</h3>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Fasting (before eating):</span>
            <span className="font-medium">70-100</span>
          </div>
          <div className="flex justify-between">
            <span>Before meals:</span>
            <span className="font-medium">70-130</span>
          </div>
          <div className="flex justify-between">
            <span>2 hours after meals:</span>
            <span className="font-medium">&lt; 140</span>
          </div>
          <div className="flex justify-between">
            <span>Bedtime:</span>
            <span className="font-medium">100-140</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          * These are general guidelines. Consult your healthcare provider for personalized targets.
        </p>
      </div>
    </div>
  );
};
