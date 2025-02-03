import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Loader2, ZoomIn, ZoomOut, Printer, FileText, ChevronLeft, ChevronRight, Palette, Shield, Columns, Menu } from 'lucide-react';

interface PaperPreviewProps {
  content: string;
  loading: boolean;
  progress: string;
  onDownload: () => void;
  paperRef: React.RefObject<HTMLDivElement>;
}

export function PaperPreview({ content, loading, progress, onDownload, paperRef }: PaperPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [theme, setTheme] = useState('marvel');
  const [pages, setPages] = useState<string[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [columnLayout, setColumnLayout] = useState<'single' | 'double'>('double');
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (content || progress) {
      const textToSplit = content || progress;
      const sections = textToSplit.split(/(?=# |\n## )/);
      const pagesArray: string[] = [];
      let currentPageContent = '';
      let currentWordCount = 0;
      const wordsPerPage = 800;

      sections.forEach((section) => {
        const sectionWordCount = section.trim().split(/\s+/).length;
        
        if (currentWordCount + sectionWordCount > wordsPerPage && currentPageContent) {
          pagesArray.push(currentPageContent.trim());
          currentPageContent = section;
          currentWordCount = sectionWordCount;
        } else {
          currentPageContent += (currentPageContent ? '\n\n' : '') + section;
          currentWordCount += sectionWordCount;
        }
      });

      if (currentPageContent.trim()) {
        pagesArray.push(currentPageContent.trim());
      }

      const filteredPages = pagesArray.filter(page => page.trim().length > 0);
      setPages(filteredPages);
      setCurrentPage(1);
    } else {
      setPages([]);
      setCurrentPage(1);
    }
  }, [content, progress]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  
  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    if (!paperRef.current || downloading) return;
    
    try {
      setDownloading(true);
      await onDownload();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, pages.length));

  if (!loading && !content && !progress) return null;

  const displayContent = pages[currentPage - 1] || '';

  return (
    <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl shadow-2xl overflow-hidden ring-1 ring-red-500/20">
      <div className="border-b border-red-500/20 bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] p-4">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-red-500/20 rounded-lg px-3 py-2">
              <Shield className="h-5 w-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">
                Research Paper Preview
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-red-300 bg-red-500/10 rounded-lg px-3 py-2">
              <FileText className="h-4 w-4" />
              <span>Page {currentPage} of {Math.max(pages.length, 1)}</span>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === pages.length}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile controls toggle */}
          <div className="sm:hidden">
            <button
              onClick={() => setShowControls(!showControls)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-300"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Controls - desktop always visible, mobile toggleable */}
          <div className={`${showControls ? 'flex' : 'hidden'} sm:flex flex-wrap items-center gap-3`}>
            <div className="flex items-center gap-2 bg-red-500/20 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-300"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-sm text-red-300 min-w-[3rem] text-center">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-300"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 bg-red-500/20 rounded-lg p-1">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-transparent text-red-300 text-sm p-2 border-none outline-none"
              >
                <option value="marvel">Marvel</option>
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
              </select>
              <Palette className="h-4 w-4 text-red-300" />
            </div>

            <div className="flex items-center gap-2 bg-red-500/20 rounded-lg p-1">
              <select
                value={columnLayout}
                onChange={(e) => setColumnLayout(e.target.value as 'single' | 'double')}
                className="bg-transparent text-red-300 text-sm p-2 border-none outline-none"
              >
                <option value="single">Single Column</option>
                <option value="double">Double Column</option>
              </select>
              <Columns className="h-4 w-4 text-red-300" />
            </div>
            
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-300"
              title="Print"
            >
              <Printer className="h-4 w-4" />
            </button>
            
            {content && (
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg shadow-red-500/30 disabled:opacity-50"
              >
                {downloading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8 overflow-auto bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] min-h-[800px]">
        <div 
          ref={paperRef} 
          className={`research-paper theme-${theme} layout-${columnLayout} max-w-full`}
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          {loading && (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center gap-3 text-red-600 mb-6">
                <Loader2 className="animate-spin h-5 w-5" />
                <span className="font-medium">Generating your research paper...</span>
              </div>
              <ReactMarkdown className="content prose prose-invert max-w-none">
                {progress}
              </ReactMarkdown>
            </div>
          )}
          {!loading && displayContent && (
            <ReactMarkdown className="content prose prose-invert max-w-none">
              {displayContent}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}