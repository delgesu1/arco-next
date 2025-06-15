// /Volumes/M2 SSD/DEV/arco-next/src/components/etudes/EtudeCard.tsx
import Image from 'next/image'; // Using next/image for optimization

interface EtudeCardProps {
  id: number | string;
  title: string;
  composer: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string; // Allow string for flexibility
  thumbnailUrl: string; // e.g., '/images/etudes/rode-01.png'
  // Add any other props that might be necessary, like onClick handlers
  onClick?: () => void;
}

const EtudeCard: React.FC<EtudeCardProps> = ({
  id,
  title,
  composer,
  difficulty,
  thumbnailUrl,
  onClick,
}) => {
  // The data-attributes are useful for potential JS interactions or more specific CSS if needed
  return (
    <div
      className="sheet-item"
      data-id={id}
      data-title={title}
      data-composer={composer}
      data-difficulty={difficulty}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick();
            }
          : undefined
      }
    >
      <div className="sheet-thumbnail">
        {/* Using a placeholder color if no image is provided, or you can use next/image */}
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={`${title} by ${composer} thumbnail`}
            width={285}
            height={150}
            layout="responsive"
            style={{ objectFit: 'cover' }} // Ensures image covers the area
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '150px',
              backgroundColor: '#555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            No Image
          </div>
        )}
      </div>
      <div className="sheet-info">
        <div className="sheet-title">{title}</div>
        <div className="sheet-composer">{composer}</div>
        <div
          className={`sheet-difficulty sheet-difficulty-${difficulty.toLowerCase()}`}
        >
          {difficulty}
        </div>
      </div>
    </div>
  );
};

export default EtudeCard;
