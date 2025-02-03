import React, { useState, useRef } from 'react';
import { Shield, Beaker, GraduationCap, Github, Linkedin, Menu, X } from 'lucide-react';
import { generateResearchPaper } from './api';
import { ConfigPanel } from './components/ConfigPanel';
import { PaperPreview } from './components/PaperPreview';
import type { PaperConfig } from './types';

function App() {
  const [config, setConfig] = useState<PaperConfig>({
    topic: '',
    wordCount: 3000,
    referenceCount: 15,
    model: 'deepseek-r1',
    academicLevel: 'masters',
    citationStyle: 'ieee'
  });
  
  const [paper, setPaper] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!config.topic) return;
    
    setLoading(true);
    setPaper('');
    setProgress('');
    
    try {
      const content = await generateResearchPaper(config, (chunk) => {
        setProgress(prev => prev + chunk);
      });
      setPaper(content);
    } catch (error) {
      console.error('Failed to generate paper:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate paper. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!paperRef.current) return;
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    try {
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const canvas = await html2canvas(paperRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.7);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('research-paper.pdf');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <header className="bg-gradient-to-r from-red-900 to-red-700 shadow-lg border-b border-red-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-2.5 rounded-xl shadow-lg shadow-red-500/30 ring-2 ring-red-400/20">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-yellow-200">
                  ResearchGPT
                </h1>
                <p className="text-xs sm:text-sm text-red-200 font-medium">Powered by Advanced AI</p>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-red-200 hover:text-red-100 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-red-200 hover:text-red-100 transition-colors">
                <Beaker className="h-5 w-5" />
                <span className="font-medium">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 text-red-200 hover:text-red-100 transition-colors">
                <GraduationCap className="h-5 w-5" />
                <span className="font-medium">Academic Excellence</span>
              </div>
              <a
                href="https://github.com/Aayush518"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-red-200 hover:text-red-100 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="font-medium">GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/Aayush518"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-red-200 hover:text-red-100 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="font-medium">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-2">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2 text-red-200 hover:text-red-100 transition-colors">
                  <Beaker className="h-5 w-5" />
                  <span className="font-medium">AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2 text-red-200 hover:text-red-100 transition-colors">
                  <GraduationCap className="h-5 w-5" />
                  <span className="font-medium">Academic Excellence</span>
                </div>
                <a
                  href="https://github.com/Aayush518"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-red-200 hover:text-red-100 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span className="font-medium">GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/Aayush518"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-red-200 hover:text-red-100 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="font-medium">LinkedIn</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <ConfigPanel
          config={config}
          onChange={setConfig}
          onGenerate={handleGenerate}
          loading={loading}
        />

        <PaperPreview
          content={paper}
          loading={loading}
          progress={progress}
          onDownload={handleDownload}
          paperRef={paperRef}
        />
      </main>
    </div>
  );
}

export default App