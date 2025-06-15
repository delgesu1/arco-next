// /Volumes/M2 SSD/DEV/arco-next/src/data/sidebarData.ts

export interface Technique {
  id: string; // Usually a slug-like version of the name or a unique ID
  name: string;
  // Add description if needed for tooltips or future previews directly from sidebar
  // description?: string;
}

export interface TechniqueCategory {
  id: string; // e.g., 'scales-arpeggios'
  title: string; // e.g., 'Scales & Arpeggios'
  techniques: Technique[];
}

export const techniqueCategories: TechniqueCategory[] = [
  {
    id: 'scales-arpeggios',
    title: 'Scales & Arpeggios',
    techniques: [
      { id: 'major-scales-one-octave', name: 'Major Scales (One Octave)' },
      { id: 'minor-scales-one-octave', name: 'Minor Scales (One Octave)' },
      {
        id: 'major-arpeggios-one-octave',
        name: 'Major Arpeggios (One Octave)',
      },
      {
        id: 'chromatic-scale-one-octave',
        name: 'Chromatic Scale (One Octave)',
      },
      { id: 'two-octave-major-scales', name: 'Two Octave Major Scales' },
      { id: 'scales-in-thirds', name: 'Scales in Thirds' },
    ],
  },
  {
    id: 'bowing-techniques',
    title: 'Bowing Techniques',
    techniques: [
      { id: 'detache', name: 'Detache' },
      { id: 'legato', name: 'Legato' },
      { id: 'staccato', name: 'Staccato' },
      { id: 'spiccato', name: 'Spiccato' },
      { id: 'martele', name: 'Martelé' }, // Corrected accent
      { id: 'ricochet', name: 'Ricochet' },
    ],
  },
  {
    id: 'left-hand-techniques',
    title: 'Left Hand Techniques',
    techniques: [
      { id: 'finger-dexterity', name: 'Finger Dexterity' },
      { id: 'shifting-positions-1-3', name: 'Shifting (Positions 1-3)' },
      { id: 'vibrato-introduction', name: 'Vibrato (Introduction)' },
      { id: 'double-stops-basic', name: 'Double Stops (Basic)' },
      { id: 'trills', name: 'Trills' },
      { id: 'pizzicato-left-hand', name: 'Pizzicato (Left Hand)' },
    ],
  },
  // Add other categories as needed from your original techniqueDatabase
];

export interface Composer {
  id: string; // e.g., 'kreutzer'
  name: string; // e.g., 'Kreutzer'
}

export const composers: Composer[] = [
  { id: 'kreutzer', name: 'Kreutzer' },
  { id: 'rode', name: 'Rode' },
  { id: 'dont', name: 'Dont' },
  { id: 'fiorillo', name: 'Fiorillo' },
  { id: 'gavinies', name: 'Gaviniès' }, // Corrected accent
  { id: 'mazas', name: 'Mazas' },
  { id: 'campagnoli', name: 'Campagnoli' },
  { id: 'wieniawski', name: 'Wieniawski' },
  { id: 'paganini', name: 'Paganini' },
  { id: 'sevcik', name: 'Sevcik' }, // Corrected accent
];
