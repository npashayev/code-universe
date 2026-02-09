'use client';

import React, { useState, useRef, useActionState } from 'react';
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Terminal,
  Tag as TagIcon,
  BookOpen,
  HelpCircle,
  Layout,
  Save,
  X,
  ChevronDown,
  Globe,
  Database,
  Search,
  Hash,
  Eye,
  FileUp,
  Languages,
  Upload,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from './components/ImageWithFallback';
import type {
  SupportedLanguage,
  PlanetData,
  LocalizedPlanetData,
  Resource,
  PlanetContent,
  TitleLevel,
  ProgrammingLanguage,
  VariantType,
  ImageMetadata,
} from '@/types/planet';
import Link from 'next/link';

const Motion = motion;

// Server action placeholder
async function savePlanetAction(prevState: any, formData: FormData) {
  // Will be implemented later
  return { success: false, message: 'Not implemented yet' };
}

export const PlanetAdminForm: React.FC = () => {
  // --- Current Language State ---
  const [currentLanguage, setCurrentLanguage] =
    useState<SupportedLanguage>('en');

  // --- Planet Data (Complete structure with all languages) ---
  const [planetData, setPlanetData] = useState<PlanetData>({
    category: 'frontend',
    status: 'draft',
    step: 1,
    image: {
      url: '',
      metadata: { width: 800, height: 600 },
      alt: {},
    },
    nextPlanetId: null,
    prevPlanetId: null,
    localized: {},
  });

  // --- UI State ---
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadScope, setUploadScope] = useState('complete');
  const [selectedContentType, setSelectedContentType] = useState<string>('text');

  // --- Temporary input states for arrays ---
  const [currentTag, setCurrentTag] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentResource, setCurrentResource] = useState<Resource>({
    title: '',
    label: '',
    url: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Server Action ---
  const [formState, formAction, isPending] = useActionState(
    savePlanetAction,
    { success: false, message: '' }
  );

  // --- Helper: Get current localized data ---
  const getCurrentLocalizedData = (): LocalizedPlanetData => {
    return (
      planetData.localized[currentLanguage] || {
        name: '',
        tags: [],
        description: '',
        researchTopics: [],
        resources: [],
        questions: [],
        contents: [],
      }
    );
  };

  // --- Helper: Update localized data for current language ---
  const updateLocalizedData = (updates: Partial<LocalizedPlanetData>): void => {
    setPlanetData((prev) => ({
      ...prev,
      localized: {
        ...prev.localized,
        [currentLanguage]: {
          ...getCurrentLocalizedData(),
          ...updates,
        },
      },
    }));
  };

  // --- Language Change Handler ---
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    // If language doesn't exist in planetData, initialize it
    if (!planetData.localized[newLang]) {
      setPlanetData((prev) => ({
        ...prev,
        localized: {
          ...prev.localized,
          [newLang]: {
            name: '',
            tags: [],
            description: '',
            researchTopics: [],
            resources: [],
            questions: [],
            contents: [],
          },
        },
      }));
    }
    setCurrentLanguage(newLang);
  };

  // --- Get current language data for display ---
  const currentData = getCurrentLocalizedData();

  // --- Array Helpers ---
  const addItem = <T,>(
    currentList: T[],
    item: T,
    resetFn: () => void
  ): void => {
    if (!item || (typeof item === 'string' && !item.trim())) return;
    updateLocalizedData({
      ...currentData,
      [getArrayKey(currentList)]: [...currentList, item],
    } as Partial<LocalizedPlanetData>);
    resetFn();
  };

  const removeItem = <T,>(currentList: T[], index: number): void => {
    updateLocalizedData({
      ...currentData,
      [getArrayKey(currentList)]: currentList.filter((_, i) => i !== index),
    } as Partial<LocalizedPlanetData>);
  };

  const getArrayKey = (list: any[]): keyof LocalizedPlanetData => {
    if (list === currentData.tags) return 'tags';
    if (list === currentData.researchTopics) return 'researchTopics';
    if (list === currentData.questions) return 'questions';
    if (list === currentData.resources) return 'resources';
    if (list === currentData.contents) return 'contents';
    return 'tags';
  };

  // --- Content Management ---
  const addContent = () => {
    const base = {
      id: Math.random().toString(36).substr(2, 9),
      order: currentData.contents.length + 1,
      type: selectedContentType,
    };

    let newContent: PlanetContent;

    switch (selectedContentType) {
      case 'text':
        newContent = {
          ...base,
          type: 'text',
          title: { level: 'p' as TitleLevel, text: '' },
          text: '',
          variant: 'normal' as VariantType,
          markdown: false,
        };
        break;
      case 'implementation-task':
        newContent = {
          ...base,
          type: 'implementation-task',
          title: '',
          task: '',
        };
        break;
      case 'code':
        newContent = {
          ...base,
          type: 'code',
          title: '',
          code: {
            language: 'javascript' as ProgrammingLanguage,
            code: '',
            output: '',
          },
        };
        break;
      case 'html-element':
        newContent = {
          ...base,
          type: 'html-element',
          title: '',
          element: { html: '', css: '', js: '' },
        };
        break;
      case 'image':
        newContent = {
          ...base,
          type: 'image',
          title: '',
          image: {
            url: '',
            alt: '',
            metadata: { width: 800, height: 600 },
          },
        };
        break;
      default:
        return;
    }

    updateLocalizedData({
      contents: [...currentData.contents, newContent],
    });
  };

  const updateContent = (index: number, updates: Partial<PlanetContent>): void => {
    const updatedContents = [...currentData.contents];
    updatedContents[index] = { ...updatedContents[index], ...updates } as PlanetContent;
    updateLocalizedData({ contents: updatedContents });
  };

  const removeContent = (index: number): void => {
    updateLocalizedData({
      contents: currentData.contents.filter((_, i) => i !== index),
    });
  };

  // --- File Upload Handler ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(`Uploading ${file.name} with scope: ${uploadScope}`);
      setIsUploadModalOpen(false);
    }
  };

  // --- Main Image Handlers ---
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPlanetData((prev) => ({
        ...prev,
        image: {
          ...prev.image,
          url: URL.createObjectURL(file),
        },
      }));
    }
  };

  const handleMainImageAltChange = (value: string) => {
    setPlanetData((prev) => ({
      ...prev,
      image: {
        ...prev.image,
        alt: {
          ...prev.image.alt,
          [currentLanguage]: value,
        },
      },
    }));
  };

  return (
    <div className="min-h-screen bg-[#030213] text-slate-200 font-sans selection:bg-orange-500/30 pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-[60] bg-[#030213]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                <Globe className="text-orange-500" size={18} />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Create New Planet
              </h1>
            </div>

            <div className="h-8 w-px bg-white/10 hidden md:block" />

            <div className="hidden md:flex items-center gap-4">
              {/* Language Selection */}
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-orange-500 transition-colors">
                  <Languages size={14} />
                </div>
                <select
                  value={currentLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                  className="bg-white/5 border border-white/10 hover:border-white/20 rounded-lg pl-9 pr-8 py-1.5 text-xs font-bold text-white appearance-none cursor-pointer transition-all outline-none"
                >
                  <option value="en">English</option>
                  <option value="az">Azerbaijani</option>
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  size={12}
                />
              </div>

              {/* JSON Upload Trigger */}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-slate-300 transition-all cursor-pointer"
              >
                <Upload size={14} />
                Import JSON
              </button>
            </div>
          </div>

          <button
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 cursor-pointer text-sm disabled:opacity-50"
          >
            <Save size={16} />
            {isPending ? 'Saving...' : 'Publish Discovery'}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Area: 8 Columns */}
        <div className="lg:col-span-8 space-y-12">
          {/* Basic Configuration Section */}
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-8">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-4">
              <Terminal size={14} />
              <span>Basic Configuration</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Planet Name (Topic)
                </label>
                <input
                  type="text"
                  value={currentData.name}
                  onChange={(e) => updateLocalizedData({ name: e.target.value })}
                  placeholder="e.g. Master React Hooks"
                  className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={planetData.category}
                      onChange={(e) =>
                        setPlanetData((prev) => ({ ...prev, category: e.target.value }))
                      }
                      className="w-full appearance-none bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white cursor-pointer"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="general">General</option>
                      <option value="devops">DevOps</option>
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={planetData.status}
                      onChange={(e) =>
                        setPlanetData((prev) => ({
                          ...prev,
                          status: e.target.value as 'draft' | 'published',
                        }))
                      }
                      className="w-full appearance-none bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white cursor-pointer"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mission Description
                </label>
                <textarea
                  value={currentData.description}
                  onChange={(e) => updateLocalizedData({ description: e.target.value })}
                  rows={4}
                  placeholder="Provide a brief overview of what this planet teaches..."
                  className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white resize-none"
                />
              </div>

              {/* Sub-section: Planet Image */}
              <div className="pt-4 border-t border-white/5 space-y-6">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <ImageIcon size={14} />
                  <span>Planet Image</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Image Source
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="main-image-upload"
                          className="hidden"
                          onChange={handleMainImageUpload}
                          accept="image/*"
                        />
                        <label
                          htmlFor="main-image-upload"
                          className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-orange-500/50 rounded-xl px-4 py-8 outline-none transition-all text-slate-400 cursor-pointer group"
                        >
                          <FileUp
                            className="group-hover:text-orange-500 transition-colors"
                            size={20}
                          />
                          <span className="text-sm">Upload Image</span>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Alt Description ({currentLanguage})
                      </label>
                      <input
                        type="text"
                        value={planetData.image.alt?.[currentLanguage] || ''}
                        onChange={(e) => handleMainImageAltChange(e.target.value)}
                        placeholder="Descriptive text for accessibility"
                        className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white"
                      />
                    </div>
                  </div>

                  <div className="aspect-video rounded-xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center relative shadow-inner">
                    {planetData.image.url ? (
                      <ImageWithFallback
                        src={planetData.image.url}
                        alt={planetData.image.alt?.[currentLanguage] || ''}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-700">
                        <ImageIcon size={40} strokeWidth={1} />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                          Waiting for Visual
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tags Section */}
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-4">
              <TagIcon size={14} />
              <span>Tags</span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={16}
                />
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addItem(currentData.tags, currentTag, () => setCurrentTag(''));
                    }
                  }}
                  placeholder="Add a new tag..."
                  className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl pl-10 pr-4 py-3 outline-none transition-all text-white"
                />
              </div>
              <button
                onClick={() => addItem(currentData.tags, currentTag, () => setCurrentTag(''))}
                className="px-6 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white font-bold text-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 text-xs font-bold group"
                >
                  {tag}
                  <button
                    onClick={() => removeItem(currentData.tags, idx)}
                    className="text-orange-500/40 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              {currentData.tags.length === 0 && (
                <span className="text-slate-600 text-xs italic">
                  No tags assigned yet.
                </span>
              )}
            </div>
          </section>

          {/* Research Topics Section */}
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-4">
              <Search size={14} />
              <span>Research Topics</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addItem(currentData.researchTopics, currentTopic, () => setCurrentTopic(''));
                  }
                }}
                placeholder="Enter key topic..."
                className="flex-1 bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white"
              />
              <button
                onClick={() =>
                  addItem(currentData.researchTopics, currentTopic, () => setCurrentTopic(''))
                }
                className="px-6 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white font-bold text-sm"
              >
                Add Topic
              </button>
            </div>
            <div className="space-y-2">
              {currentData.researchTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl group"
                >
                  <span className="text-sm text-slate-300 font-medium">{topic}</span>
                  <button
                    onClick={() => removeItem(currentData.researchTopics, idx)}
                    className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* External Resources Section */}
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-4">
              <BookOpen size={14} />
              <span>External Resources</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={currentResource.title || ''}
                onChange={(e) =>
                  setCurrentResource({ ...currentResource, title: e.target.value })
                }
                placeholder="Title (Optional)"
                className="bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none text-sm"
              />
              <input
                type="text"
                value={currentResource.label}
                onChange={(e) =>
                  setCurrentResource({ ...currentResource, label: e.target.value })
                }
                placeholder="Link Label"
                className="bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentResource.url}
                  onChange={(e) =>
                    setCurrentResource({ ...currentResource, url: e.target.value })
                  }
                  placeholder="URL"
                  className="flex-1 bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none text-sm"
                />
                <button
                  onClick={() => {
                    if (currentResource.label && currentResource.url) {
                      addItem(currentData.resources || [], currentResource, () =>
                        setCurrentResource({ title: '', label: '', url: '' })
                      );
                    }
                  }}
                  className="px-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white font-bold"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {(currentData.resources || []).map((res, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                      <BookOpen size={14} className="text-orange-500" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-600 uppercase font-mono tracking-tighter">
                        {res.title || 'General Link'}
                      </span>
                  <Link
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-orange-400 hover:underline font-medium"
                      >
                        {res.label}
                      </Link>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(currentData.resources || [], idx)}
                    className="text-slate-600 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Questions Section */}
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-4">
              <HelpCircle size={14} />
              <span>Questions</span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <HelpCircle
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={16}
                />
                <input
                  type="text"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addItem(currentData.questions, currentQuestion, () =>
                        setCurrentQuestion('')
                      );
                    }
                  }}
                  placeholder="Add a challenging question..."
                  className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl pl-10 pr-4 py-3 outline-none transition-all text-white"
                />
              </div>
              <button
                onClick={() =>
                  addItem(currentData.questions, currentQuestion, () => setCurrentQuestion(''))
                }
                className="px-6 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white font-bold"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {currentData.questions.map((q, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <span className="text-sm text-slate-300 font-medium">{q}</span>
                  <button
                    onClick={() => removeItem(currentData.questions, idx)}
                    className="text-slate-600 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Dynamic Contents Editor - Main View */}
          {currentData.contents.length > 0 && (
            <section className="space-y-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight">
                <Database className="text-orange-500" size={24} />
                <span>Discovery Contents</span>
              </div>

              <div className="space-y-10">
                {currentData.contents.map((content, idx) => (
                  <div
                    key={content.id}
                    id={`content-${content.id}`}
                    className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl space-y-8 relative group hover:border-orange-500/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-mono text-slate-500">
                          #{content.order}
                        </div>
                        <span className="text-xs uppercase font-black text-orange-500 tracking-[0.2em]">
                          {content.type}
                        </span>
                      </div>
                      <button
                        onClick={() => removeContent(idx)}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* DYNAMIC FIELDS BASED ON TYPE */}
                    {content.type === 'text' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                              Level
                            </label>
                            <select
                              value={content.title?.level || 'p'}
                              onChange={(e) =>
                                updateContent(idx, {
                                  title: {
                                    level: e.target.value as TitleLevel,
                                    text: content.title?.text || '',
                                  },
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
                            >
                              <option value="p">Paragraph (p)</option>
                              <option value="h2">Heading 2 (h2)</option>
                              <option value="h3">Heading 3 (h3)</option>
                              <option value="h4">Heading 4 (h4)</option>
                              <option value="h5">Heading 5 (h5)</option>
                              <option value="h6">Heading 6 (h6)</option>
                            </select>
                          </div>
                          <div className="md:col-span-3 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                              Heading Text
                            </label>
                            <input
                              type="text"
                              placeholder="Optional block heading..."
                              value={content.title?.text || ''}
                              onChange={(e) =>
                                updateContent(idx, {
                                  title: {
                                    level: content.title?.level || 'p',
                                    text: e.target.value,
                                  },
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Body Content
                          </label>
                          <textarea
                            placeholder="Enter the core text for this section..."
                            value={content.text}
                            onChange={(e) => updateContent(idx, { text: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm min-h-[150px] outline-none"
                          />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-6">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-600 uppercase font-bold">
                                Block Variant
                              </label>
                              <select
                                value={content.variant}
                                onChange={(e) =>
                                  updateContent(idx, {
                                    variant: e.target.value as VariantType,
                                  })
                                }
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs outline-none"
                              >
                                <option value="normal">Normal</option>
                                <option value="note">Note</option>
                                <option value="warning">Warning</option>
                                <option value="tip">Tip</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id={`md-${content.id}`}
                                checked={content.markdown}
                                onChange={(e) =>
                                  updateContent(idx, { markdown: e.target.checked })
                                }
                                className="w-4 h-4 rounded accent-orange-500"
                              />
                              <label
                                htmlFor={`md-${content.id}`}
                                className="text-xs text-slate-400 font-medium"
                              >
                                Enable Markdown
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {content.type === 'implementation-task' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Task Title
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Set up the development environment"
                            value={content.title || ''}
                            onChange={(e) => updateContent(idx, { title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Task Instructions
                          </label>
                          <textarea
                            placeholder="Break down exactly what the explorer needs to do..."
                            value={content.task}
                            onChange={(e) => updateContent(idx, { task: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm min-h-[120px] outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {content.type === 'code' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                              Snippet Title
                            </label>
                            <input
                              type="text"
                              placeholder="Describe the code block..."
                              value={content.title || ''}
                              onChange={(e) => updateContent(idx, { title: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                              Language
                            </label>
                            <select
                              value={content.code.language}
                              onChange={(e) =>
                                updateContent(idx, {
                                  code: {
                                    ...content.code,
                                    language: e.target.value as ProgrammingLanguage,
                                  },
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none"
                            >
                              <option value="javascript">JavaScript</option>
                              <option value="typescript">TypeScript</option>
                              <option value="html">HTML</option>
                              <option value="css">CSS</option>
                              <option value="json">JSON</option>
                              <option value="shell">Shell</option>
                              <option value="markdown">Markdown</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] text-orange-500 uppercase font-black tracking-widest flex items-center gap-2">
                              <Terminal size={12} /> Source Implementation
                            </label>
                            <textarea
                              value={content.code.code}
                              onChange={(e) =>
                                updateContent(idx, {
                                  code: { ...content.code, code: e.target.value },
                                })
                              }
                              className="w-full bg-[#0d0d1e] border border-white/5 rounded-2xl px-5 py-4 text-[11px] font-mono min-h-[200px] max-h-[400px] overflow-auto outline-none custom-scrollbar"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
                              <Eye size={12} /> Output Prediction
                            </label>
                            <textarea
                              value={content.code.output || ''}
                              onChange={(e) =>
                                updateContent(idx, {
                                  code: { ...content.code, output: e.target.value },
                                })
                              }
                              className="w-full bg-[#1e1e32] border border-white/5 rounded-2xl px-5 py-4 text-[11px] font-mono min-h-[100px] outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {content.type === 'html-element' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Element Title
                          </label>
                          <input
                            type="text"
                            placeholder="Component name..."
                            value={content.title || ''}
                            onChange={(e) => updateContent(idx, { title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[9px] text-slate-500 uppercase font-bold">
                              Structure (HTML)
                            </label>
                            <textarea
                              value={content.element.html}
                              onChange={(e) =>
                                updateContent(idx, {
                                  element: { ...content.element, html: e.target.value },
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono h-32 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] text-slate-500 uppercase font-bold">
                              Styling (CSS)
                            </label>
                            <textarea
                              value={content.element.css || ''}
                              onChange={(e) =>
                                updateContent(idx, {
                                  element: { ...content.element, css: e.target.value },
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono h-32 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] text-slate-500 uppercase font-bold">
                              Logic (JS)
                            </label>
                            <textarea
                              value={content.element.js || ''}
                              onChange={(e) =>
                                updateContent(idx, {
                                  element: { ...content.element, js: e.target.value },
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono h-32 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {content.type === 'image' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Block Title
                          </label>
                          <input
                            type="text"
                            placeholder="Caption for the image..."
                            value={content.title || ''}
                            onChange={(e) => updateContent(idx, { title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Asset Upload
                              </label>
                              <div className="relative">
                                <input
                                  type="file"
                                  id={`content-img-${content.id}`}
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file)
                                      updateContent(idx, {
                                        image: {
                                          ...content.image,
                                          url: URL.createObjectURL(file),
                                        },
                                      });
                                  }}
                                />
                                <label
                                  htmlFor={`content-img-${content.id}`}
                                  className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-orange-500/50 rounded-xl px-4 py-10 outline-none transition-all text-slate-400 cursor-pointer group"
                                >
                                  <FileUp
                                    className="group-hover:text-orange-500 transition-colors"
                                    size={20}
                                  />
                                  <span className="text-sm font-medium">Choose Media File</span>
                                </label>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Alt Description
                              </label>
                              <input
                                type="text"
                                placeholder="Accessibility text..."
                                value={content.image.alt || ''}
                                onChange={(e) =>
                                  updateContent(idx, {
                                    image: { ...content.image, alt: e.target.value },
                                  })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                              />
                            </div>
                          </div>
                          <div className="aspect-video rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center">
                            {content.image.url ? (
                              <ImageWithFallback
                                src={content.image.url}
                                alt={content.image.alt || ''}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-slate-700">
                                <ImageIcon size={40} strokeWidth={1} />
                                <span className="text-[10px] uppercase tracking-widest font-black">
                                  Visual Preview
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Area: 4 Columns */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sticky top-28 shadow-2xl">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
              <Layout size={14} />
              <span>Planet Content</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  New Content Module
                </label>
                <div className="relative">
                  <select
                    value={selectedContentType}
                    onChange={(e) => setSelectedContentType(e.target.value)}
                    className="w-full appearance-none bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white cursor-pointer text-sm"
                  >
                    <option value="text">Text / Markdown</option>
                    <option value="implementation-task">Task</option>
                    <option value="code">Code Snippet</option>
                    <option value="html-element">HTML Element</option>
                    <option value="image">Image Component</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              <button
                onClick={addContent}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/30 rounded-xl text-white transition-all cursor-pointer font-bold text-sm"
              >
                <Plus size={18} />
                Add Module
              </button>
            </div>

            {/* Quick List of Added Contents */}
            {currentData.contents.length > 0 && (
              <div className="mt-8 space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar border-t border-white/5 pt-6">
                <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-4">
                  Discovery Outline
                </p>
                {currentData.contents.map((content) => (

                    key={content.id}
                    href={`#content-${content.id}`}
                    className="block p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-white font-bold truncate group-hover:text-orange-500 transition-colors">
                        {content.type === 'text' && content.title?.text
                          ? content.title.text
                          : content.type === 'implementation-task' ||
                            content.type === 'code' ||
                            content.type === 'html-element' ||
                            content.type === 'image'
                          ? content.title || `Block ${content.order}`
                          : `Block ${content.order}`}
                      </span>
                      <span className="text-[10px] uppercase font-mono text-slate-500 tracking-tighter mt-0.5">
                        {content.type}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {currentData.contents.length === 0 && (
              <div className="mt-8 py-10 flex flex-col items-center justify-center text-slate-700 border border-dashed border-white/10 rounded-2xl">
                <Database size={24} strokeWidth={1} className="mb-2" />
                <span className="text-[10px] uppercase tracking-widest font-black text-center">
                  No modules in
                  <br />
                  this system
                </span>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <Motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <Motion
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#0d0d1e] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-transparent opacity-50" />

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <Upload size={14} className="text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Import Discovery Data
                  </h3>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Select Import Scope
                  </label>
                  <div className="relative">
                    <select
                      value={uploadScope}
                      onChange={(e) => setUploadScope(e.target.value)}
                      className="w-full appearance-none bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 outline-none transition-all text-white cursor-pointer text-sm"
                    >
                      <option value="complete">Complete Document</option>
                      <option value="lang1">Language 1 (Meta Only)</option>
                      <option value="lang2">Language 2 (Content Only)</option>
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".json"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-3 py-10 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 hover:border-orange-500/50 rounded-2xl transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-orange-500/5 flex items-center justify-center border border-orange-500/10 group-hover:scale-110 transition-transform">
                      <FileUp size={24} className="text-orange-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">Select JSON File</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                        Maximum size 5MB
                      </p>
                    </div>
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 font-bold text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    disabled
                    className="flex-1 py-3 bg-orange-500/20 text-orange-500/50 rounded-xl font-bold text-sm cursor-not-allowed border border-orange-500/10"
                  >
                    Start Import
                  </button>
                </div>
              </div>
            </Motion>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
