import { allEtudes } from './src/data/legacyMockData';

const slug = (t: string) =>
  t
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

const count = (id: string) =>
  allEtudes.filter((e) => e.techniques.map(slug).includes(id)).length;

console.log('dotted-rhythms', count('dotted-rhythms'));
console.log('minor-scales-one-octave', count('minor-scales-one-octave'));
console.log('scales-in-thirds', count('scales-in-thirds'));
