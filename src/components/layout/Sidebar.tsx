'use client';

import { useState, useEffect } from 'react';
import { useFiltersStore } from '../../store/filtersStore';
// NEW: Import data from sidebarData.ts
import { techniqueCategories, composers } from '../../data/sidebarData';

export default function Sidebar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [techniquesExpanded, setTechniquesExpanded] = useState(true);
  const [composersExpanded, setComposersExpanded] = useState(true);

  const { selectedTechniqueIds, selectedComposerIds, actions } =
    useFiltersStore();

  const {
    toggleTechniqueSelection,
    toggleComposerSelection,
    setHoveredTechnique,
    setHoveredComposer,
    clearAllSelections,
  } = actions;

  const totalSelected =
    selectedTechniqueIds.length + selectedComposerIds.length;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleTechniques = () => {
    setTechniquesExpanded(!techniquesExpanded);
  };

  const toggleComposers = () => {
    setComposersExpanded(!composersExpanded);
  };

  return (
    <>
      {isMinimized ? (
        /* Minimized state - show only a small expand button */
        <button
          className="sidebar-expand-btn left"
          title="Show Filters"
          onClick={toggleMinimize}
        >
          <i className="fas fa-angle-right" aria-hidden="true"></i>
        </button>
      ) : (
        /* Full sidebar */
        <aside className="sidebar left-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Filters</h2>
            <button
              className="minimize-btn"
              title="Minimize"
              onClick={toggleMinimize}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          </div>
          <div className="sidebar-content">
            {hasMounted ? (
              <>
                {/* Techniques Filter */}
                <div className="filter-section">
                  <div
                    className="section-header"
                    onClick={() => setTechniquesExpanded(!techniquesExpanded)}
                  >
                    <h3 className="section-title">Techniques</h3>
                    <button
                      className="section-toggle"
                      aria-expanded={techniquesExpanded}
                      aria-label={
                        techniquesExpanded
                          ? 'Collapse techniques'
                          : 'Expand techniques'
                      }
                    >
                      <i className="fas fa-chevron-down"></i>
                    </button>
                  </div>

                  {techniquesExpanded && (
                    <div className="section-content">
                      {techniqueCategories.map((category) => (
                        <div key={category.title} className="technique-section">
                          <h4 className="section-title">{category.title}</h4>
                          <div className="technique-tags">
                            {category.techniques.map((technique) => (
                              <button
                                key={technique.id}
                                className={`technique-tag ${selectedTechniqueIds.includes(technique.id) ? 'selected' : ''}`}
                                onClick={() =>
                                  toggleTechniqueSelection(technique.id)
                                }
                              >
                                {technique.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Composers Filter */}
                <div className="filter-section">
                  <div
                    className="section-header"
                    onClick={() => setComposersExpanded(!composersExpanded)}
                  >
                    <h3 className="section-title">Composers</h3>
                    <button
                      className="section-toggle"
                      aria-expanded={composersExpanded}
                      aria-label={
                        composersExpanded
                          ? 'Collapse composers'
                          : 'Expand composers'
                      }
                    >
                      <i className="fas fa-chevron-down"></i>
                    </button>
                  </div>

                  {composersExpanded && (
                    <div className="section-content">
                      <div className="technique-tags">
                        {composers.map((composer) => (
                          <button
                            key={composer.id}
                            className={`technique-tag ${selectedComposerIds.includes(composer.id) ? 'selected' : ''}`}
                            onClick={() => toggleComposerSelection(composer.id)}
                          >
                            {composer.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Clear Filters */}
                {totalSelected > 0 && (
                  <button
                    onClick={clearAllSelections}
                    className="clear-filters-btn"
                    title="Clear all filters"
                  >
                    Clear All ({totalSelected})
                  </button>
                )}
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
