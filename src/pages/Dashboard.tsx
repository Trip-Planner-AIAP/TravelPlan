import React from 'react';
import { Header } from '../components/Header';
import { TripGrid } from '../components/TripGrid';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to TripPlanner!</h1>
            <p className="text-gray-600 mt-2">Ready to plan your next adventure?</p>
          </div>
          <TripGrid />
        </div>
      </main>
    </div>
  );
};