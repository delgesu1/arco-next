// /Volumes/M2 SSD/DEV/arco-next/src/components/etudes/EtudeList.tsx
'use client'; // If we add interactivity like filtering/sorting later

import EtudeCard from './EtudeCard';
import { etudes, Etude } from '@/data/etudesData'; // Assuming etudesData.ts is in src/data
import { useState, useEffect } from 'react'; // For potential client-side filtering/state

// You might want to fetch this data or pass it as props in a real app
// For now, we use the imported mock data.

const EtudeList: React.FC = () => {
  // const [filteredEtudes, setFilteredEtudes] = useState<Etude[]>(etudes);

  // Example: onClick handler for a card
  const handleCardClick = (etude: Etude) => {
    console.log('Clicked etude:', etude.title);
    // Here you could navigate to a detail page, open a modal, etc.
    // For example: router.push(`/etudes/${etude.id}`);
  };

  if (!etudes || etudes.length === 0) {
    return (
      <div
        className="empty-state"
        style={
          {
            /* Replicate .empty-state styles from globals.css or add them here */
          }
        }
      >
        <i
          className="fas fa-music"
          style={{ fontSize: '3rem', marginBottom: '1rem' }}
        ></i>
        <h3>No Etudes Available</h3>
        <p>Please check back later or try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="sheet-music-grid">
      {etudes.map((etude) => (
        <EtudeCard
          key={etude.id}
          id={etude.id}
          title={etude.title}
          composer={etude.composer}
          difficulty={etude.difficulty}
          thumbnailUrl={etude.thumbnailUrl}
          onClick={() => handleCardClick(etude)}
        />
      ))}
    </div>
  );
};

export default EtudeList;
