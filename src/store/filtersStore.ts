import { create } from 'zustand';
import { techniqueCategories, composers } from '@/data/sidebarData';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FiltersState {
  // Persistent selections (user clicks)
  selectedTechniqueIds: string[];
  selectedComposerIds: string[];
  selectedVolumeIds: string[];
  // Temporary hover preview
  hoveredTechniqueId: string | null;
  hoveredComposerId: string | null;
  hoveredVolumeId: string | null;
  previewTechniqueId: string | null;
  previewComposerId: string | null;
  previewVolumeId: string | null;
  // Search-driven filter (LLM output) – NOT visually selected
  searchTechniqueIds: string[];
  searchComposerIds: string[];
  searchVolumeIds: string[];
  // Whether the list is currently showing a hover preview
  isPreviewing: boolean;
  actions: {
    toggleTechniqueSelection: (id: string) => void;
    toggleComposerSelection: (id: string) => void;
    toggleVolumeSelection: (volumeId: string, composerId: string) => void;
    setHoveredVolume: (id: string | null, composerId?: string | null) => void;
    setHoveredTechnique: (id: string | null) => void;
    setHoveredComposer: (id: string | null) => void;
    applySearchQuery: (query: string) => void;
    clearAllSelections: () => void;
  };
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      selectedTechniqueIds: [],
      selectedComposerIds: [],
      selectedVolumeIds: [], // NEW
      searchTechniqueIds: [],
      searchComposerIds: [],
      searchVolumeIds: [], // NEW
      hoveredTechniqueId: null,
      hoveredComposerId: null,
      hoveredVolumeId: null,
      previewTechniqueId: null,
      previewComposerId: null,
      previewVolumeId: null,
      isPreviewing: false,
      actions: {
        toggleTechniqueSelection: (id) =>
          set((state) => {
            const isCurrentlySelected = state.selectedTechniqueIds.includes(id);
            let newSelectedTechniqueIds = [...state.selectedTechniqueIds];

            if (isCurrentlySelected) {
              newSelectedTechniqueIds = state.selectedTechniqueIds.filter(
                (techId) => techId !== id
              );
            } else {
              if (state.selectedTechniqueIds.length < 3) {
                newSelectedTechniqueIds.push(id);
              } else {
                console.warn('Technique selection limit (3) reached.');
              }
            }
            return {
              isPreviewing: false,
              previewTechniqueId: null,
              previewComposerId: null,
              previewVolumeId: null,
              selectedTechniqueIds: newSelectedTechniqueIds,
            };
          }),
        toggleVolumeSelection: (volumeId, composerId) =>
          set((state) => {
            const isSelected = state.selectedVolumeIds.includes(volumeId);
            return {
              selectedVolumeIds: isSelected ? [] : [volumeId],
              // Keep composer selection; ensure composer is selected when volume first picked
              selectedComposerIds: isSelected
                ? state.selectedComposerIds
                : [composerId],
              isPreviewing: false,
              previewVolumeId: null,
              previewComposerId: null,
              previewTechniqueId: null,
            };
          }),

        toggleComposerSelection: (id) =>
          set((state) => {
            let newSelectedComposerIds: string[] = [];
            const isCurrentlySelected = state.selectedComposerIds.includes(id);

            if (isCurrentlySelected) {
              newSelectedComposerIds = [];
            } else {
              newSelectedComposerIds = [id];
            }
            return {
              isPreviewing: false,
              previewTechniqueId: null,
              previewComposerId: null,
              previewVolumeId: null,
              selectedComposerIds: newSelectedComposerIds,
              selectedVolumeIds: [], // Clear volume selection when a composer is toggled
            };
          }),
        setHoveredTechnique: (id) => {
          set((state) => {
            if (id === null) {
              const hasSelection =
                state.selectedTechniqueIds.length > 0 ||
                state.selectedComposerIds.length > 0 ||
                state.selectedVolumeIds.length > 0;
              if (hasSelection) {
                // Revert to base selection – clear preview
                return {
                  hoveredTechniqueId: null,
                  isPreviewing: false,
                  previewTechniqueId: null,
                  previewComposerId: null,
                  previewVolumeId: null,
                };
              }
              // No selection – keep sticky preview, just clear hover highlight
              return { hoveredTechniqueId: null };
            }
            // Mouse enter
            // If 3 technique tags are already selected and the hovered tag is not one of them, ignore preview.
            if (
              state.selectedTechniqueIds.length >= 3 &&
              !state.selectedTechniqueIds.includes(id)
            ) {
              return {
                hoveredTechniqueId: id,
              };
            }
            return {
              hoveredTechniqueId: id,
              isPreviewing: true,
              previewTechniqueId: id,
              previewComposerId: null, // Clear other previews
              previewVolumeId: null,
            };
          });
        },
        setHoveredComposer: (composerId: string | null) => {
          set((state) => {
            if (composerId === null) {
              const hasSelection =
                state.selectedTechniqueIds.length > 0 ||
                state.selectedComposerIds.length > 0 ||
                state.selectedVolumeIds.length > 0;
              if (hasSelection) {
                return {
                  hoveredComposerId: null,
                  isPreviewing: false,
                  previewTechniqueId: null,
                  previewComposerId: null,
                  previewVolumeId: null,
                };
              }
              return { hoveredComposerId: null };
            }
            // Mouse enter
            // If a composer or volume is already permanently selected, ignore hover previews for other composers.
            if (
              state.selectedComposerIds.length > 0 ||
              state.selectedVolumeIds.length > 0
            ) {
              return { hoveredComposerId: composerId };
            }
            return {
              isPreviewing: true,
              previewComposerId: composerId,
              previewVolumeId: null, // Clear volume preview when hovering a composer
              previewTechniqueId: null, // Clear technique preview when hovering a composer
              hoveredComposerId: composerId,
              hoveredVolumeId: null, // Clear volume hover highlight
            };
          });
        },
        setHoveredVolume: (
          volumeId: string | null,
          parentComposerId?: string | null
        ) => {
          set((state) => {
            if (volumeId === null) {
              const hasSelection =
                state.selectedTechniqueIds.length > 0 ||
                state.selectedComposerIds.length > 0 ||
                state.selectedVolumeIds.length > 0;
              if (hasSelection) {
                return {
                  hoveredVolumeId: null,
                  isPreviewing: false,
                  previewTechniqueId: null,
                  previewComposerId: null,
                  previewVolumeId: null,
                };
              }
              // Keep sticky preview when no selection
              return { hoveredVolumeId: null };
            }
            // Mouse enter
            // If a composer or volume is already permanently selected, ignore hover previews for other volumes.
            if (
              state.selectedComposerIds.length > 0 ||
              state.selectedVolumeIds.length > 0
            ) {
              return {
                hoveredVolumeId: volumeId,
                hoveredComposerId: parentComposerId || null,
              };
            }
            return {
              isPreviewing: true,
              previewVolumeId: volumeId,
              previewComposerId: parentComposerId || null,
              previewTechniqueId: null, // Clear technique preview when hovering a volume
              hoveredVolumeId: volumeId,
              hoveredComposerId: parentComposerId || null, // Highlight parent composer as well
            };
          });
        },
        applySearchQuery: (query: string) => {
          if (!query.trim()) {
            set({
              searchTechniqueIds: [],
              searchComposerIds: [],
              searchVolumeIds: [],
            });
            return;
          }
          const flatTechniques = techniqueCategories.flatMap((cat) =>
            cat.techniques.map((t) => t.id)
          );
          const shuffled = [...flatTechniques].sort(() => 0.5 - Math.random());
          const selectedTechniqueIds = shuffled.slice(0, 3);
          const selectedComposerIds = composers.length
            ? [composers[Math.floor(Math.random() * composers.length)].id]
            : [];

          set({
            searchTechniqueIds: selectedTechniqueIds,
            searchComposerIds: selectedComposerIds,
            // Clear all hover and preview states on new search
            hoveredTechniqueId: null,
            hoveredComposerId: null,
            hoveredVolumeId: null,
            previewTechniqueId: null,
            previewComposerId: null,
            previewVolumeId: null,
            isPreviewing: false,
          });
        },
        clearAllSelections: () =>
          set({
            selectedTechniqueIds: [],
            selectedComposerIds: [],
            selectedVolumeIds: [],
            searchTechniqueIds: [],
            searchComposerIds: [],
            searchVolumeIds: [],
            hoveredTechniqueId: null,
            hoveredComposerId: null,
            hoveredVolumeId: null,
            previewTechniqueId: null,
            previewComposerId: null,
            previewVolumeId: null, // Ensure this is cleared
            isPreviewing: false,
          }),
      },
    }),
    {
      name: 'arco-filters-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        selectedTechniqueIds: state.selectedTechniqueIds,
        selectedComposerIds: state.selectedComposerIds,
        selectedVolumeIds: state.selectedVolumeIds,
        // DO NOT persist hovered states or preview states
      }),
    }
  )
);

// Export actions separately for easier usage if preferred, or use store.getState().actions
export const useFiltersActions = () =>
  useFiltersStore((state) => state.actions);
