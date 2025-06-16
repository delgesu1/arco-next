// /Volumes/M2 SSD/DEV/arco-next/src/data/etudesData.ts
import { allEtudes as importedEtudes } from './legacyMockData';

export interface Volume {
  id: string;
  name: string;
  composerId: string;
}

export interface Etude {
  volumeId: string; // NEW: belongs to a volume
  id: number | string;
  title: string;
  composer: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  techniques: string[];
  description: string;
  thumbnailUrl: string; // Path relative to the public folder e.g., /images/etudes/kreutzer-1.png
  pdfUrl: string; // Path to the PDF file
}

export const etudes: Etude[] = importedEtudes;
