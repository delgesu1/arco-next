// app/etude/[id]/page.tsx

interface EtudeDetailPageProps {
  params: {
    id: string;
  };
}

export default function EtudeDetailPage({ params }: EtudeDetailPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Etude Detail Page</h1>
      <p>
        Displaying sheet music for Etude ID:{' '}
        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
          {params.id}
        </span>
      </p>
      {/* Placeholder for PDF viewer component */}
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-md">
        <p className="text-center text-gray-500">
          PDF Viewer Placeholder for Etude {params.id}
        </p>
      </div>
    </div>
  );
}
