import Image from 'next/image';

export default function Home() {
  return (
    <div className="content-body" id="mainContent">
      <div className="empty-state text-center py-10">
        <i className="fas fa-music text-4xl text-gray-400 mb-4"></i>
        <h3 className="text-2xl font-semibold mb-2">
          Welcome to Arco (Next.js)
        </h3>
        <p className="text-gray-600">
          Search for techniques or select from the sidebar to get started with
          your practice session.
        </p>
      </div>
      <div id="etudeGridPlaceholder" className="mt-8">
        {/* Placeholder for where the etude grid will be rendered */}
        <p className="text-center text-gray-500">
          Etude grid will appear here.
        </p>
      </div>
    </div>
  );
}
