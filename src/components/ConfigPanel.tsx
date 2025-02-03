import React from 'react';
import { PaperConfig } from '../types';
import { Settings2, BookOpen, FileText, GraduationCap, Shield, Zap } from 'lucide-react';

interface ConfigPanelProps {
  config: PaperConfig;
  onChange: (config: PaperConfig) => void;
  onGenerate: () => void;
  loading: boolean;
}

export function ConfigPanel({ config, onChange, onGenerate, loading }: ConfigPanelProps) {
  const updateConfig = (updates: Partial<PaperConfig>) => {
    onChange({ ...config, ...updates });
  };

  return (
    <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl shadow-2xl shadow-red-500/10 ring-1 ring-red-500/20 p-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings2 className="h-6 w-6 text-red-500" />
        <h2 className="text-xl font-bold text-white">Research Configuration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">
              Research Topic
            </label>
            <input
              type="text"
              value={config.topic}
              onChange={(e) => updateConfig({ topic: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#2A2A2A] border border-red-500/30 rounded-xl text-white placeholder-red-300/50 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your research topic..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">
              Word Count
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                value={config.wordCount}
                onChange={(e) => updateConfig({ wordCount: parseInt(e.target.value) })}
                min={1000}
                max={5000}
                step={500}
                className="flex-1 h-2 bg-red-500/30 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white font-medium min-w-[80px] text-center">
                {config.wordCount}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">
              Number of References
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                value={config.referenceCount}
                onChange={(e) => updateConfig({ referenceCount: parseInt(e.target.value) })}
                min={5}
                max={30}
                step={5}
                className="flex-1 h-2 bg-red-500/30 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white font-medium min-w-[80px] text-center">
                {config.referenceCount}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">
              AI Model
            </label>
            <select
              value={config.model}
              onChange={(e) => updateConfig({ model: e.target.value as any })}
              className="w-full px-4 py-2.5 bg-[#2A2A2A] border border-red-500/30 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            >
              <option value="gemini-2.0">Gemini 2.0 (Recommended)</option>
              <option value="deepseek-r1">DeepSeek R1</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">
              Academic Level
            </label>
            <select
              value={config.academicLevel}
              onChange={(e) => updateConfig({ academicLevel: e.target.value as any })}
              className="w-full px-4 py-2.5 bg-[#2A2A2A] border border-red-500/30 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            >
              <option value="undergraduate">Undergraduate</option>
              <option value="masters">Master's</option>
              <option value="doctoral">Doctoral</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">
              Citation Style
            </label>
            <select
              value={config.citationStyle}
              onChange={(e) => updateConfig({ citationStyle: e.target.value as any })}
              className="w-full px-4 py-2.5 bg-[#2A2A2A] border border-red-500/30 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            >
              <option value="ieee">IEEE</option>
              <option value="apa">APA</option>
              <option value="mla">MLA</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={onGenerate}
          disabled={loading || !config.topic}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-xl font-medium text-white shadow-lg shadow-red-500/30 ring-2 ring-red-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Generating Paper...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              Generate Research Paper
            </>
          )}
        </button>
      </div>
    </div>
  );
}