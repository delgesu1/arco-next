'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface PdfViewerProps {
  pdfUrl: string;
  title?: string;
}

export default function PdfViewer({ pdfUrl, title }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please try again.');
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(2.0, prev + 0.2));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.2));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  return (
    <div className="pdf-viewer-container">
      {/* PDF Viewer Header */}
      <div className="pdf-viewer-header">
        <div className="pdf-title">
          <h2>{title || 'Sheet Music'}</h2>
        </div>

        <div className="pdf-controls">
          {/* Navigation Controls */}
          <div className="pdf-nav-controls">
            <button
              className="pdf-control-btn"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              title="Previous page"
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <span className="pdf-page-info">
              Page {pageNumber} of {numPages}
            </span>

            <button
              className="pdf-control-btn"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              title="Next page"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="pdf-zoom-controls">
            <button
              className="pdf-control-btn"
              onClick={zoomOut}
              disabled={scale <= 0.5}
              title="Zoom out"
            >
              <i className="fas fa-minus"></i>
            </button>

            <button
              className="pdf-control-btn"
              onClick={resetZoom}
              title="Reset zoom"
            >
              {Math.round(scale * 100)}%
            </button>

            <button
              className="pdf-control-btn"
              onClick={zoomIn}
              disabled={scale >= 2.0}
              title="Zoom in"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="pdf-viewer-content">
        {loading && (
          <div className="pdf-loading">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading sheet music...</p>
          </div>
        )}

        {error && (
          <div className="pdf-error">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="pdf-loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading document...</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              loading={
                <div className="pdf-page-loading">
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
              }
            />
          </Document>
        )}
      </div>
    </div>
  );
}
