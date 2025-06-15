// app/etude/[id]/page.tsx

import { etudes } from '@/data/etudesData';
import PdfViewer from '@/components/pdf/PdfViewer';
import { notFound } from 'next/navigation';

interface EtudeDetailPageProps {
  params: {
    id: string;
  };
}

export default function EtudeDetailPage({ params }: EtudeDetailPageProps) {
  // Find the etude by ID
  const etude = etudes.find((e) => e.id.toString() === params.id);

  // If etude not found, show 404
  if (!etude) {
    notFound();
  }

  return (
    <div className="etude-detail-page">
      {/* Page Header */}
      <div className="etude-detail-header">
        <div className="etude-info">
          <h1 className="etude-title">{etude.title}</h1>
          <p className="etude-composer">by {etude.composer}</p>
          <div className="etude-meta">
            <span
              className={`difficulty-badge ${etude.difficulty.toLowerCase()}`}
            >
              {etude.difficulty}
            </span>
            <div className="etude-techniques">
              {etude.techniques.map((technique, index) => (
                <span key={index} className="technique-tag">
                  {technique}
                </span>
              ))}
            </div>
          </div>
          {etude.description && (
            <p className="etude-description">{etude.description}</p>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="etude-pdf-container">
        <PdfViewer
          pdfUrl={etude.pdfUrl}
          title={`${etude.title} - ${etude.composer}`}
        />
      </div>
    </div>
  );
}
