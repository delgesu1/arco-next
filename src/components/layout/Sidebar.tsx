'use client';

import { useState, useEffect, useRef } from 'react';
import { useFiltersStore } from '../../store/filtersStore';
// NEW: Import data from sidebarData.ts
import {
  techniqueCategories,
  composersWithVolumes,
} from '../../data/sidebarData';

export default function Sidebar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [techniquesExpanded, setTechniquesExpanded] = useState(true);
  const [showFloatingComposers, setShowFloatingComposers] = useState(false);

  const composersSectionRef = useRef<HTMLDivElement>(null);
  const sidebarAsideRef = useRef<HTMLElement>(null); // New ref for the <aside> element
  const sidebarContentRef = useRef<HTMLDivElement>(null);

  const {
    selectedTechniqueIds,
    selectedComposerIds,
    selectedVolumeIds,
    searchTechniqueIds,
    searchComposerIds,
    searchVolumeIds,
    actions,
  } = useFiltersStore();

  const {
    toggleTechniqueSelection,
    toggleComposerSelection,
    toggleVolumeSelection,
    setHoveredTechnique,
    setHoveredComposer,
    setHoveredVolume,
    clearAllSelections,
  } = actions;

  const totalSelected =
    selectedTechniqueIds.length +
    selectedComposerIds.length +
    selectedVolumeIds.length;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Scroll detection for floating composers preview
  useEffect(() => {
    const handleScroll = () => {
      if (
        !composersSectionRef.current ||
        !sidebarAsideRef.current ||
        isMinimized
      ) {
        return;
      }

      const sidebarAside = sidebarAsideRef.current; // Correctly assign sidebarAside
      const composersSection = composersSectionRef.current;

      const sidebarAsideRect = sidebarAside.getBoundingClientRect();
      const composersRect = composersSection.getBoundingClientRect();

      // Show floating preview if composers section is below the visible area
      const floatingTitleHeight = 44; // Approximate height of the floating title
      const floatingTitleTopEdge =
        sidebarAsideRect.bottom - floatingTitleHeight;
      const showFloating = composersRect.top > floatingTitleTopEdge;
      setShowFloatingComposers(showFloating); // This line correctly sets the state based on new logic
    };

    const sidebarContent = sidebarContentRef.current;
    if (sidebarContent) {
      sidebarContent.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check

      return () => {
        sidebarContent.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isMinimized, hasMounted]);

  const scrollToComposers = () => {
    if (composersSectionRef.current && sidebarContentRef.current) {
      const sidebarContent = sidebarContentRef.current;
      const composersSection = composersSectionRef.current;

      const targetPosition = composersSection.offsetTop - 20; // 20px padding from top
      sidebarContent.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Render floating composers preview
  // Hide floating composers title when search filters are active
  const isSearchActive =
    searchTechniqueIds.length > 0 ||
    searchComposerIds.length > 0 ||
    searchVolumeIds.length > 0;

  const renderFloatingComposersPreview = () => {
    if (isSearchActive) return null; // do not show in filtered search view
    if (!showFloatingComposers || isMinimized) return null;

    return (
      <div className="floating-composers-title">
        <h3 className="section-title" onClick={scrollToComposers}>
          Composers
        </h3>
      </div>
    );
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
        <aside ref={sidebarAsideRef} className="sidebar left-sidebar">
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
          <div className="sidebar-content" ref={sidebarContentRef}>
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
                            {category.techniques
                              .filter(
                                (technique) =>
                                  searchTechniqueIds.length === 0 ||
                                  searchTechniqueIds.includes(technique.id)
                              )
                              .map((technique) => (
                                <button
                                  key={technique.id}
                                  className={`technique-tag ${selectedTechniqueIds.includes(technique.id) ? 'selected' : ''}`}
                                  onClick={() =>
                                    toggleTechniqueSelection(technique.id)
                                  }
                                  onMouseEnter={() =>
                                    setHoveredTechnique(technique.id)
                                  }
                                  onMouseLeave={() => setHoveredTechnique(null)}
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

                {/* Composers & Volumes Filter */}
                <div className="filter-section" ref={composersSectionRef}>
                  <div className="section-header">
                    <h3 className="section-title">Composers</h3>
                  </div>

                  <div className="section-content">
                    <div className="composers-list">
                      {composersWithVolumes
                        .filter(
                          (composer) =>
                            searchComposerIds.length === 0 ||
                            searchComposerIds.includes(composer.id)
                        )
                        .map((composer) => (
                          <div
                            key={composer.id}
                            className="composer-group"
                            style={{ marginBottom: '1.5rem' }}
                          >
                            {/* Composer Button */}
                            <div
                              className={`composer-heading ${selectedComposerIds.includes(composer.id) ? 'selected' : ''}`}
                              onClick={() =>
                                toggleComposerSelection(composer.id)
                              }
                              onMouseEnter={() =>
                                setHoveredComposer(composer.id)
                              }
                              onMouseLeave={() => setHoveredComposer(null)}
                            >
                              <div className="composer-name-row">
                                <span className="composer-name">
                                  {composer.name}
                                </span>
                                <span className="composer-vol-count">
                                  {composer.volumes.length} vol
                                  {composer.volumes.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                              {selectedComposerIds.includes(composer.id) && (
                                <div className="composer-selected-indicator"></div>
                              )}
                            </div>

                            {/* Volumes - Always Visible */}
                            {composer.volumes.length > 0 && (
                              <div
                                className="technique-tags"
                                style={{
                                  marginTop: '0.75rem',
                                  marginLeft: '1rem',
                                  gap: '0.5rem',
                                }}
                              >
                                {composer.volumes.map((vol) => (
                                  <div
                                    key={vol.id}
                                    className={`technique-tag volume-button ${selectedVolumeIds.includes(vol.id) ? 'selected' : ''}`}
                                    onClick={() =>
                                      toggleVolumeSelection(vol.id, composer.id)
                                    }
                                    onMouseEnter={() =>
                                      setHoveredVolume(vol.id, composer.id)
                                    }
                                    onMouseLeave={() => setHoveredVolume(null)}
                                    style={{
                                      fontSize: '0.75rem',
                                      padding: '0.375rem 0.75rem',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {vol.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
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

          {/* Floating Composers Preview - positioned relative to sidebar container */}
          {renderFloatingComposersPreview()}
        </aside>
      )}
    </>
  );
}
