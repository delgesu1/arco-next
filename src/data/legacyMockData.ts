import { Etude } from './etudesData'; // Assuming Etude interface is in etudesData.ts
import { slugify } from '@/utils/slugify';

export interface Volume {
  id: string;
  name: string;
  composer: string; // Human name
  composerId: string; // slug of composer
}

import { TechniqueCategory, Composer } from './sidebarData'; // Assuming interfaces are in sidebarData.ts

// --- RAW DATA FROM USER'S OLD APP ---
export const rawTechniqueDatabase = {
  'Scales & Arpeggios': [
    'Major Scales (One Octave)',
    'Minor Scales (One Octave)',
    'Major Arpeggios (One Octave)',
    'Chromatic Scale (One Octave)',
    'Two Octave Major Scales',
    'Scales in Thirds',
  ],
  'Bowing Techniques': [
    'Detache',
    'Legato',
    'Staccato',
    'Spiccato',
    'Martelé',
    'Ricochet',
  ],
  'Left Hand Techniques': [
    'Finger Dexterity',
    'Shifting (Positions 1-3)',
    'Vibrato (Introduction)',
    'Double Stops (Basic)',
    'Trills',
    'Pizzicato (Left Hand)',
  ],
  'Rhythm & Timing': [
    'Basic Rhythms (Quarter, Half, Whole)',
    'Dotted Rhythms',
    'Syncopation (Simple)',
    'Tuplets (Triplets)',
    'Metronome Practice',
  ],
  'Musicality & Expression': [
    'Dynamics (p, mf, f)',
    'Phrasing (Simple Melodies)',
    'Articulation Accents',
    'Basic Music Theory (Key Signatures)',
  ],
};

export const rawComposerDatabase: string[] = [
  'Kreutzer',
  'Rode',
  'Dont',
  'Fiorillo',
  'Gaviniès',
  'Mazas',
  'Campagnoli',
  'Wieniawski',
  'Paganini',
  'Sevcik',
];

export const rawTechniqueDatabaseFlat: {
  name: string;
  category: string;
  description: string;
}[] = [
  {
    name: 'Major Scales (One Octave)',
    category: 'Scales & Arpeggios',
    description:
      'Playing major scales through one octave helps develop finger patterns and intonation.',
  },
  {
    name: 'Minor Scales (One Octave)',
    category: 'Scales & Arpeggios',
    description:
      'Minor scales introduce different tonal colors and fingerings.',
  },
  {
    name: 'Major Arpeggios (One Octave)',
    category: 'Scales & Arpeggios',
    description:
      'Arpeggios outline chords and are crucial for understanding harmony and improving string crossing.',
  },
  {
    name: 'Chromatic Scale (One Octave)',
    category: 'Scales & Arpeggios',
    description:
      'The chromatic scale uses all semitones and is excellent for finger precision and ear training.',
  },
  {
    name: 'Two Octave Major Scales',
    category: 'Scales & Arpeggios',
    description:
      'Extending scales to two octaves requires shifting and consistent tone production across a wider range.',
  },
  {
    name: 'Scales in Thirds',
    category: 'Scales & Arpeggios',
    description:
      'Playing scales in thirds enhances finger coordination and harmonic understanding.',
  },
  {
    name: 'Detache',
    category: 'Bowing Techniques',
    description:
      'A fundamental bowing technique involving separate, smooth bow strokes for each note.',
  },
  {
    name: 'Legato',
    category: 'Bowing Techniques',
    description: 'Connecting multiple notes smoothly in a single bow stroke.',
  },
  {
    name: 'Staccato',
    category: 'Bowing Techniques',
    description:
      'Short, detached bow strokes, creating separation between notes.',
  },
  {
    name: 'Spiccato',
    category: 'Bowing Techniques',
    description:
      'A bouncing bow stroke where the bow naturally lifts off the string between notes.',
  },
  {
    name: 'Martelé',
    category: 'Bowing Techniques',
    description:
      "A 'hammered' stroke with a sharp attack and clear separation.",
  },
  {
    name: 'Ricochet',
    category: 'Bowing Techniques',
    description:
      'A series of rapid, bouncing notes performed in a single down or up bow.',
  },
  {
    name: 'Finger Dexterity',
    category: 'Left Hand Techniques',
    description:
      'Exercises to improve the speed, accuracy, and independence of the left-hand fingers.',
  },
  {
    name: 'Shifting (Positions 1-3)',
    category: 'Left Hand Techniques',
    description:
      'Moving the left hand smoothly between different positions on the fingerboard.',
  },
  {
    name: 'Vibrato (Introduction)',
    category: 'Left Hand Techniques',
    description:
      'A subtle oscillation in pitch to add warmth and expressiveness to the tone.',
  },
  {
    name: 'Double Stops (Basic)',
    category: 'Left Hand Techniques',
    description: 'Playing two notes simultaneously on adjacent strings.',
  },
  {
    name: 'Trills',
    category: 'Left Hand Techniques',
    description: 'Rapid alternation between two adjacent notes.',
  },
  {
    name: 'Pizzicato (Left Hand)',
    category: 'Left Hand Techniques',
    description:
      'Plucking the strings with the left-hand fingers, often used for special effects.',
  },
  {
    name: 'Basic Rhythms (Quarter, Half, Whole)',
    category: 'Rhythm & Timing',
    description:
      'Understanding and accurately playing fundamental note durations.',
  },
  {
    name: 'Dotted Rhythms',
    category: 'Rhythm & Timing',
    description:
      'Rhythms involving notes extended by half their value, creating a characteristic long-short pattern.',
  },
  {
    name: 'Syncopation (Simple)',
    category: 'Rhythm & Timing',
    description: 'Playing notes off the main beat, creating rhythmic interest.',
  },
  {
    name: 'Tuplets (Triplets)',
    category: 'Rhythm & Timing',
    description:
      'Dividing a beat into a different number of equal parts, such as three notes in the space of two.',
  },
  {
    name: 'Metronome Practice',
    category: 'Rhythm & Timing',
    description:
      'Using a metronome to develop a steady sense of time and rhythmic precision.',
  },
  {
    name: 'Dynamics (p, mf, f)',
    category: 'Musicality & Expression',
    description:
      'Controlling the loudness and softness of the music (piano, mezzo-forte, forte).',
  },
  {
    name: 'Phrasing (Simple Melodies)',
    category: 'Musicality & Expression',
    description:
      'Shaping musical sentences to create a coherent and expressive performance.',
  },
  {
    name: 'Articulation Accents',
    category: 'Musicality & Expression',
    description:
      'Emphasizing certain notes to give them prominence or a specific character.',
  },
  {
    name: 'Basic Music Theory (Key Signatures)',
    category: 'Musicality & Expression',
    description:
      'Understanding how key signatures indicate the sharps or flats to be played throughout a piece.',
  },
];

