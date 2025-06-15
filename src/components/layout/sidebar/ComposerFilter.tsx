'use client'; // May need client-side interactions later

import React from 'react';

interface ComposerFilterProps {
  id: string;
  name: string;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
  // Add count display later
}

const ComposerFilter: React.FC<ComposerFilterProps> = ({
  id,
  name,
  isSelected,
  onToggleSelection,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className={`technique-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onToggleSelection(id)}
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={onMouseLeave}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggleSelection(id);
        }
      }}
    >
      <input
        type="checkbox"
        className="sr-only" // Screen-reader only checkbox for accessibility
        checked={isSelected}
        readOnly
        tabIndex={-1}
      />
      <span>{name}</span>
      <span className="selected-indicator"></span>{' '}
      {/* Indicator dot, styled by CSS */}
    </div>
  );
};

export default ComposerFilter;
