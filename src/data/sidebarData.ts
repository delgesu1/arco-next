// /Volumes/M2 SSD/DEV/arco-next/src/data/sidebarData.ts
import {
  transformedTechniqueCategories,
  transformedComposers,
  volumes,
} from './legacyMockData';

export interface Technique {
  id: string;
  name: string;
  description?: string; // Keep for potential future use with techniqueDatabaseFlat
}

export interface TechniqueCategory {
  id: string;
  title: string;
  techniques: Technique[];
}

export interface Composer {
  id: string;
  name: string;
}

export interface Volume {
  id: string;
  name: string;
  composerId: string;
  composer: string;
}

export interface ComposerWithVolumes extends Composer {
  volumes: Volume[];
}

// Volumes list re-export
export const allVolumes: Volume[] = volumes;

// Composers including their volumes
export const composersWithVolumes: ComposerWithVolumes[] =
  transformedComposers.map((c) => ({
    ...c,
    volumes: volumes.filter((v) => v.composerId === c.id),
  }));

// Export the transformed data from legacyMockData.ts
export const techniqueCategories: TechniqueCategory[] =
  transformedTechniqueCategories;
export const composers: Composer[] = transformedComposers;

// Optional: If you want to also export the flat list of techniques with descriptions for other UI parts
// import { rawTechniqueDatabaseFlat } from './legacyMockData';
// export const allTechniquesWithDetails = rawTechniqueDatabaseFlat;
