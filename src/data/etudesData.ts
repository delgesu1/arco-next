// /Volumes/M2 SSD/DEV/arco-next/src/data/etudesData.ts
export interface Etude {
  id: number | string;
  title: string;
  composer: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  techniques: string[];
  description: string;
  thumbnailUrl: string; // Path relative to the public folder e.g., /images/etudes/kreutzer-1.png
}

export const etudes: Etude[] = [
  {
    id: 1,
    title: 'Etude No. 1',
    composer: 'Kreutzer',
    difficulty: 'Intermediate',
    techniques: ['Detache', 'Major Scales (One Octave)', 'Basic Rhythms'],
    description: 'Focuses on Detache and Major Scales.',
    thumbnailUrl: '/images/etudes/rode-01.png', // Placeholder - replace with actual image path
  },
  {
    id: 2,
    title: 'Etude No. 2',
    composer: 'Kreutzer',
    difficulty: 'Advanced',
    techniques: ['Spiccato', 'Chromatic Scale', 'Shifting'],
    description: 'An advanced etude focusing on Spiccato.',
    thumbnailUrl: '/images/etudes/rode-01.png', // Placeholder
  },
  {
    id: 3,
    title: 'Etude No. 1',
    composer: 'Rode',
    difficulty: 'Advanced',
    techniques: ['Staccato', 'Double Stops'],
    description: 'Advanced etude by Rode.',
    thumbnailUrl: '/images/etudes/rode-01.png', // Placeholder
  },
  {
    id: 4,
    title: 'Op. 35, Etude 5',
    composer: 'Dont',
    difficulty: 'Intermediate',
    techniques: ['Legato', 'Finger Dexterity'],
    description: 'Intermediate etude by Dont.',
    thumbnailUrl: '/images/etudes/rode-01.png', // Placeholder
  },
];
