'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { etudes, Etude } from '@/data/etudesData'; // Import Etude type
import PdfViewer from '@/components/pdf/PdfViewer';
import { useChatStore } from '@/store/chatStore';

export default function EtudePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [etude, setEtude] = useState<Etude | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startNewChat = useChatStore((state) => state.actions.startNewChat);

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

  const handleGetHelp = () => {
    if (etude && etude.techniques && etude.techniques.length > 0) {
      const techniquesText = etude.techniques.join(', ');
      const prompt = `Please help me with ${techniquesText}.`;
      startNewChat(prompt);
    } else {
      // Fallback if no techniques are available
      startNewChat(`Please help me with ${etude?.title || 'this etude'}.`);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-6 py-8">
        {/* Premium Header Section */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/20 border border-gray-100 p-8 mb-8">
          <div className="flex items-start justify-between">
            {/* Left Section - Etude Info */}
            <div className="flex-1">
              <button
                onClick={() => router.back()}
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-all duration-200 mb-6 -ml-1"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors duration-200">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </div>
                <span>Back to Etudes</span>
              </button>

              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                  {etude.title}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                  <p className="text-lg font-medium text-slate-600">
                    {etude.composer}
                  </p>
                </div>
                {etude.techniques && etude.techniques.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {etude.techniques.slice(0, 3).map((technique, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50"
                      >
                        {technique}
                      </span>
                    ))}
                    {etude.techniques.length > 3 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                        +{etude.techniques.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Action Button */}
            <div className="flex-shrink-0 ml-8">
              <button
                onClick={handleGetHelp}
                className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center w-5 h-5">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <span>Get AI Help</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </div>
          </div>
        </div>

        <main>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <PdfViewer
              pdfUrl={pdfUrl}
              title={`${etude.title} - ${etude.composer}`}
            />
          </div>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Details
            </h2>
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
    </div>
  );
}
