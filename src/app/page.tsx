'use client';

import EtudeList from '@/components/etudes/EtudeList'; // Import EtudeList

import { useEffect } from 'react';
import { useFiltersActions } from '@/store/filtersStore';

export default function Home() {
  const { clearAllSelections } = useFiltersActions();

  // Clear any persisted selections on first load to ensure correct hover previews
  useEffect(() => {
    clearAllSelections();
  }, [clearAllSelections]);
  return (
    <>
      {/* 
        You might want to conditionally show the "Welcome" message 
        only if no filters are selected and thus no etudes are to be shown.
        For now, let's assume EtudeList will handle its own empty state 
        if no etudes match filters (though currently it shows all mock data).
      */}

      {/* <div className="empty-state text-center py-10">
        <i className="fas fa-music text-4xl text-gray-400 mb-4"></i>
        <h3 className="text-2xl font-semibold mb-2">
          Welcome to Arco (Next.js)
        </h3>
        <p className="text-gray-600">
          Search for techniques or select from the sidebar to get started with
          your practice session.
        </p>
      </div> */}

      {/* Replace the placeholder with the EtudeList component */}
      <EtudeList />
    </>
  );
}
