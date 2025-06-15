'use client';

import { useState, useEffect } from 'react';
import { useFiltersStore } from '../../store/filtersStore';

export default function SelectionCounter() {
  const [hasMounted, setHasMounted] = useState(false);

  const { selectedTechniqueIds, selectedComposerIds, actions } =
    useFiltersStore();
  const { clearAllSelections } = actions;

  const totalSelected =
    selectedTechniqueIds.length + selectedComposerIds.length;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || totalSelected === 0) {
    return null;
  }

  return (
    <div className="selection-counter visible">
      <span id="selectionText" className="text-sm font-medium">
        {totalSelected} filter{totalSelected === 1 ? '' : 's'} selected
      </span>
      <button
        id="clearSelectionsBtn"
        title="Clear all filters"
        className="clear-filters-btn"
        onClick={clearAllSelections}
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
}
