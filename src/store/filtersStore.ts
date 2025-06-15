import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FiltersState {
  selectedTechniqueIds: string[];
  selectedComposerIds: string[];
  hoveredTechniqueId: string | null; // For UI cues on the tag itself
  hoveredComposerId: string | null; // For UI cues on the filter itself
  previewTechniqueId: string | null; // ID of technique to preview in main content
  previewComposerId: string | null; // ID of composer to preview in main content
  isPreviewing: boolean; // True if main content should reflect a hover preview
  actions: {
    toggleTechniqueSelection: (id: string) => void;
    toggleComposerSelection: (id: string) => void;
    setHoveredTechnique: (id: string | null) => void;
    setHoveredComposer: (id: string | null) => void;
    clearAllSelections: () => void;
  };
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set, get) => ({
      selectedTechniqueIds: [],
      selectedComposerIds: [],
      hoveredTechniqueId: null,
      hoveredComposerId: null,
      previewTechniqueId: null,
      previewComposerId: null,
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
                // MODIFIED: Limit to 3 techniques
                newSelectedTechniqueIds.push(id);
              } else {
                // Optionally, provide feedback to the user that the limit is reached
                // For now, just don't add if limit is reached
                console.warn('Technique selection limit (3) reached.');
              }
            }
            // Clicking a filter cancels any active preview
            return {
              isPreviewing: false,
              previewTechniqueId: null,
              previewComposerId: null,
              selectedTechniqueIds: newSelectedTechniqueIds,
            };
          }),
        toggleComposerSelection: (id) =>
          set((state) => {
            let newSelectedComposerIds: string[] = []; // MODIFIED: Start with empty array for single select logic

            const isCurrentlySelected = state.selectedComposerIds.includes(id);

            if (isCurrentlySelected) {
              // If it's selected, clicking it again deselects it (resulting in an empty array)
              newSelectedComposerIds = [];
            } else {
              // If it's not selected, it becomes the only selected composer (max 1)
              newSelectedComposerIds = [id];
            }
            // Clicking a filter cancels any active preview
            return {
              isPreviewing: false,
              previewTechniqueId: null,
              previewComposerId: null,
              selectedComposerIds: newSelectedComposerIds,
            };
          }),
        setHoveredTechnique: (id) => {
          const { selectedTechniqueIds, selectedComposerIds } = get();
          const hasPersistentSelections =
            selectedTechniqueIds.length > 0 || selectedComposerIds.length > 0;

          if (id === null) {
            // Mouse leave
            set({
              hoveredTechniqueId: null,
              isPreviewing: false,
              // previewTechniqueId will be cleared by the component that was previewing, or simply ignored if isPreviewing is false
            });
          } else {
            // Mouse enter
            let shouldActivatePreview =
              !hasPersistentSelections || selectedTechniqueIds.includes(id);
            if (shouldActivatePreview) {
              set({
                hoveredTechniqueId: id,
                isPreviewing: true,
                previewTechniqueId: id,
                previewComposerId: null,
              });
            } else {
              // Persistent selections exist, and hovering a NEW item: only update hoverId for tag UI, don't change preview state
              set({ hoveredTechniqueId: id });
            }
          }
        },
        setHoveredComposer: (id) => {
          const { selectedTechniqueIds, selectedComposerIds } = get();
          const hasPersistentSelections =
            selectedTechniqueIds.length > 0 || selectedComposerIds.length > 0;

          if (id === null) {
            // Mouse leave
            set({
              hoveredComposerId: null,
              isPreviewing: false,
              // previewComposerId will be cleared or ignored
            });
          } else {
            // Mouse enter
            let shouldActivatePreview =
              !hasPersistentSelections || selectedComposerIds.includes(id);
            if (shouldActivatePreview) {
              set({
                hoveredComposerId: id,
                isPreviewing: true,
                previewComposerId: id,
                previewTechniqueId: null,
              });
            } else {
              set({ hoveredComposerId: id });
            }
          }
        },
        clearAllSelections: () =>
          set({
            selectedTechniqueIds: [],
            selectedComposerIds: [],
            hoveredTechniqueId: null, // Also clear hover states
            hoveredComposerId: null,
            previewTechniqueId: null,
            previewComposerId: null,
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
        // DO NOT persist hovered states or preview states
      }),
    }
  )
);

// Export actions separately for easier usage if preferred, or use store.getState().actions
export const useFiltersActions = () =>
  useFiltersStore((state) => state.actions);
