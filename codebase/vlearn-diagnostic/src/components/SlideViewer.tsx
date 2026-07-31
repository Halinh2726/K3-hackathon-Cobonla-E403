import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import type { SlideData } from '../services/slides';

interface SlideViewerProps {
  slide: SlideData;
  onPageChange?: (page: number, totalPages: number) => void;
  onTextSelect?: (text: string, page: number) => void;
  selectedText?: string;
}

export function SlideViewer({ 
  slide, 
  onPageChange,
  onTextSelect,
  selectedText 
}: SlideViewerProps) {
  const [numPages, setNumPages] = useState<number>(slide.totalPages);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);

  // Reset page when slide changes
  useEffect(() => {
    setPageNumber(1);
    setNumPages(slide.totalPages);
  }, [slide.id]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    onPageChange?.(1, numPages);
  };

  const changePage = useCallback((offset: number) => {
    setPageNumber(prev => {
      const next = Math.max(1, Math.min(prev + offset, numPages));
      onPageChange?.(next, numPages);
      return next;
    });
  }, [numPages, onPageChange]);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      onTextSelect?.(selection.toString().trim(), pageNumber);
    }
  }, [pageNumber, onTextSelect]);

  // Determine PDF source - URL or base64 data URL
  const pdfSource = slide.pdfBase64 
    ? `data:application/pdf;base64,${slide.pdfBase64}` 
    : slide.pdfUrl;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📄</span>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{slide.name}</h3>
            <p className="text-xs text-slate-500">{numPages} trang</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            title="Thu nhỏ"
          >
            −
          </button>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale(s => Math.min(2, s + 0.2))}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            title="Phóng to"
          >
            +
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div 
        className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 p-4 flex justify-center"
        onMouseUp={handleTextSelection}
      >
        <Document
          file={pdfSource}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <span className="text-4xl mb-2">⚠️</span>
              <p>Không thể tải PDF</p>
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={false}
            className="shadow-xl rounded-lg"
          />
        </Document>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => changePage(-1)}
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1"
        >
          ← Trang trước
        </button>
        
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={numPages}
            value={pageNumber}
            onChange={(e) => {
              const page = Math.max(1, Math.min(parseInt(e.target.value) || 1, numPages));
              setPageNumber(page);
              onPageChange?.(page, numPages);
            }}
            className="w-16 px-2 py-1 text-center border border-slate-300 dark:border-slate-600 rounded-lg text-sm dark:bg-slate-800 dark:text-slate-200"
          />
          <span className="text-sm text-slate-500">/ {numPages}</span>
        </div>
        
        <button
          onClick={() => changePage(1)}
          disabled={pageNumber >= numPages}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1"
        >
          Trang sau →
        </button>
      </div>

      {/* Selected text indicator */}
      {selectedText && (
        <div className="px-4 py-2 bg-purple-50 dark:bg-purple-950/30 border-t border-purple-200 dark:border-purple-900 text-xs">
          <span className="text-purple-600 dark:text-purple-400">📌 Đã chọn: </span>
          <span className="text-slate-700 dark:text-slate-300 truncate">{selectedText.slice(0, 100)}...</span>
        </div>
      )}
    </div>
  );
}
