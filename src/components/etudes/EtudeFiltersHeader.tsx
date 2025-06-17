'use client';

import { useMemo } from 'react';
import { useFiltersStore } from '@/store/filtersStore';
import {
  techniqueCategories,
  composersWithVolumes,
  allVolumes,
} from '@/data/sidebarData';

interface FilterTag {
  type: 'technique' | 'composer' | 'volume' | 'search';
  id: string;
  name: string;
  category?: string;
}

const EtudeFiltersHeader: React.FC = () => {
  const {
    selectedTechniqueIds,
    selectedComposerIds,
    selectedVolumeIds,
    searchTechniqueIds,
    searchComposerIds,
    searchVolumeIds,
    previewVolumeId,
    previewTechniqueId,
    previewComposerId,
    isPreviewing,
  } = useFiltersStore();

  const activeTags = useMemo((): FilterTag[] => {
    const tags: FilterTag[] = [];

    // Add technique filters (combining permanent selections with hovered preview)
    const activeTechniqueIds = Array.from(
      new Set([
        ...selectedTechniqueIds,
        ...(previewTechniqueId ? [previewTechniqueId] : []),
      ])
    );

    activeTechniqueIds.forEach((techId) => {
      // Find technique name from categories
      for (const category of techniqueCategories) {
        const technique = category.techniques.find((t) => t.id === techId);
        if (technique) {
          tags.push({
            type: 'technique',
            id: techId,
            name: technique.name,
            category: category.title,
          });
          break;
        }
      }
    });

    // Add search technique filters
    searchTechniqueIds.forEach((techId) => {
      // Avoid duplicates from selected techniques
      if (!activeTechniqueIds.includes(techId)) {
        for (const category of techniqueCategories) {
          const technique = category.techniques.find((t) => t.id === techId);
          if (technique) {
            tags.push({
              type: 'search',
              id: techId,
              name: technique.name,
              category: `${category.title} (Search)`,
            });
            break;
          }
        }
      }
    });

    // Add composer filter (permanent selection takes precedence, otherwise hovered preview)
    const activeComposerId =
      selectedComposerIds.length > 0
        ? selectedComposerIds[0]
        : previewComposerId || null;

    if (activeComposerId) {
      const composer = composersWithVolumes.find(
        (c) => c.id === activeComposerId
      );
      if (composer) {
        tags.push({
          type: 'composer',
          id: activeComposerId,
          name: composer.name,
        });
      }
    }

    // Add search composer filters
    searchComposerIds.forEach((composerId) => {
      if (composerId !== activeComposerId) {
        const composer = composersWithVolumes.find((c) => c.id === composerId);
        if (composer) {
          tags.push({
            type: 'search',
            id: composerId,
            name: `${composer.name} (Search)`,
          });
        }
      }
    });

    // Add volume filter (permanent selection takes precedence, otherwise hovered preview)
    const activeVolumeId =
      selectedVolumeIds.length > 0
        ? selectedVolumeIds[0]
        : previewVolumeId || null;

    // Only show volume filter if no composer filter is active or if we have an explicit volume selection
    const shouldShowVolume =
      activeVolumeId &&
      (selectedVolumeIds.length > 0 || previewVolumeId || !activeComposerId);

    if (shouldShowVolume) {
      const volume = allVolumes.find((v) => v.id === activeVolumeId);
      if (volume) {
        tags.push({
          type: 'volume',
          id: activeVolumeId,
          name: volume.name,
        });
      }
    }

    // Add search volume filters
    searchVolumeIds.forEach((volumeId) => {
      if (volumeId !== activeVolumeId) {
        const volume = allVolumes.find((v) => v.id === volumeId);
        if (volume) {
          tags.push({
            type: 'search',
            id: volumeId,
            name: `${volume.name} (Search)`,
          });
        }
      }
    });

    return tags;
  }, [
    selectedTechniqueIds,
    selectedComposerIds,
    selectedVolumeIds,
    searchTechniqueIds,
    searchComposerIds,
    searchVolumeIds,
    previewVolumeId,
    previewTechniqueId,
    previewComposerId,
    isPreviewing,
  ]);

  // Don't show header if no filters are active
  if (activeTags.length === 0) {
    return null;
  }

  return (
    <div className="etude-filters-header">
      <div className="filters-label">Showing etudes for:</div>
      <div className="filter-tags">
        {activeTags.map((tag) => (
          <div
            key={`${tag.type}-${tag.id}`}
            className={`filter-tag filter-tag-${tag.type}`}
            title={tag.category || tag.name}
          >
            {tag.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EtudeFiltersHeader;
