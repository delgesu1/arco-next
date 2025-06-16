// /Volumes/M2 SSD/DEV/arco-next/src/components/etudes/EtudeList.tsx
'use client'; // If we add interactivity like filtering/sorting later

import EtudeCard from './EtudeCard';
import { useState, useEffect, useRef } from 'react';
import { useFiltersStore } from '@/store/filtersStore';
import { etudes, Etude } from '@/data/etudesData';
import { allVolumes } from '@/data/sidebarData'; // Assuming etudesData.ts is in src/data
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { slugify } from '@/utils/slugify';

const EtudeList: React.FC = () => {
  const router = useRouter();

  const {
    selectedTechniqueIds,
    selectedComposerIds,
    searchTechniqueIds,
    searchComposerIds,
    selectedVolumeIds,
    searchVolumeIds,
    previewVolumeId,
    isPreviewing,
    previewTechniqueId,
    previewComposerId,
  } = useFiltersStore();

  // Compute filtered etudes whenever selections change
  const filteredEtudes = useMemo(() => {
    // If no search filters, no selections, and not previewing → show nothing
    if (
      !isPreviewing &&
      searchTechniqueIds.length === 0 &&
      searchComposerIds.length === 0 &&
      searchVolumeIds.length === 0 &&
      selectedTechniqueIds.length === 0 &&
      selectedComposerIds.length === 0
    ) {
      return [];
    }
    // Base filter from search arrays
    const baseEtudes = etudes.filter((etude) => {
      // technique match (any one match)
      if (searchTechniqueIds.length > 0) {
        const etTechIds = etude.techniques.map((t) => slugify(t));
        if (!etTechIds.some((id) => searchTechniqueIds.includes(id)))
          return false;
      }
      // volume match first
      if (searchVolumeIds.length > 0) {
        if (!searchVolumeIds.includes(etude.volumeId)) return false;
      }
      // composer match
      if (searchComposerIds.length > 0) {
        if (!searchComposerIds.includes(slugify(etude.composer))) return false;
      }
      return true;
    });

    // Determine criteria based on whether we're in preview mode
    // Determine active technique filters
    const isTechniquePreview = isPreviewing && !!previewTechniqueId;
    const isVolumeOrComposerPreview =
      isPreviewing && (!!previewVolumeId || !!previewComposerId);

    const activeTechniqueIds = isTechniquePreview
      ? [previewTechniqueId!]
      : isVolumeOrComposerPreview
        ? [] // Ignore technique selections when previewing by composer or volume
        : selectedTechniqueIds;

    const isVolumePreview = isPreviewing && !!previewVolumeId;
    const isComposerPreview = isPreviewing && !!previewComposerId;

    let volumeFilter: string | null = null;
    if (isVolumePreview) {
      volumeFilter = previewVolumeId!;
    } else if (selectedVolumeIds.length > 0) {
      volumeFilter = selectedVolumeIds[0];
    }

    let composerFilter: string | null = null;
    if (isComposerPreview) {
      composerFilter = previewComposerId!;
    } else if (selectedComposerIds.length > 0) {
      composerFilter = selectedComposerIds[0];
    }

    // If we're previewing a composer or just have a composer selection without an explicit volume preview/selection, ignore volume filter
    if (
      (isComposerPreview && !isVolumePreview) ||
      (selectedComposerIds.length > 0 && selectedVolumeIds.length === 0)
    ) {
      volumeFilter = null;
    }

    return baseEtudes.filter((etude) => {
      // Volume match
      if (volumeFilter && etude.volumeId !== volumeFilter) {
        return false;
      }
      // Composer match
      if (composerFilter && slugify(etude.composer) !== composerFilter) {
        return false;
      }
      // Technique match: every activeTechniqueIds element must exist in etude techniques
      if (activeTechniqueIds.length > 0) {
        const etudeTechniqueIds = etude.techniques.map((tech) => slugify(tech));
        const hasAll = activeTechniqueIds.every((selId) =>
          etudeTechniqueIds.includes(selId)
        );
        if (!hasAll) return false;
      }
      return true;
    });
  }, [
    searchTechniqueIds,
    searchComposerIds,
    searchVolumeIds,
    selectedTechniqueIds,
    selectedComposerIds,
    selectedVolumeIds,
    isPreviewing,
    previewTechniqueId,
    previewComposerId,
    previewVolumeId,
  ]);

  // Example: onClick handler for a card
  const handleCardClick = (etude: Etude) => {
    console.log('Navigating to etude:', etude.title);
    // Navigate to the individual etude page
    router.push(`/etude/${etude.id}`);
  };

  // Fade animation with content swap after fade-out
  const FADE_MS = 200; // duration for each phase
  const [fade, setFade] = useState(false);
  const [displayedEtudes, setDisplayedEtudes] =
    useState<Etude[]>(filteredEtudes);
  const prevKeyRef = useRef<string>(
    filteredEtudes.map((e: Etude) => e.id).join(',')
  );
  const currentKey = filteredEtudes.map((e: Etude) => e.id).join(',');

  useEffect(() => {
    if (currentKey === prevKeyRef.current) {
      // If content hasn't changed, ensure fade resets
      if (fade) setFade(false);
      return; // no data change
    }

    setFade(true); // begin fade-out
    const t = setTimeout(() => {
      setDisplayedEtudes(filteredEtudes); // swap content while invisible
      setFade(false); // fade back in
      prevKeyRef.current = currentKey;
    }, FADE_MS);

    return () => clearTimeout(t);
  }, [currentKey, filteredEtudes]);

  const isEmpty = displayedEtudes.length === 0;

  return (
    <div
      style={{ opacity: fade ? 0 : 1, transition: `opacity ${FADE_MS}ms ease` }}
    >
      {isEmpty ? (
        <div className="empty-state">
          <i
            className="fas fa-music"
            style={{ fontSize: '3rem', marginBottom: '1rem' }}
          ></i>
          <h3>No Etudes Available</h3>
          <p>Please check back later or try adjusting your filters.</p>
        </div>
      ) : (
        <div className="sheet-music-grid">
          {displayedEtudes.map((etude) => (
            <EtudeCard
              key={etude.id}
              id={etude.id}
              title={etude.title}
              composer={etude.composer}
              difficulty={etude.difficulty}
              thumbnailUrl={etude.thumbnailUrl}
              volumeName={
                allVolumes.find((v) => v.id === etude.volumeId)?.name || ''
              }
              onClick={() => handleCardClick(etude)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EtudeList;