// (slugify is now imported from '@/utils/slugify')

// --- TRANSFORMED DATA FOR SIDEBAR ---
export const transformedTechniqueCategories: TechniqueCategory[] =
  Object.entries(rawTechniqueDatabase).map(([categoryTitle, techniques]) => ({
    id: slugify(categoryTitle),
    title: categoryTitle,
    techniques: techniques.map((techName) => ({
      id: slugify(techName),
      name: techName,
    })),
  }));

export const transformedComposers: Composer[] = rawComposerDatabase.map(
  (composerName) => ({
    id: slugify(composerName),
    name: composerName,
  })
);

// --- VOLUMES ---
export const volumes: Volume[] = [
  // Kreutzer volumes
  {
    id: slugify('42 Etudes'),
    name: '42 Etudes',
    composer: 'Kreutzer',
    composerId: slugify('Kreutzer'),
  },
  {
    id: slugify('20 Concert Studies'),
    name: '20 Concert Studies',
    composer: 'Kreutzer',
    composerId: slugify('Kreutzer'),
  },
  // Rode volumes
  {
    id: slugify('24 Caprices'),
    name: '24 Caprices',
    composer: 'Rode',
    composerId: slugify('Rode'),
  },
  {
    id: slugify('12 Studies'),
    name: '12 Studies',
    composer: 'Rode',
    composerId: slugify('Rode'),
  },
  // Dont volumes
  {
    id: slugify('Op. 35 – 24 Etudes'),
    name: 'Op. 35 – 24 Etudes',
    composer: 'Dont',
    composerId: slugify('Dont'),
  },
  {
    id: slugify('Op. 37 – Preparatory Exercises'),
    name: 'Op. 37 – Preparatory Exercises',
    composer: 'Dont',
    composerId: slugify('Dont'),
  },
];

// Ensure every composer has at least one volume
rawComposerDatabase.forEach((name) => {
  if (!volumes.some((v) => v.composer === name)) {
    volumes.push({
      id: slugify(`${name} Collection`),
      name: `${name} Collection`,
      composer: name,
      composerId: slugify(name),
    });
  }
});

/* ----------------------------------------------------------------
   REALISTIC MOCK ETUDE DATA (generated from the user-provided list)
   ----------------------------------------------------------------*/

interface RealVolumeSpec {
  title: string;
  numEtudes?: number;
  etudeNamePrefix?: string;
  etudes?: string[];
}
interface RealComposerSpec {
  composer: string; // display name (matches sidebar)
  volumes: RealVolumeSpec[];
}

