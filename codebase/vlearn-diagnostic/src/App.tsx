import { useEffect, useState } from 'react';
import { Sidebar, NavItem } from './components/Sidebar';
import { Header } from './components/Header';
import { 
  sessions, 
  diagnosticQuestions, 
  mockLearningPath, 
  postCheckQuestions,
  analyzeDiagnosticResults 
} from './data';
import type { 
  Session, 
  AppState,
  DiagnosticResult,
  DiagnosticQuestion,
  PostCheckQuestion
} from './types';

// Icons
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// ============ SCREEN 1: Setup Session ============
function ScreenSetup({
  session,
  onSessionChange,
  onStart
}: {
  session: Session | null;
  onSessionChange: (s: Session) => void;
  onStart: () => void;
}) {
  const getStatusBadge = (status: Session['status']) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">Hoàn thành</span>;
      case 'in-progress':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Đang học</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600">Chưa học</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Selection */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Chọn buổi học</h3>
        <div className="space-y-3">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSessionChange(s)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                session?.id === s.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                  : 'border-slate-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                    {s.day}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-slate-900">{s.title}</span>
                      {getStatusBadge(s.status)}
                    </div>
                    <div className="flex gap-1.5">
                      {s.topics.slice(0, 2).map((t, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        disabled={!session}
        className="w-full py-4 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Bắt đầu kiểm tra
      </button>
    </div>
  );
}

// ============ SCREEN 2: Diagnostic ============
type QuestionFilter = 'all' | 'answered' | 'unanswered' | 'flagged';

function ScreenDiagnostic({
  answers,
  onAnswer,
  onSubmit
}: {
  answers: Record<number, number>;
  onAnswer: (id: number, value: number) => void;
  onSubmit: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<QuestionFilter>('all');
  
  const question = diagnosticQuestions[currentIndex];
  
  const handleNext = () => {
    if (currentIndex < diagnosticQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSelectAnswer = (value: number) => {
    onAnswer(question.id, value);
  };

  const toggleFlag = (qId: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(qId)) {
        newSet.delete(qId);
      } else {
        newSet.add(qId);
      }
      return newSet;
    });
  };

  const answeredCount = diagnosticQuestions.filter(q => answers[q.id] !== undefined).length;
  const unansweredCount = diagnosticQuestions.length - answeredCount;
  
  const handleQuestionClick = (qId: number) => {
    const idx = diagnosticQuestions.findIndex(q => q.id === qId);
    if (idx !== -1) {
      setCurrentIndex(idx);
    }
  };

  const progress = ((currentIndex + 1) / diagnosticQuestions.length) * 100;
  const isLast = currentIndex === diagnosticQuestions.length - 1;
  const allAnswered = diagnosticQuestions.every(q => answers[q.id] !== undefined);

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tất cả ({diagnosticQuestions.length})
        </button>
        <button
          onClick={() => setFilter('answered')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'answered'
              ? 'bg-green-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Đã trả lời ({answeredCount})
        </button>
        <button
          onClick={() => setFilter('unanswered')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'unanswered'
              ? 'bg-orange-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Chưa trả lời ({unansweredCount})
        </button>
        <button
          onClick={() => setFilter('flagged')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'flagged'
              ? 'bg-red-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Flag ({flaggedQuestions.size})
        </button>
      </div>

      {/* Question Navigation Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700">Chọn câu hỏi:</span>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-green-500"></span> Đã trả lời
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-slate-200"></span> Chưa trả lời
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-red-400"></span> Flag
            </span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {diagnosticQuestions.map((q, idx) => {
            const isAnsweredQ = answers[q.id] !== undefined;
            const isFlagged = flaggedQuestions.has(q.id);
            const isCurrent = idx === currentIndex;
            
            let bgColor = 'bg-slate-200 hover:bg-slate-300';
            if (isFlagged) bgColor = 'bg-red-400 hover:bg-red-500';
            else if (isAnsweredQ) bgColor = 'bg-green-500 hover:bg-green-600';
            
            return (
              <button
                key={q.id}
                onClick={() => handleQuestionClick(q.id)}
                className={`relative w-10 h-10 rounded-lg font-medium text-sm transition-colors ${bgColor} ${
                  isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                } text-white`}
              >
                {idx + 1}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/>
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Câu {currentIndex + 1} / {diagnosticQuestions.length}</span>
          <span className="font-medium text-blue-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
              {question.topic}
            </span>
            {question.reference && (
              <span className="text-xs text-slate-400 font-mono">{question.reference}</span>
            )}
          </div>
          <button
            onClick={() => toggleFlag(question.id)}
            className={`p-2 rounded-lg transition-colors ${
              flaggedQuestions.has(question.id)
                ? 'bg-red-100 text-red-600'
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
            title="Đánh dấu câu hỏi"
          >
            <svg className="w-5 h-5" fill={flaggedQuestions.has(question.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </button>
        </div>
        
        <h3 className="text-lg font-medium text-slate-900 mb-6">{question.question}</h3>

        <div className="space-y-2">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectAnswer(idx)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                answers[question.id] === idx
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                  answers[question.id] === idx
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-slate-700">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Quay lại
        </button>
        <div className="flex gap-2">
          {!isLast && (
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600"
            >
              Tiếp tục →
            </button>
          )}
          {isLast && (
            <button
              onClick={onSubmit}
              disabled={!allAnswered}
              className="px-6 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Nộp và phân tích lỗ hổng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ SCREEN 2b: Diagnostic Review ============
function ScreenDiagnosticReview({
  answers,
  questions,
  onContinue,
  onBack,
  onPractice,
  wrongCount
}: {
  answers: Record<number, number>;
  questions: DiagnosticQuestion[];
  onContinue: () => void;
  onBack: () => void;
  onPractice: () => void;
  wrongCount: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const question = questions[currentIndex];
  const userAnswer = answers[question.id];
  const isCorrect = userAnswer === question.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-500 rounded-xl p-4 text-white">
        <h2 className="text-lg font-semibold">Xem lại kết quả Diagnostic</h2>
        <p className="text-white/80 text-sm">Kiểm tra lại các câu trả lời trước khi xem phân tích lỗ hổng</p>
      </div>

      {/* Question Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex gap-2 flex-wrap">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCorrectQ = answers[q.id] === q.correctAnswer;
            const isCurrent = idx === currentIndex;
            
            let bgColor = 'bg-slate-200 hover:bg-slate-300';
            if (isAnswered) {
              bgColor = isCorrectQ ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
            }
            
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${bgColor} ${
                  isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                } text-white`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-green-500"></span> Đúng
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-red-500"></span> Sai
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-slate-200"></span> Chưa trả lời
          </span>
        </div>
      </div>

      {/* Question Card with Answer Review */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
              {question.topic}
            </span>
            {question.reference && (
              <span className="text-xs text-slate-400 font-mono">{question.reference}</span>
            )}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isCorrect ? 'bg-green-100 text-green-700' : 
            userAnswer !== undefined ? 'bg-red-100 text-red-700' : 
            'bg-slate-100 text-slate-600'
          }`}>
            {isCorrect ? '✓ Đúng' : 
             userAnswer !== undefined ? '✗ Sai' : 
             'Chưa trả lời'}
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-slate-900 mb-6">{question.question}</h3>

        <div className="space-y-2">
          {question.options.map((option, idx) => {
            const isUserAnswer = userAnswer === idx;
            const isCorrectAnswer = question.correctAnswer === idx;
            
            let bgClass = 'bg-slate-50 border-slate-200';
            let textClass = 'text-slate-600';
            
            if (isCorrectAnswer) {
              bgClass = 'bg-green-50 border-green-500';
              textClass = 'text-green-700';
            } else if (isUserAnswer && !isCorrectAnswer) {
              bgClass = 'bg-red-50 border-red-500';
              textClass = 'text-red-700';
            }
            
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border-2 ${bgClass}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                    isCorrectAnswer ? 'bg-green-500 text-white' :
                    isUserAnswer ? 'bg-red-500 text-white' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={textClass}>{option}</span>
                  {isCorrectAnswer && (
                    <span className="ml-auto text-green-600">✓ Đáp án đúng</span>
                  )}
                  {isUserAnswer && !isCorrectAnswer && (
                    <span className="ml-auto text-red-600">Đáp án của bạn</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          ← Quay lại chỉnh sửa
        </button>
        <div className="flex gap-2">
          <button
            onClick={onPractice}
            disabled={wrongCount === 0}
            className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ôn tập câu sai ({wrongCount})
          </button>
          <button
            onClick={onContinue}
            className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600"
          >
            Xem phân tích lỗ hổng →
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ SCREEN 2c: Diagnostic Review Practice ============
function ScreenDiagnosticReviewPractice({
  questions,
  answers,
  reviewAnswers,
  onAnswer,
  onFinish
}: {
  questions: DiagnosticQuestion[];
  answers: Record<number, number>;
  reviewAnswers: Record<number, number>;
  onAnswer: (qId: number, value: number) => void;
  onFinish: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get wrong questions with their review questions
  const wrongQuestions = questions.filter(q => answers[q.id] !== q.correctAnswer);
  
  if (wrongQuestions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Tuyệt vời!</h2>
        <p className="text-slate-600">Bạn không có câu nào sai. Tất cả đều đúng!</p>
        <button
          onClick={onFinish}
          className="mt-6 px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600"
        >
          Quay lại
        </button>
      </div>
    );
  }
  
  const currentWrongQuestion = wrongQuestions[currentIndex];
  const currentReviewQuestions = currentWrongQuestion.reviewQuestions || [];
  const hasReviewQuestions = currentReviewQuestions.length > 0;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-orange-500 rounded-xl p-4 text-white">
        <h2 className="text-lg font-semibold">Ôn tập câu sai</h2>
        <p className="text-white/80 text-sm">Làm các câu hỏi ôn tập để củng cố kiến thức</p>
      </div>
      
      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex gap-2 flex-wrap">
          {wrongQuestions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const hasReview = q.reviewQuestions && q.reviewQuestions.length > 0;
            const allAnswered = hasReview && q.reviewQuestions!.every(rq => reviewAnswers[rq.id] !== undefined);
            
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                  isCurrent ? 'bg-orange-500 text-white ring-2 ring-orange-300' : 
                  allAnswered ? 'bg-green-500 text-white' : 
                  'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-slate-500 mt-2">
          Câu gốc {currentIndex + 1}/{wrongQuestions.length}: {currentWrongQuestion.question.substring(0, 50)}...
        </p>
      </div>
      
      {/* Original question reminder */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-slate-500">CÂU HỎI GỐC:</span>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">Sai</span>
        </div>
        <p className="text-slate-700 font-medium">{currentWrongQuestion.question}</p>
        <p className="text-sm text-slate-500 mt-1">
          Đáp án đúng: {String.fromCharCode(65 + currentWrongQuestion.correctAnswer)}
        </p>
      </div>
      
      {/* Review Questions */}
      {hasReviewQuestions ? (
        <>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Câu hỏi ôn tập ({currentReviewQuestions.length})
            </h3>
            
            {currentReviewQuestions.map((rq, rqIdx) => {
              const userAnswer = reviewAnswers[rq.id];
              const isAnswered = userAnswer !== undefined;
              const isCorrect = userAnswer === rq.correctAnswer;
              
              return (
                <div key={rq.id} className="mb-6 last:mb-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">
                      Câu {rqIdx + 1}: {rq.question}
                    </span>
                    {isAnswered && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {isCorrect ? '✓ Đúng' : '✗ Sai'}
                      </span>
                    )}
                  </div>
                  
                  {rq.hint && !isAnswered && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-yellow-800">💡 Gợi ý: {rq.hint}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {rq.options.map((option, optIdx) => {
                      const isUserChoice = userAnswer === optIdx;
                      const isCorrectChoice = rq.correctAnswer === optIdx;
                      
                      return (
                        <button
                          key={optIdx}
                          onClick={() => onAnswer(rq.id, optIdx)}
                          disabled={isAnswered}
                          className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                            isAnswered
                              ? isCorrectChoice
                                ? 'border-green-500 bg-green-50'
                                : isUserChoice
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-slate-200 bg-slate-50 opacity-60'
                              : 'border-slate-200 hover:border-blue-300'
                          } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-medium ${
                              isAnswered
                                ? isCorrectChoice
                                  ? 'bg-green-500 text-white'
                                  : isUserChoice
                                    ? 'bg-red-500 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span className={`text-sm ${
                              isAnswered
                                ? isCorrectChoice
                                  ? 'text-green-700'
                                  : isUserChoice
                                    ? 'text-red-700'
                                    : 'text-slate-500'
                                : 'text-slate-700'
                            }`}>
                              {option}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {rq.hint && isAnswered && !isCorrect && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-yellow-800">💡 Gợi ý: {rq.hint}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Câu trước
            </button>
            <button
              onClick={() => {
                if (currentIndex < wrongQuestions.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                } else {
                  onFinish();
                }
              }}
              className="px-6 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600"
            >
              {currentIndex < wrongQuestions.length - 1 ? 'Câu tiếp theo →' : 'Hoàn thành ✓'}
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <p className="text-slate-500">Không có câu hỏi ôn tập cho câu này.</p>
          <button
            onClick={() => {
              if (currentIndex < wrongQuestions.length - 1) {
                setCurrentIndex(currentIndex + 1);
              } else {
                onFinish();
              }
            }}
            className="mt-4 px-6 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600"
          >
            {currentIndex < wrongQuestions.length - 1 ? 'Câu tiếp theo →' : 'Hoàn thành ✓'}
          </button>
        </div>
      )}
    </div>
  );
}

// ============ SCREEN 3: Diagnostic Result ============
function ScreenDiagnosticResult({
  result,
  onAdjust,
  onViewPath
}: {
  result: DiagnosticResult;
  onAdjust: () => void;
  onViewPath: () => void;
}) {
  const getReadinessColor = (readiness: DiagnosticResult['readiness']) => {
    switch (readiness) {
      case 'ready': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getReadinessText = (readiness: DiagnosticResult['readiness']) => {
    switch (readiness) {
      case 'ready': return 'Sẵn sàng';
      case 'partial': return 'Cần ôn tập thêm';
      default: return 'Chưa sẵn sàng';
    }
  };

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Kết quả chẩn đoán</h3>
            <p className="text-sm text-slate-500 mt-1">Phân tích lỗ hổng kiến thức của bạn</p>
          </div>
          <div className={`px-4 py-2 rounded-lg font-semibold ${getReadinessColor(result.readiness)}`}>
            {getReadinessText(result.readiness)}
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="12" fill="none" />
              <circle
                cx="64" cy="64" r="56"
                stroke={result.overallScore >= 80 ? '#22c55e' : result.overallScore >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(result.overallScore / 100) * 352} 352`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-900">{result.overallScore}%</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Độ hiểu</span>
                  <span className="font-medium">{result.overallScore >= 80 ? 'Tốt' : result.overallScore >= 50 ? 'Trung bình' : 'Cần cải thiện'}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${result.overallScore >= 80 ? 'bg-green-500' : result.overallScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${result.overallScore}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Cần học lại</span>
                  <span className="font-medium">{result.gaps.length} topics</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${(result.gaps.length / 5) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Độ tin cậy</span>
                  <span className="font-medium">{result.confidence}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${result.confidence}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gap List */}
        {result.gaps.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-3">Lỗ hổng được xác định:</h4>
            <div className="space-y-2">
              {result.gaps.map((gap, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                  <div className={`w-2 h-2 rounded-full ${
                    gap.level === 'high' ? 'bg-red-500' : gap.level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="text-sm font-medium text-slate-700">{gap.topic}</span>
                  {gap.reference && <span className="text-xs text-slate-400 font-mono ml-auto">{gap.reference}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onAdjust}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
        >
          <EditIcon />
          Điều chỉnh kết quả
        </button>
        <button
          onClick={onViewPath}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600"
        >
          Xem lộ trình
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}

// ============ SCREEN 4: Learning Path ============
function ScreenLearningPath({
  path,
  onStart
}: {
  path: typeof mockLearningPath;
  onStart: () => void;
}) {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const toggleModule = (id: string) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-1">{path.title}</h3>
        <p className="text-white/80 text-sm mb-4">{path.description}</p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span>⏱</span>
            <span>{path.totalTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📚</span>
            <span>{path.modules.length} modules</span>
          </div>
        </div>
      </div>

      {/* Module List */}
      <div className="space-y-3">
        {path.modules.map((mod, idx) => (
          <div key={mod.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => toggleModule(mod.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                  {idx + 1}
                </div>
                <div className="text-left">
                  <div className="font-medium text-slate-900">{mod.title}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono">{mod.reference}</span>
                    <span>•</span>
                    <span>{mod.estimatedTime}</span>
                  </div>
                </div>
              </div>
              <svg 
                className={`w-5 h-5 text-slate-400 transition-transform ${expandedModules.includes(mod.id) ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedModules.includes(mod.id) && (
              <div className="px-4 pb-4 pt-0">
                <div className="pl-11 space-y-3">
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-100">
                    <div className="flex items-start gap-2">
                      <span className="text-orange-500">⚠️</span>
                      <div>
                        <div className="text-xs font-medium text-orange-700 mb-1">Xử lý gap</div>
                        <p className="text-sm text-orange-800">{mod.gapContent}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <VideoIcon />
                    <span>Video bài giảng</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="w-full py-4 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
      >
        Bắt đầu học
      </button>
    </div>
  );
}

// ============ SCREEN 5: Post-Check ============
type PostCheckFilter = 'all' | 'answered' | 'unanswered' | 'flagged';

function ScreenPostCheck({
  answers,
  onAnswer,
  onSubmit
}: {
  answers: Record<number, number>;
  onAnswer: (id: number, value: number) => void;
  onSubmit: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<PostCheckFilter>('all');
  
  const question = postCheckQuestions[currentIndex];
  
  const handleNext = () => {
    if (currentIndex < postCheckQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSelectAnswer = (value: number) => {
    onAnswer(question.id, value);
  };

  const toggleFlag = (qId: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(qId)) {
        newSet.delete(qId);
      } else {
        newSet.add(qId);
      }
      return newSet;
    });
  };

  const answeredCount = postCheckQuestions.filter(q => answers[q.id] !== undefined).length;
  const unansweredCount = postCheckQuestions.length - answeredCount;
  
  const handleQuestionClick = (qId: number) => {
    const idx = postCheckQuestions.findIndex(q => q.id === qId);
    if (idx !== -1) {
      setCurrentIndex(idx);
    }
  };

  const progress = ((currentIndex + 1) / postCheckQuestions.length) * 100;
  const isLast = currentIndex === postCheckQuestions.length - 1;
  const allAnswered = postCheckQuestions.every(q => answers[q.id] !== undefined);

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tất cả ({postCheckQuestions.length})
        </button>
        <button
          onClick={() => setFilter('answered')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'answered'
              ? 'bg-green-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Đã trả lời ({answeredCount})
        </button>
        <button
          onClick={() => setFilter('unanswered')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'unanswered'
              ? 'bg-orange-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Chưa trả lời ({unansweredCount})
        </button>
        <button
          onClick={() => setFilter('flagged')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'flagged'
              ? 'bg-red-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Flag ({flaggedQuestions.size})
        </button>
      </div>

      {/* Question Navigation Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700">Chọn câu hỏi:</span>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-green-500"></span> Đã trả lời
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-slate-200"></span> Chưa trả lời
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-red-400"></span> Flag
            </span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {postCheckQuestions.map((q, idx) => {
            const isAnsweredQ = answers[q.id] !== undefined;
            const isFlagged = flaggedQuestions.has(q.id);
            const isCurrent = idx === currentIndex;
            
            let bgColor = 'bg-slate-200 hover:bg-slate-300';
            if (isFlagged) bgColor = 'bg-red-400 hover:bg-red-500';
            else if (isAnsweredQ) bgColor = 'bg-green-500 hover:bg-green-600';
            
            return (
              <button
                key={q.id}
                onClick={() => handleQuestionClick(q.id)}
                className={`relative w-10 h-10 rounded-lg font-medium text-sm transition-colors ${bgColor} ${
                  isCurrent ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
                } text-white`}
              >
                {idx + 1}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/>
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Câu {currentIndex + 1} / {postCheckQuestions.length}</span>
          <span className="font-medium text-emerald-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
              {question.topic}
            </span>
          </div>
          <button
            onClick={() => toggleFlag(question.id)}
            className={`p-2 rounded-lg transition-colors ${
              flaggedQuestions.has(question.id)
                ? 'bg-red-100 text-red-600'
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
            title="Đánh dấu câu hỏi"
          >
            <svg className="w-5 h-5" fill={flaggedQuestions.has(question.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </button>
        </div>
        
        <h3 className="text-lg font-medium text-slate-900 mb-6">{question.question}</h3>

        <div className="space-y-2">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectAnswer(idx)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                answers[question.id] === idx
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                  answers[question.id] === idx
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-slate-700">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Quay lại
        </button>
        <div className="flex gap-2">
          {!isLast && (
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600"
            >
              Tiếp tục →
            </button>
          )}
          {isLast && (
            <button
              onClick={onSubmit}
              disabled={!allAnswered}
              className="px-6 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xem kết quả
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ SCREEN 5c: Post-Check Review ============
function ScreenPostCheckReview({
  answers,
  questions,
  onContinue,
  onBack,
  onPractice,
  wrongCount
}: {
  answers: Record<number, number>;
  questions: PostCheckQuestion[];
  onContinue: () => void;
  onBack: () => void;
  onPractice: () => void;
  wrongCount: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const question = questions[currentIndex];
  const userAnswer = answers[question.id];
  const isCorrect = userAnswer === question.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-emerald-500 rounded-xl p-4 text-white">
        <h2 className="text-lg font-semibold">Xem lại kết quả Post-Check</h2>
        <p className="text-white/80 text-sm">Kiểm tra lại các câu trả lời trước khi xem kết quả cuối cùng</p>
      </div>

      {/* Question Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex gap-2 flex-wrap">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCorrectQ = answers[q.id] === q.correctAnswer;
            const isCurrent = idx === currentIndex;
            
            let bgColor = 'bg-slate-200 hover:bg-slate-300';
            if (isAnswered) {
              bgColor = isCorrectQ ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
            }
            
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${bgColor} ${
                  isCurrent ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
                } text-white`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-green-500"></span> Đúng
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-red-500"></span> Sai
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-slate-200"></span> Chưa trả lời
          </span>
        </div>
      </div>

      {/* Question Card with Answer Review */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
              {question.topic}
            </span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isCorrect ? 'bg-green-100 text-green-700' : 
            userAnswer !== undefined ? 'bg-red-100 text-red-700' : 
            'bg-slate-100 text-slate-600'
          }`}>
            {isCorrect ? '✓ Đúng' : 
             userAnswer !== undefined ? '✗ Sai' : 
             'Chưa trả lời'}
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-slate-900 mb-6">{question.question}</h3>

        <div className="space-y-2">
          {question.options.map((option, idx) => {
            const isUserAnswer = userAnswer === idx;
            const isCorrectAnswer = question.correctAnswer === idx;
            
            let bgClass = 'bg-slate-50 border-slate-200';
            let textClass = 'text-slate-600';
            
            if (isCorrectAnswer) {
              bgClass = 'bg-green-50 border-green-500';
              textClass = 'text-green-700';
            } else if (isUserAnswer && !isCorrectAnswer) {
              bgClass = 'bg-red-50 border-red-500';
              textClass = 'text-red-700';
            }
            
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border-2 ${bgClass}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                    isCorrectAnswer ? 'bg-green-500 text-white' :
                    isUserAnswer ? 'bg-red-500 text-white' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={textClass}>{option}</span>
                  {isCorrectAnswer && (
                    <span className="ml-auto text-green-600">✓ Đáp án đúng</span>
                  )}
                  {isUserAnswer && !isCorrectAnswer && (
                    <span className="ml-auto text-red-600">Đáp án của bạn</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          ← Quay lại chỉnh sửa
        </button>
        <div className="flex gap-2">
          <button
            onClick={onPractice}
            disabled={wrongCount === 0}
            className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ôn tập câu sai ({wrongCount})
          </button>
          <button
            onClick={onContinue}
            className="px-6 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600"
          >
            Xem kết quả cuối cùng →
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ SCREEN 5d: Post-Check Review Practice ============
function ScreenPostCheckReviewPractice({
  questions,
  answers,
  reviewAnswers,
  onAnswer,
  onFinish
}: {
  questions: PostCheckQuestion[];
  answers: Record<number, number>;
  reviewAnswers: Record<number, number>;
  onAnswer: (qId: number, value: number) => void;
  onFinish: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get wrong questions with their review questions
  const wrongQuestions = questions.filter(q => answers[q.id] !== q.correctAnswer);
  
  if (wrongQuestions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Tuyệt vời!</h2>
        <p className="text-slate-600">Bạn không có câu nào sai. Tất cả đều đúng!</p>
        <button
          onClick={onFinish}
          className="mt-6 px-6 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600"
        >
          Quay lại
        </button>
      </div>
    );
  }
  
  const currentWrongQuestion = wrongQuestions[currentIndex];
  const currentReviewQuestions = currentWrongQuestion.reviewQuestions || [];
  const hasReviewQuestions = currentReviewQuestions.length > 0;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-orange-500 rounded-xl p-4 text-white">
        <h2 className="text-lg font-semibold">Ôn tập câu sai</h2>
        <p className="text-white/80 text-sm">Làm các câu hỏi ôn tập để củng cố kiến thức</p>
      </div>
      
      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex gap-2 flex-wrap">
          {wrongQuestions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const hasReview = q.reviewQuestions && q.reviewQuestions.length > 0;
            const allAnswered = hasReview && q.reviewQuestions!.every(rq => reviewAnswers[rq.id] !== undefined);
            
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                  isCurrent ? 'bg-orange-500 text-white ring-2 ring-orange-300' : 
                  allAnswered ? 'bg-green-500 text-white' : 
                  'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-slate-500 mt-2">
          Câu gốc {currentIndex + 1}/{wrongQuestions.length}: {currentWrongQuestion.question.substring(0, 50)}...
        </p>
      </div>
      
      {/* Original question reminder */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-slate-500">CÂU HỎI GỐC:</span>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">Sai</span>
        </div>
        <p className="text-slate-700 font-medium">{currentWrongQuestion.question}</p>
        <p className="text-sm text-slate-500 mt-1">
          Đáp án đúng: {String.fromCharCode(65 + currentWrongQuestion.correctAnswer)}
        </p>
      </div>
      
      {/* Review Questions */}
      {hasReviewQuestions ? (
        <>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Câu hỏi ôn tập ({currentReviewQuestions.length})
            </h3>
            
            {currentReviewQuestions.map((rq, rqIdx) => {
              const userAnswer = reviewAnswers[rq.id];
              const isAnswered = userAnswer !== undefined;
              const isCorrect = userAnswer === rq.correctAnswer;
              
              return (
                <div key={rq.id} className="mb-6 last:mb-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">
                      Câu {rqIdx + 1}: {rq.question}
                    </span>
                    {isAnswered && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {isCorrect ? '✓ Đúng' : '✗ Sai'}
                      </span>
                    )}
                  </div>
                  
                  {rq.hint && !isAnswered && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-yellow-800">💡 Gợi ý: {rq.hint}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {rq.options.map((option, optIdx) => {
                      const isUserChoice = userAnswer === optIdx;
                      const isCorrectChoice = rq.correctAnswer === optIdx;
                      
                      return (
                        <button
                          key={optIdx}
                          onClick={() => onAnswer(rq.id, optIdx)}
                          disabled={isAnswered}
                          className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                            isAnswered
                              ? isCorrectChoice
                                ? 'border-green-500 bg-green-50'
                                : isUserChoice
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-slate-200 bg-slate-50 opacity-60'
                              : 'border-slate-200 hover:border-emerald-300'
                          } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-medium ${
                              isAnswered
                                ? isCorrectChoice
                                  ? 'bg-green-500 text-white'
                                  : isUserChoice
                                    ? 'bg-red-500 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span className={`text-sm ${
                              isAnswered
                                ? isCorrectChoice
                                  ? 'text-green-700'
                                  : isUserChoice
                                    ? 'text-red-700'
                                    : 'text-slate-500'
                                : 'text-slate-700'
                            }`}>
                              {option}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {rq.hint && isAnswered && !isCorrect && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-yellow-800">💡 Gợi ý: {rq.hint}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Câu trước
            </button>
            <button
              onClick={() => {
                if (currentIndex < wrongQuestions.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                } else {
                  onFinish();
                }
              }}
              className="px-6 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600"
            >
              {currentIndex < wrongQuestions.length - 1 ? 'Câu tiếp theo →' : 'Hoàn thành ✓'}
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <p className="text-slate-500">Không có câu hỏi ôn tập cho câu này.</p>
          <button
            onClick={() => {
              if (currentIndex < wrongQuestions.length - 1) {
                setCurrentIndex(currentIndex + 1);
              } else {
                onFinish();
              }
            }}
            className="mt-4 px-6 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600"
          >
            {currentIndex < wrongQuestions.length - 1 ? 'Câu tiếp theo →' : 'Hoàn thành ✓'}
          </button>
        </div>
      )}
    </div>
  );
}

// ============ SCREEN 5e: Post-Check Result ============
function ScreenPostCheckResult({
  score,
  passed,
  correctCount,
  total,
  onReview,
  onRetry
}: {
  score: number;
  passed: boolean;
  correctCount: number;
  total: number;
  onReview: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-8 space-y-6">
      {/* Result Icon */}
      <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
        passed 
          ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
          : 'bg-gradient-to-br from-yellow-400 to-orange-500'
      }`}>
        {passed ? (
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
      </div>

      {/* Result Text */}
      <div className="text-center">
        <h2 className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
          {passed ? 'READY' : 'NOT READY'}
        </h2>
        <p className="text-slate-600 mt-2 max-w-sm">
          {passed 
            ? 'Chúc mừng! Bạn đã đạt điểm chuẩn và sẵn sàng cho buổi học tiếp theo.'
            : 'Bạn cần ôn tập thêm để đạt điểm chuẩn. Hãy xem lại lộ trình học bù.'
          }
        </p>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm">
        <div className="text-center mb-4">
          <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
            {score}%
          </div>
          <div className="text-sm text-slate-500 mt-1">
            {correctCount} / {total} câu đúng
          </div>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${passed ? 'bg-green-500' : 'bg-yellow-500'}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>0%</span>
          <span className="text-slate-700 font-medium">Điểm chuẩn: 80%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 w-full max-w-sm">
        <button
          onClick={onReview}
          className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
        >
          Xem lại kết quả
        </button>
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
        >
          <RefreshIcon />
          Làm lại
        </button>
      </div>
    </div>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('vlearn-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [state, setState] = useState<AppState>({
    currentStep: 'setup',
    selectedSession: null,
    selectedTimeSlot: null,
    learningGoal: '',
    diagnosticAnswers: {},
    diagnosticSubmitted: false,
    diagnosticResult: null,
    diagnosticWrongQuestions: [],
    diagnosticReviewAnswers: {},
    learningPath: null,
    selectedModules: [],
    postCheckAnswers: {},
    postCheckSubmitted: false,
    postCheckResult: null,
    postCheckWrongQuestions: [],
    postCheckReviewAnswers: {},
    isEditingGaps: false,
  });

  useEffect(() => {
    localStorage.setItem('vlearn-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Handlers
  const handleSessionChange = (session: Session) => {
    setState(prev => ({ ...prev, selectedSession: session }));
  };

  const handleStartDiagnostic = () => {
    setState(prev => ({ ...prev, currentStep: 'diagnostic' }));
  };

  const handleDiagnosticAnswer = (id: number, value: number) => {
    setState(prev => ({
      ...prev,
      diagnosticAnswers: { ...prev.diagnosticAnswers, [id]: value }
    }));
  };

  const handleDiagnosticSubmit = () => {
    // Calculate wrong questions
    const wrongQuestions = diagnosticQuestions
      .filter(q => state.diagnosticAnswers[q.id] !== q.correctAnswer)
      .map(q => q.id);
    
    // Go to review screen first
    setState(prev => ({
      ...prev,
      diagnosticSubmitted: true,
      diagnosticWrongQuestions: wrongQuestions,
      diagnosticReviewAnswers: {},
      currentStep: 'diagnostic-review'
    }));
  };

  const handleDiagnosticPractice = () => {
    setState(prev => ({
      ...prev,
      currentStep: 'diagnostic-review-practice'
    }));
  };

  const handleDiagnosticReviewAnswer = (qId: number, value: number) => {
    setState(prev => ({
      ...prev,
      diagnosticReviewAnswers: { ...prev.diagnosticReviewAnswers, [qId]: value }
    }));
  };

  const handleDiagnosticPracticeFinish = () => {
    setState(prev => ({
      ...prev,
      currentStep: 'diagnostic-result'
    }));
  };

  const handleAdjustResults = () => {
    setState(prev => ({ ...prev, isEditingGaps: true }));
  };

  const handleViewPath = () => {
    setState(prev => ({
      ...prev,
      learningPath: mockLearningPath,
      currentStep: 'learning-path'
    }));
  };

  const handleStartLearning = () => {
    setState(prev => ({ ...prev, currentStep: 'post-check' }));
  };

  const handlePostCheckAnswer = (id: number, value: number) => {
    setState(prev => ({
      ...prev,
      postCheckAnswers: { ...prev.postCheckAnswers, [id]: value }
    }));
  };

  const handlePostCheckSubmit = () => {
    // Calculate wrong questions
    const wrongQuestions = postCheckQuestions
      .filter(q => state.postCheckAnswers[q.id] !== q.correctAnswer)
      .map(q => q.id);
    
    // Go to review screen first
    setState(prev => ({
      ...prev,
      postCheckSubmitted: true,
      postCheckWrongQuestions: wrongQuestions,
      postCheckReviewAnswers: {},
      currentStep: 'post-check-review'
    }));
  };

  const handlePostCheckPractice = () => {
    setState(prev => ({
      ...prev,
      currentStep: 'post-check-review-practice'
    }));
  };

  const handlePostCheckReviewAnswer = (qId: number, value: number) => {
    setState(prev => ({
      ...prev,
      postCheckReviewAnswers: { ...prev.postCheckReviewAnswers, [qId]: value }
    }));
  };

  const handlePostCheckPracticeFinish = () => {
    setState(prev => ({
      ...prev,
      currentStep: 'post-check-result'
    }));
  };

  const handleReview = () => {
    // Go back to post-check to review answers
    setState(prev => ({ ...prev, postCheckSubmitted: false }));
  };

  const handleRetry = () => {
    // Reset post-check
    setState(prev => ({
      ...prev,
      currentStep: 'post-check',
      postCheckAnswers: {},
      postCheckSubmitted: false,
      postCheckResult: null
    }));
  };

  const handleGoToSetup = () => {
    setState(prev => ({
      ...prev,
      currentStep: 'setup',
      selectedSession: null,
      selectedTimeSlot: null,
      learningGoal: '',
      diagnosticAnswers: {},
      diagnosticSubmitted: false,
      diagnosticResult: null,
      diagnosticWrongQuestions: [],
      diagnosticReviewAnswers: {},
      learningPath: null,
      selectedModules: [],
      postCheckAnswers: {},
      postCheckSubmitted: false,
      postCheckResult: null,
      postCheckWrongQuestions: [],
      postCheckReviewAnswers: {},
      isEditingGaps: false,
    }));
  };

  // Render current step
  const renderStep = () => {
    switch (state.currentStep) {
      case 'setup':
        return (
          <ScreenSetup
            session={state.selectedSession}
            onSessionChange={handleSessionChange}
            onStart={handleStartDiagnostic}
          />
        );
      case 'diagnostic':
        return (
          <ScreenDiagnostic
            answers={state.diagnosticAnswers}
            onAnswer={handleDiagnosticAnswer}
            onSubmit={handleDiagnosticSubmit}
          />
        );
      case 'diagnostic-review':
        return (
          <ScreenDiagnosticReview
            answers={state.diagnosticAnswers}
            questions={diagnosticQuestions}
            onContinue={handleDiagnosticContinue}
            onBack={handleDiagnosticBack}
            onPractice={handleDiagnosticPractice}
            wrongCount={state.diagnosticWrongQuestions.length}
          />
        );
      case 'diagnostic-review-practice':
        return (
          <ScreenDiagnosticReviewPractice
            questions={diagnosticQuestions}
            answers={state.diagnosticAnswers}
            reviewAnswers={state.diagnosticReviewAnswers}
            onAnswer={handleDiagnosticReviewAnswer}
            onFinish={handleDiagnosticPracticeFinish}
          />
        );
      case 'diagnostic-result':
        return state.diagnosticResult ? (
          <ScreenDiagnosticResult
            result={state.diagnosticResult}
            onAdjust={handleAdjustResults}
            onViewPath={handleViewPath}
          />
        ) : null;
      case 'learning-path':
        return state.learningPath ? (
          <ScreenLearningPath
            path={state.learningPath}
            onStart={handleStartLearning}
          />
        ) : null;
      case 'post-check':
        return (
          <ScreenPostCheck
            answers={state.postCheckAnswers}
            onAnswer={handlePostCheckAnswer}
            onSubmit={handlePostCheckSubmit}
          />
        );
      case 'post-check-review':
        return (
          <ScreenPostCheckReview
            answers={state.postCheckAnswers}
            questions={postCheckQuestions}
            onContinue={handlePostCheckContinue}
            onBack={handlePostCheckBack}
            onPractice={handlePostCheckPractice}
            wrongCount={state.postCheckWrongQuestions.length}
          />
        );
      case 'post-check-review-practice':
        return (
          <ScreenPostCheckReviewPractice
            questions={postCheckQuestions}
            answers={state.postCheckAnswers}
            reviewAnswers={state.postCheckReviewAnswers}
            onAnswer={handlePostCheckReviewAnswer}
            onFinish={handlePostCheckPracticeFinish}
          />
        );
      case 'post-check-result':
        return state.postCheckResult ? (
          <ScreenPostCheckResult
            score={state.postCheckResult.score}
            passed={state.postCheckResult.passed}
            correctCount={state.postCheckResult.correctCount}
            total={state.postCheckResult.totalQuestions}
            onReview={handleReview}
            onRetry={handleRetry}
          />
        ) : null;
      default:
        return null;
    }
  };

  // Get step title
  const getStepTitle = () => {
    switch (state.currentStep) {
      case 'setup': return 'Thiết lập phiên học bù';
      case 'diagnostic': return 'Diagnostic Test';
      case 'diagnostic-review': return 'Xem lại Diagnostic';
      case 'diagnostic-review-practice': return 'Ôn tập';
      case 'diagnostic-result': return 'Kết quả chẩn đoán';
      case 'learning-path': return 'Lộ trình học bù';
      case 'post-check': return 'Post-Check';
      case 'post-check-review': return 'Xem lại Post-Check';
      case 'post-check-review-practice': return 'Ôn tập';
      case 'post-check-result': return 'Kết quả Post-Check';
      default: return '';
    }
  };

  // Navigation handlers
  const handleGoToDiagnostic = () => {
    setState(prev => ({ ...prev, currentStep: 'diagnostic' }));
  };

  const handleGoToDiagnosticResult = () => {
    if (state.diagnosticResult) {
      setState(prev => ({ ...prev, currentStep: 'diagnostic-result' }));
    }
  };

  const handleGoToLearningPath = () => {
    if (state.learningPath) {
      setState(prev => ({ ...prev, currentStep: 'learning-path' }));
    }
  };

  const handleGoToPostCheck = () => {
    setState(prev => ({ ...prev, currentStep: 'post-check' }));
  };

  const handleDiagnosticBack = () => {
    setState(prev => ({ ...prev, currentStep: 'diagnostic' }));
  };

  const handleDiagnosticContinue = () => {
    // Analyze results (mock AI call)
    const result = analyzeDiagnosticResults(state.diagnosticAnswers, diagnosticQuestions);
    setState(prev => ({
      ...prev,
      diagnosticResult: result,
      currentStep: 'diagnostic-result'
    }));
  };

  const handlePostCheckBack = () => {
    setState(prev => ({ ...prev, currentStep: 'post-check' }));
  };

  const handlePostCheckContinue = () => {
    // Calculate score
    let correct = 0;
    postCheckQuestions.forEach(q => {
      if (state.postCheckAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    const score = Math.round((correct / postCheckQuestions.length) * 100);
    
    setState(prev => ({
      ...prev,
      postCheckResult: {
        score,
        passed: score >= 80,
        correctCount: correct,
        totalQuestions: postCheckQuestions.length
      },
      currentStep: 'post-check-result'
    }));
  };

  // Get breadcrumb
  const getBreadcrumb = () => {
    if (state.currentStep === 'setup') return null;
    
    const stepOrder = ['setup', 'diagnostic', 'diagnostic-review', 'diagnostic-review-practice', 'diagnostic-result', 'learning-path', 'post-check', 'post-check-review', 'post-check-review-practice', 'post-check-result'];
    const currentIndex = stepOrder.indexOf(state.currentStep);
    
    const getClassName = (idx: number) => {
      if (idx === currentIndex) return 'text-blue-600 font-medium';
      if (idx < currentIndex) return 'text-slate-600';
      return 'text-slate-400';
    };
    
    const isDiagnosticDone = ['diagnostic-review', 'diagnostic-review-practice', 'diagnostic-result', 'learning-path', 'post-check', 'post-check-review', 'post-check-review-practice', 'post-check-result'].includes(state.currentStep);
    const isDiagnosticResultDone = ['diagnostic-result', 'learning-path', 'post-check', 'post-check-review', 'post-check-review-practice', 'post-check-result'].includes(state.currentStep);
    const isLearningPathDone = ['learning-path', 'post-check', 'post-check-review', 'post-check-review-practice', 'post-check-result'].includes(state.currentStep);
    const isPostCheckDone = ['post-check', 'post-check-review', 'post-check-review-practice', 'post-check-result'].includes(state.currentStep);
    const isPostCheckReviewDone = ['post-check-review', 'post-check-review-practice', 'post-check-result'].includes(state.currentStep);
    const isPostCheckPracticeDone = state.currentStep === 'post-check-result';
    
    const isPracticeScreen = state.currentStep === 'diagnostic-review-practice' || state.currentStep === 'post-check-review-practice';
    if (isPracticeScreen) return null;
    
    return (
      <div className="flex items-center gap-2 text-sm mb-6 flex-wrap">
        <button onClick={handleGoToSetup} className={`hover:text-blue-600 px-2 py-1 rounded ${getClassName(0)}`}>
          1. Thiết lập
        </button>
        <span className="text-slate-300">→</span>
        <button onClick={handleGoToDiagnostic} className={`hover:text-blue-600 px-2 py-1 rounded ${getClassName(1)}`}>
          2. Diagnostic
        </button>
        {isDiagnosticDone && (
          <>
            <span className="text-slate-300">→</span>
            <button onClick={handleDiagnosticBack} className={`hover:text-blue-600 px-2 py-1 rounded ${getClassName(2)}`}>
              3. Xem lại
            </button>
          </>
        )}
        {isDiagnosticResultDone && (
          <>
            <span className="text-slate-300">→</span>
            <button onClick={handleGoToDiagnosticResult} className={`hover:text-blue-600 px-2 py-1 rounded ${getClassName(4)}`}>
              4. Kết quả
            </button>
          </>
        )}
        {isLearningPathDone && (
          <>
            <span className="text-slate-300">→</span>
            <button onClick={handleGoToLearningPath} className={`hover:text-blue-600 px-2 py-1 rounded ${getClassName(5)}`}>
              5. Học bù
            </button>
          </>
        )}
        {isPostCheckDone && (
          <>
            <span className="text-slate-300">→</span>
            <button onClick={handleGoToPostCheck} className={`hover:text-blue-600 px-2 py-1 rounded ${getClassName(6)}`}>
              6. Post-Check
            </button>
          </>
        )}
        {isPostCheckReviewDone && (
          <>
            <span className="text-slate-300">→</span>
            <button onClick={handlePostCheckBack} className={`hover:text-blue-600 px-2 py-1 rounded ${getClassName(7)}`}>
              7. Xem lại
            </button>
          </>
        )}
        {isPostCheckPracticeDone && (
          <>
            <span className="text-slate-300">→</span>
            <span className="text-blue-600 font-medium px-2 py-1">8. Kết quả</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} flex min-h-screen bg-slate-50 transition-colors duration-200`}>
      {/* Sidebar */}
      <Sidebar>
        <div className="space-y-1.5">
          <NavItem icon={<HomeIcon />} label="Dashboard" />
          <NavItem icon={<BookIcon />} label="Bài học" />
          <NavItem icon={<ChartIcon />} label="Tiến độ" active badge="3/6" />
          <NavItem icon={<CalendarIcon />} label="Lịch học" />
          <NavItem icon={<SettingsIcon />} label="Cài đặt" />
        </div>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header 
          title={getStepTitle()}
          subtitle={state.selectedSession ? `${state.selectedSession.title} • Ngày ${state.selectedSession.day}` : undefined}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(prev => !prev)}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl mx-auto">
            {getBreadcrumb()}
            <div className="animate-fadeIn">
              {renderStep()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
