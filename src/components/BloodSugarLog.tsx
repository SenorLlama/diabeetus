import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { BloodSugarEntry } from '../types';
import { storage } from '../utils/storage';

interface BloodSugarLogProps {
  refreshTrigger?: number;
}

export const BloodSugarLog = ({ refreshTrigger }: BloodSugarLogProps) => {
  const [entries, setEntries] = useState<BloodSugarEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    loadEntries();
  }, [selectedDate, refreshTrigger]);

  const loadEntries = () => {
    const allEntries = storage.getBloodSugarEntries();
    const filtered = allEntries.filter(
      (entry) => format(entry.timestamp, 'yyyy-MM-dd') === selectedDate
    );
    // Sort by timestamp descending
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setEntries(filtered);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      storage.deleteBloodSugarEntry(id);
      loadEntries();
    }
  };

  const getStatusColor = (level: number): string => {
    if (level < 70) return 'bg-red-100 border-red-300 text-red-800';
    if (level <= 140) return 'bg-green-100 border-green-300 text-green-800';
    if (level <= 180) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    return 'bg-red-100 border-red-300 text-red-800';
  };

  const getStatusText = (level: number): string => {
    if (level < 70) return 'Low';
    if (level <= 140) return 'Normal';
    if (level <= 180) return 'Elevated';
    return 'High';
  };

  const averageLevel = entries.length > 0
    ? entries.reduce((sum, entry) => sum + entry.level, 0) / entries.length
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Blood Sugar Log</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {entries.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Daily Summary</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Average:</span>{' '}
              <span className="font-semibold">{averageLevel.toFixed(1)} mg/dL</span>
            </div>
            <div>
              <span className="text-gray-600">Readings:</span>{' '}
              <span className="font-semibold">{entries.length}</span>
            </div>
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No blood sugar entries for this date.</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`p-4 border rounded-lg ${getStatusColor(entry.level)}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold">{entry.level}</span>
                    <span className="text-sm">mg/dL</span>
                    <span className="text-xs font-semibold px-2 py-1 bg-white rounded">
                      {getStatusText(entry.level)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div>{format(entry.timestamp, 'h:mm a')}</div>
                    {entry.context && (
                      <div className="capitalize text-gray-700 mt-1">
                        {entry.context.replace('-', ' ')}
                      </div>
                    )}
                    {entry.notes && (
                      <div className="text-gray-700 mt-2 italic">
                        Note: {entry.notes}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="ml-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded bg-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
