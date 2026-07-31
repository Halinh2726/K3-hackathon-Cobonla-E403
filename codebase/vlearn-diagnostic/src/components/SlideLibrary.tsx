import { useState, useRef } from 'react';
import type { SlideData } from '../services/slides';

interface SlideLibraryProps {
  slides: SlideData[];
  onSelectSlide: (slide: SlideData) => void;
  onImportSlide: (file: File) => void;
  onOpenQuiz: (slideName: string) => void;
  savedQuizzesCount?: Record<string, number>;
  savedQuizzes: { title: string; questions: any[]; slideTitle: string; createdAt: string }[];
  onLaunchQuiz: (quizData: any) => void;
  onDeleteQuiz: (index: number) => void;
}

export function SlideLibrary({ slides, onSelectSlide, onImportSlide, onOpenQuiz, savedQuizzesCount = {}, savedQuizzes, onLaunchQuiz, onDeleteQuiz }: SlideLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSlideForQuiz, setSelectedSlideForQuiz] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredSlides = slides.filter(slide =>
    slide.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onImportSlide(file);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onImportSlide(file);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with search and import */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm slide..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nhập Slide
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Drop zone hint */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`mb-6 p-4 border-2 border-dashed rounded-xl text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
        }`}
      >
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isDragging ? 'Thả file PDF vào đây để nhập' : 'Kéo thả file PDF vào đây hoặc bấm "Nhập Slide"'}
        </p>
      </div>

      {/* Slides list */}
      {filteredSlides.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {searchQuery ? 'Không tìm thấy slide' : 'Chưa có slide nào'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {searchQuery ? 'Thử tìm với từ khóa khác' : 'Nhập slide PDF để bắt đầu'}
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pb-4">
          {filteredSlides.map((slide) => (
            <div
              key={slide.id}
              onClick={() => onSelectSlide(slide)}
              className="flex items-center gap-4 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
                  {slide.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {slide.totalPages} trang • {new Date(slide.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>

              {/* View button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSlide(slide);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-lg transition-colors shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Xem
              </button>
              {/* Quiz button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSlideForQuiz(slide.name);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-600 text-purple-700 dark:text-purple-400 hover:text-white text-xs font-medium rounded-lg transition-colors shrink-0"
                title={savedQuizzesCount[slide.name] ? `${savedQuizzesCount[slide.name]} quiz đã tạo` : 'Tạo quiz'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Quiz{savedQuizzesCount[slide.name] ? ` (${savedQuizzesCount[slide.name]})` : ''}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quiz Modal for selected slide */}
      {selectedSlideForQuiz && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 bg-purple-600 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Quiz: {selectedSlideForQuiz}</h3>
                <p className="text-xs text-purple-200">
                  {savedQuizzes.filter(q => q.slideTitle === selectedSlideForQuiz).length} bài quiz đã tạo
                </p>
              </div>
              <button
                onClick={() => setSelectedSlideForQuiz(null)}
                className="p-1.5 hover:bg-purple-500 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Create new quiz button */}
              <button
                onClick={() => {
                  onOpenQuiz(selectedSlideForQuiz);
                  setSelectedSlideForQuiz(null);
                }}
                className="w-full p-3 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center justify-center gap-2 font-semibold text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tạo quiz mới
              </button>

              {/* Saved quizzes list */}
              {savedQuizzes.filter(q => q.slideTitle === selectedSlideForQuiz).length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                  Chưa có quiz nào cho slide này
                </div>
              ) : (
                savedQuizzes.filter(q => q.slideTitle === selectedSlideForQuiz).map((quiz, idx) => {
                  const globalIdx = savedQuizzes.findIndex(q => q.slideTitle === selectedSlideForQuiz && q.title === quiz.title && q.createdAt === quiz.createdAt);
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{quiz.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {quiz.questions.length} câu • {quiz.createdAt}
                          </p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              onLaunchQuiz({ title: quiz.title, questions: quiz.questions });
                              setSelectedSlideForQuiz(null);
                            }}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            Làm
                          </button>
                          <button
                            onClick={() => onDeleteQuiz(globalIdx)}
                            className="px-2 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold rounded-lg transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
