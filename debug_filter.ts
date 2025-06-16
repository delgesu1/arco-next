import { allEtudes } from './src/data/legacyMockData';

const slug = (t: string) =>
  t
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

const selectedTechniqueIds = ['dotted-rhythms', 'minor-scales-one-octave'];
const selectedComposerIds: string[] = [];

const composerFilter =
  selectedComposerIds.length > 0 ? selectedComposerIds[0] : null;

const filtered = allEtudes.filter((etude) => {
  if (composerFilter && slug(etude.composer) !== composerFilter) {
    return false;
  }

  if (selectedTechniqueIds.length > 0) {
    const etudeTechniqueIds = etude.techniques.map(slug);
    const hasAll = selectedTechniqueIds.every((selId) =>
      etudeTechniqueIds.includes(selId)
    );
    if (!hasAll) return false;
  }
  return true;
});

console.log('Filtered length', filtered.length);
