import { useState } from 'react';
import { FoodSearch } from './components/FoodSearch';
import { FoodLog } from './components/FoodLog';
import { BloodSugarTracker } from './components/BloodSugarTracker';
import { BloodSugarLog } from './components/BloodSugarLog';
import { Dashboard } from './components/Dashboard';

type Tab = 'dashboard' | 'food' | 'blood-sugar';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Diabeetus Tracker</h1>
          <p className="text-blue-100 mt-1">Track your food and blood sugar levels</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('food')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'food'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Food Tracking
            </button>
            <button
              onClick={() => setActiveTab('blood-sugar')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'blood-sugar'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Blood Sugar
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard refreshTrigger={refreshTrigger} />}

        {activeTab === 'food' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FoodSearch onFoodAdded={handleDataChange} />
            <FoodLog refreshTrigger={refreshTrigger} />
          </div>
        )}

        {activeTab === 'blood-sugar' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BloodSugarTracker onEntryAdded={handleDataChange} />
            <BloodSugarLog refreshTrigger={refreshTrigger} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Track your nutrition and blood sugar levels to better understand your body.</p>
          <p className="mt-2">
            Data powered by <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">USDA FoodData Central</a>
          </p>
          <p className="mt-2 text-xs text-gray-500">
            This app is for informational purposes only. Always consult with your healthcare provider.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