const realisticCatalog: RealComposerSpec[] = [
  {
    composer: 'Kreutzer',
    volumes: [
      {
        title: '42 Études ou Caprices',
        numEtudes: 42,
        etudeNamePrefix: 'Etude No.',
      },
    ],
  },
  {
    composer: 'Rode',
    volumes: [
      {
        title: "24 Caprices en Forme d'Études",
        numEtudes: 24,
        etudeNamePrefix: 'Caprice No.',
      },
      { title: '12 Études', numEtudes: 12, etudeNamePrefix: 'Etude No.' },
    ],
  },
  {
    composer: 'Dont',
    volumes: [
      {
        title: '24 Études et Caprices, Op. 35',
        numEtudes: 24,
        etudeNamePrefix: 'Etude No.',
      },
      {
        title: '24 Etudes, Op. 37',
        numEtudes: 24,
        etudeNamePrefix: 'Etude No.',
      },
    ],
  },
  {
    composer: 'Fiorillo',
    volumes: [
      {
        title: '36 Études ou Caprices',
        numEtudes: 36,
        etudeNamePrefix: 'Caprice No.',
      },
    ],
  },
  {
    composer: 'Gaviniès',
    volumes: [
      { title: '24 Matinées', numEtudes: 24, etudeNamePrefix: 'Matinée No.' },
    ],
  },
  {
    composer: 'Mazas',
    volumes: [
      {
        title: '30 Études Mélodiques et Progressives, Op. 36',
        numEtudes: 30,
        etudeNamePrefix: 'Etude No.',
      },
    ],
  },
  {
    composer: 'Wieniawski',
    volumes: [
      {
        title: "L'École Moderne, Op. 10",
        etudes: [
          'Etude-Caprice No. 1: Le Sautillé',
          'Etude-Caprice No. 2: La Vélocité',
          "Etude-Caprice No. 3: L'Étude", // note the special apostrophe
          'Etude-Caprice No. 4: Le Staccato',
          'Etude-Caprice No. 5: Alla Saltarella',
          'Etude-Caprice No. 6: Prélude',
          'Etude-Caprice No. 7: La Cadenza',
          'Etude-Caprice No. 8: Le Chant du Bivouac',
          'Etude-Caprice No. 9: Les Arpèges',
          'Etude-Caprice No. 10: Exercice en Trilles',
        ],
      },
    ],
  },
  {
    composer: 'Paganini',
    volumes: [
      {
        title: '24 Capricci per Violino Solo, Op. 1',
        numEtudes: 24,
        etudeNamePrefix: 'Caprice No.',
      },
    ],
  },
];

const difficultyPool: Etude['difficulty'][] = [
  'Beginner',
  'Intermediate',
  'Advanced',
];
const techniqueIdPool = transformedTechniqueCategories.flatMap((cat) =>
  cat.techniques.map((t) => t.id)
);
const defaultThumbnail = '/images/etudes/rode-01.png';
const defaultPdf = '/pdfs/placeholder.pdf';

const randomChoice = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randomSample = <T>(arr: T[], n: number): T[] => {
  const copy = [...arr];
  const res: T[] = [];
  while (res.length < n && copy.length) {
    res.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return res;
};

// Helper to ensure we have a Volume entry for each new volume title
const ensureVolumeExists = (title: string, composer: string): string => {
  const id = slugify(title);
  if (!volumes.some((v) => v.id === id)) {
    volumes.push({ id, name: title, composer, composerId: slugify(composer) });
  }
  return id;
};

const generateRealEtudes = (): Etude[] => {
  let idCounter = 1;
  const result: Etude[] = [];

  realisticCatalog.forEach(({ composer, volumes: volSpecs }) => {
    volSpecs.forEach((vs) => {
      const volumeId = ensureVolumeExists(vs.title, composer);

      const titles: string[] = [];
      if (vs.etudes) {
        titles.push(...vs.etudes);
      } else if (vs.numEtudes && vs.etudeNamePrefix) {
        for (let i = 1; i <= vs.numEtudes; i++) {
          titles.push(`${vs.etudeNamePrefix} ${i}`);
        }
      }

      titles.forEach((title) => {
        result.push({
          id: idCounter++,
          title,
          composer,
          volumeId,
          difficulty: randomChoice(difficultyPool),
          techniques: randomSample(
            techniqueIdPool,
            Math.floor(Math.random() * 3) + 1
          ),
          description: '',
          thumbnailUrl: defaultThumbnail,
          pdfUrl: defaultPdf,
        });
      });
    });
  });
  return result;
};

// remove any leftover volumes that are not in our realistic catalog
const allowedVolumeIds = new Set<string>();
realisticCatalog.forEach((rc) =>
  rc.volumes.forEach((v) => allowedVolumeIds.add(slugify(v.title)))
);
for (let i = volumes.length - 1; i >= 0; i--) {
  if (!allowedVolumeIds.has(volumes[i].id)) {
    volumes.splice(i, 1);
  }
}

export const allEtudes: Etude[] = generateRealEtudes();
