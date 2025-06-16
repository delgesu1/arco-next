'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { etudes, Etude } from '@/data/etudesData'; // Import Etude type
import PdfViewer from '@/components/pdf/PdfViewer';

export default function EtudePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [etude, setEtude] = useState<Etude | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // The id from params is a string. The id from data can be string or number.
    // So, we compare them as strings to be safe.
    const foundEtude = etudes.find((e) => e.id.toString() === id);

    if (foundEtude) {
      setEtude(foundEtude);
    } else {
      setError('Etude not found.');
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading etude...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!etude) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Etude not found.</div>
      </div>
    );
  }

  // Use the placeholder PDF for all etudes, as originally requested.
  const pdfUrl = '/etudepdfs/rode-01.pdf';

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm font-medium shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back</span>
        </button>
        <h1 className="text-4xl font-bold text-gray-800">{etude.title}</h1>
        <p className="text-lg text-gray-600">Composer: {etude.composer}</p>
      </header>

      <main>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <PdfViewer
            pdfUrl={pdfUrl}
            title={`${etude.title} - ${etude.composer}`}
          />
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Details</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            {etude.description && (
              <p className="text-gray-800">
                <span className="font-semibold">Description:</span>{' '}
                {etude.description}
              </p>
            )}
            {etude.difficulty && (
              <p className="text-gray-800 mt-2">
                <span className="font-semibold">Difficulty:</span>{' '}
                {etude.difficulty}
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
