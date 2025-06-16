'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker for PDF.js - using CDN for better compatibility
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const PAGE_BASE_WIDTH = 600;
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Memoized options object to avoid unnecessary rerenders in <Document />
  const pdfOptions = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }),
    []
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls after inactivity
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isHovering) {
          setShowControls(false);
        }
      }, 3000);
    };

    const handleMouseMove = () => resetControlsTimeout();
    const handleKeyDown = () => resetControlsTimeout();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    resetControlsTimeout();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isHovering]);

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const newWidth = rect.width - 80; // Account for padding
        setContainerWidth(newWidth);
        // Auto-fit if user hasn't manually zoomed beyond small threshold
        setScale((prev) => {
          const autoScale = Math.max(
            0.5,
            Math.min(3.0, newWidth / PAGE_BASE_WIDTH)
          );
          // If prev differs from autoscale by less than 0.05, treat as auto-fit, else respect manual zoom
          return Math.abs(prev - autoScale) < 0.05 ? autoScale : prev;
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goToPrevPage();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          goToNextPage();
          break;
        case 'Home':
          e.preventDefault();
          setPageNumber(1);
          break;
        case 'End':
          e.preventDefault();
          setPageNumber(numPages);
          break;
        case '=':
        case '+':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          fitToWidth();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [numPages, isFullscreen]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    // Auto-fit to width on load
    setTimeout(() => fitToWidth(), 100);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError(`Failed to load PDF: ${error.message || 'Unknown error'}`);
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(3.0, prev + 0.25));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(0.25, prev - 0.25));
  };

  const fitToWidth = () => {
    // Calculate optimal scale to fit page width
    const optimalScale = containerWidth / PAGE_BASE_WIDTH; // Fit based on container
    setScale(Math.max(0.5, Math.min(2.0, optimalScale)));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${isFullscreen ? 'pdf-viewer-premium fullscreen' : 'pdf-viewer-inline'}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Control Bar - Fixed for inline, Floating for fullscreen */}
      <div
        className={`${isFullscreen ? 'pdf-controls-bar' : 'pdf-toolbar-inline'} ${showControls ? 'visible' : 'hidden'}`}
      >
        <div className="pdf-controls-left">
          <div className="pdf-title-compact">
            <i className="fas fa-file-pdf"></i>
            <span>{title || 'Sheet Music'}</span>
          </div>
        </div>

        <div className="pdf-controls-center">
          <button
            className="pdf-btn pdf-btn-nav"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1 || loading}
            title="Previous page (← or ↑)"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="pdf-page-display">
            <input
              type="number"
              value={pageNumber}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= numPages) {
                  setPageNumber(page);
                }
              }}
              min={1}
              max={numPages}
              className="pdf-page-input"
            />
            <span className="pdf-page-total">/ {numPages}</span>
          </div>

          <button
            className="pdf-btn pdf-btn-nav"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages || loading}
            title="Next page (→ or ↓)"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="pdf-controls-right">
          <button
            className="pdf-btn"
            onClick={zoomOut}
            disabled={scale <= 0.25 || loading}
            title="Zoom out (-)"
          >
            <i className="fas fa-search-minus"></i>
          </button>

          <button
            className="pdf-btn pdf-zoom-display"
            onClick={fitToWidth}
            title="Fit to width (0)"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            className="pdf-btn"
            onClick={zoomIn}
            disabled={scale >= 3.0 || loading}
            title="Zoom in (+)"
          >
            <i className="fas fa-search-plus"></i>
          </button>

          <div className="pdf-controls-divider"></div>

          <button
            className="pdf-btn"
            onClick={toggleFullscreen}
            title="Toggle fullscreen (f)"
          >
            <i
              className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}
            ></i>
          </button>
        </div>
      </div>

      {/* PDF Content Area */}
      <div className="pdf-content-area">
        {loading && (
          <div className="pdf-loading-premium">
            <div className="pdf-spinner"></div>
            <p>Loading sheet music...</p>
          </div>
        )}

        {error && (
          <div className="pdf-error-premium">
            <i className="fas fa-exclamation-circle"></i>
            <h3>Unable to load PDF</h3>
            <p>{error}</p>
            <button
              className="pdf-retry-btn"
              onClick={() => {
                setLoading(true);
                setError(null);
              }}
            >
              <i className="fas fa-redo"></i>
              Try Again
            </button>
          </div>
        )}

        {!error && (
          <div className="pdf-document-container">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              options={pdfOptions}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="pdf-page-premium"
              />
            </Document>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Help */}
      {showControls && (
        <div className="pdf-shortcuts-hint">
          <span>← → Navigate • + - Zoom • 0 Fit • F Fullscreen</span>
        </div>
      )}
    </div>
  );
}
