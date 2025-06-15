'use client'; // May need client-side interactions later

import React from 'react';

interface TechniqueTagProps {
  id: string;
  name: string;
  isSelected: boolean;
  onClick: (id: string) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: () => void;
}

const TechniqueTag: React.FC<TechniqueTagProps> = ({
  id,
  name,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <button
      className={`technique-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(id)}
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={onMouseLeave}
      type="button" // Explicitly set type for button
    >
      {name}
      <span className="selected-indicator"></span>{' '}
      {/* Indicator dot, styled by CSS */}
    </button>
  );
};

export default TechniqueTag;
