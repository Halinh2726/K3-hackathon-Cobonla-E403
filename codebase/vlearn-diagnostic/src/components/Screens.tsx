import { useState } from 'react';
import { sessions, timeSlots } from '../data';

interface DashboardProps {
  onSwitchTab: (tab: 'progress' | 'lessons') => void;
  aiQuizHistory: { title: string; date: string; score: number }[];
  diagnosticScore: number | null;
}

export function ScreenDashboard({ onSwitchTab, aiQuizHistory, diagnosticScore }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-12 -translate-y-6">
          <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 13a1 1 0 112 0 1 1 0 01-2 0zm1-9a1 1 0 00-1 1v5a1 1 0 102 0V5a1 1 0 00-1-1z" />
          </svg>
        </div>
        <div className="relative z-10">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">Học Viên AI</span>
          <h2 className="text-2xl font-bold mt-3 mb-1">Chào mừng bạn quay lại học tập!</h2>
          <p className="text-white/80 text-sm max-w-md">Hôm nay hãy tiếp tục hoàn thành các mục tiêu học bù và ôn tập để nắm vững kiến thức khóa AI Thực Chiến.</p>
          <button 
            onClick={() => onSwitchTab('lessons')}
            className="mt-4 px-4 py-2 bg-white text-indigo-700 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-md flex items-center gap-1.5"
          >
            📚 Xem tài liệu bài học
          </button>
        </div>
      </div>

      {/* State Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Diagnostic Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">Điểm Diagnostic</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">📊</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {diagnosticScore !== null ? `${diagnosticScore}%` : 'Chưa thi'}
            </span>
            {diagnosticScore !== null && (
              <span className="text-xs text-green-600 font-medium">
                {diagnosticScore >= 80 ? '✓ Đạt chuẩn' : '⚠ Cần ôn tập'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Bài đánh giá chẩn đoán đầu vào để tìm lỗ hổng kiến thức.</p>
        </div>

        {/* Card 2: AI Quizzes Completed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">Trắc nghiệm từ AI Agent</span>
            <span className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">🤖</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{aiQuizHistory.length}</span>
            <span className="text-xs text-slate-400">bài đã làm</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Các bài quizz do AI tự động tạo dựa trên yêu cầu học viên.</p>
        </div>

        {/* Card 3: Agent Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">AI Tutor Agent</span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">Sẵn sàng</span>
            <span className="text-xs text-green-600 font-medium">Gemini 3.5 Flash</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Nhấp vào bong bóng chat bên góc màn hình để hỏi và học với AI.</p>
        </div>
      </div>

      {/* Main Section layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 columns: AI Quizzes History */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span>📝</span> Lịch sử bài trắc nghiệm từ AI Agent
          </h3>
          {aiQuizHistory.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/20">
              <span className="text-3xl">🧩</span>
              <p className="text-sm text-slate-500 mt-2 font-medium">Chưa có bài kiểm tra AI nào được thực hiện.</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Hãy bảo AI Tutor: "Tạo bài trắc nghiệm về Day 2", sau đó click vào link để làm bài và lưu kết quả.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {aiQuizHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:border-blue-300 dark:hover:border-blue-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                      Q
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{h.title}</h4>
                      <p className="text-xs text-slate-400">{h.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Đạt:</span>
                    <span className={`px-2.5 py-1 rounded-lg font-bold text-sm ${h.score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : h.score >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'}`}>
                      {h.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 column: Course Stats */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
            📊 Trạng thái khóa học
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5 uppercase">
                <span>Tiến độ học bù</span>
                <span className="text-blue-600">50%</span>
              </div>
              <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Các mốc cần hoàn thành</h4>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="text-xs bg-green-100 text-green-700 rounded-full w-5 h-5 flex items-center justify-center shrink-0">✓</span>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Day 1 Foundation</p>
                    <p className="text-slate-400">Đã hoàn thành ôn tập & chẩn đoán</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-xs bg-green-100 text-green-700 rounded-full w-5 h-5 flex items-center justify-center shrink-0">✓</span>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Day 2 Business Problems</p>
                    <p className="text-slate-400">Đã chẩn đoán lỗ hổng</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-xs bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center shrink-0">→</span>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">Day 3 Xây dựng AI Agent</p>
                    <p className="text-blue-600 font-medium">Đang học tập</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LessonsProps {
  onOpenChatWithQuery: (query: string) => void;
}

export function ScreenLessons({ onOpenChatWithQuery }: LessonsProps) {
  const [expandedSession, setExpandedSession] = useState<string | null>('day1');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Tài liệu học tập</h3>
        <p className="text-sm text-slate-500 mb-6">Xem nhanh các chủ đề kiến thức chính của khóa học. Bạn có thể yêu cầu AI Tutor giảng giải chi tiết về bất kỳ chủ đề nào.</p>

        <div className="space-y-4">
          {sessions.map((s) => {
            const isExpanded = expandedSession === s.id;
            return (
              <div key={s.id} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20">
                <button
                  onClick={() => setExpandedSession(isExpanded ? null : s.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                      Day {s.day}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{s.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">Thời lượng: {s.duration} phút</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : s.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-850 dark:text-slate-400'}`}>
                      {s.status === 'completed' ? 'Hoàn thành' : s.status === 'in-progress' ? 'Đang học' : 'Chưa học'}
                    </span>
                    <svg className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {isExpanded && (
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chủ đề chi tiết</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {s.topics.map((t, i) => (
                        <div key={i} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 hover:shadow-sm transition-all flex flex-col justify-between">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t}</span>
                          <button
                            onClick={() => onOpenChatWithQuery(`Giải thích chi tiết cho tôi chủ đề: "${t}" dựa trên bài giảng.`)}
                            className="mt-3 text-xs text-blue-600 font-semibold hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 text-left"
                          >
                            🤖 Hỏi AI Tutor →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ScreenSchedule() {
  const [selectedSlot, setSelectedSlot] = useState<string>('slot1');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccess(true);
    setTimeout(() => setRegSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Đăng ký lịch học bù</h3>
        <p className="text-sm text-slate-500 mb-6">Chọn khung giờ rảnh của bạn để hệ thống VLearn sắp xếp lịch học bù, thảo luận nhóm cùng các trợ giảng TA.</p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Chọn ca học rảnh</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot.id}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${!slot.available ? 'bg-slate-50 text-slate-400 border-slate-100 opacity-60 cursor-not-allowed' : selectedSlot === slot.id ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 text-blue-700' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-2">
                    <span>⏰</span>
                    <span className="font-semibold text-sm">{slot.time}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${slot.available ? selectedSlot === slot.id ? 'bg-blue-600 text-white' : 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                    {slot.available ? selectedSlot === slot.id ? 'Đang chọn' : 'Trống' : 'Hết chỗ'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ghi chú mục tiêu học tập</label>
            <textarea 
              rows={3}
              placeholder="Ví dụ: Tôi muốn học bù lại kiến thức về Agentic Workflow của Day 3..." 
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span>📅</span> Xác nhận đăng ký ca học bù
          </button>

          {regSuccess && (
            <div className="p-3 bg-green-100 text-green-800 rounded-xl text-sm text-center font-semibold animate-fadeIn">
              ✓ Đăng ký ca học bù thành công! Trợ giảng sẽ liên hệ hỗ trợ bạn.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

interface SettingsProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function ScreenSettings({ apiKey, onApiKeyChange, isDarkMode, onToggleTheme }: SettingsProps) {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onApiKeyChange(inputKey);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Cấu hình Hệ thống</h3>
        <p className="text-sm text-slate-500 mb-6">Quản lý các cài đặt cấu hình cho AI Agent Chatbot và giao diện ứng dụng.</p>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Gemini API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Nhập API Key bắt đầu bằng AQ..."
                className="w-full p-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 text-sm font-mono focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showKey ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Mẹo: Bạn có thể đổi API key sang key cá nhân của bạn tại đây để kiểm tra.</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
            <div>
              <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Chế độ tối (Dark Mode)</span>
              <span className="text-xs text-slate-400">Thay đổi màu sắc giao diện theo sở thích</span>
            </div>
            <button
              type="button"
              onClick={onToggleTheme}
              className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center ${isDarkMode ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'}`}
            >
              <span className="w-5.5 h-5.5 bg-white rounded-full shadow-sm"></span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md"
          >
            Lưu cài đặt
          </button>

          {success && (
            <div className="p-3 bg-green-100 text-green-800 rounded-xl text-sm text-center font-semibold animate-fadeIn">
              ✓ Cấu hình đã được lưu và cập nhật thành công!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

interface AIQuizProps {
  quiz: {
    title: string;
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
      hint?: string;
    }[];
  };
  answers: Record<number, number>;
  submitted: boolean;
  onAnswer: (index: number, choiceIndex: number) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function ScreenAIQuiz({ quiz, answers, submitted, onAnswer, onSubmit, onBack }: AIQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIdx];

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  const allAnswered = quiz.questions.every((_, i) => answers[i] !== undefined);

  if (submitted) {
    const score = calculateScore();
    const isPassed = score >= 80;
    const currentReviewQuestion = quiz.questions[activeReviewIdx];
    const userChoice = answers[activeReviewIdx];
    const isCorrect = userChoice === currentReviewQuestion.correctAnswer;

    return (
      <div className="w-full space-y-6 animate-fadeIn py-4">
        {/* Score Card Dashboard */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="7" fill="none" className="dark:stroke-slate-800" />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke={isPassed ? '#10b981' : '#f59e0b'}
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 251} 251`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{score}%</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${isPassed ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'}`}>
                {isPassed ? 'Đạt' : 'Chưa đạt'}
              </span>
            </div>
          </div>
          
          <div className="text-center md:text-left space-y-1.5">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{quiz.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {isPassed 
                ? 'Chúc mừng! Bạn đã hoàn thành xuất sắc bài luyện tập trắc nghiệm tự động của AI Tutor và đạt chuẩn đầu ra.'
                : 'Kết quả chưa đạt chuẩn (yêu cầu ≥ 80%). Hãy xem lại các đáp án và lời giải chi tiết bên dưới để củng cố thêm kiến thức.'}
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Left Column: Navigator */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center gap-1.5">
              <span>📋</span> Danh sách câu hỏi
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {quiz.questions.map((q, idx) => {
                const ans = answers[idx];
                const isCorrectQ = ans === q.correctAnswer;
                const isActive = idx === activeReviewIdx;
                
                let btnCls = 'h-10 rounded-lg font-bold text-xs flex items-center justify-center transition-all ';
                if (isActive) {
                  btnCls += 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-slate-950 ';
                }
                if (isCorrectQ) {
                  btnCls += 'bg-green-500 hover:bg-green-600 text-white shadow-sm shadow-green-500/20';
                } else {
                  btnCls += 'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-500/20';
                }
                
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveReviewIdx(idx)}
                    className={btnCls}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-green-500"></span> Đúng
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-red-500"></span> Sai
              </span>
              <span className="flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                Câu {activeReviewIdx + 1} / {quiz.questions.length}
              </span>
            </div>
          </div>

          {/* Right Column: Main Detail */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <span>🔍</span> Chi tiết câu hỏi {activeReviewIdx + 1}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isCorrect ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'}`}>
                {isCorrect ? 'Đúng' : 'Sai'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <span className="text-sm font-bold text-slate-400 mt-0.5">Q:</span>
                <h4 className="font-bold text-base text-slate-850 dark:text-slate-200 leading-relaxed">
                  {currentReviewQuestion.question}
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-2 pl-5">
                {currentReviewQuestion.options.map((opt, optIdx) => {
                  const isUserAns = userChoice === optIdx;
                  const isCorrectAns = currentReviewQuestion.correctAnswer === optIdx;
                  
                  let optionStyle = 'flex items-center gap-3 p-3.5 rounded-xl border text-sm transition-all ';
                  let statusBadge = null;
                  
                  if (isCorrectAns) {
                    optionStyle += 'bg-green-500/5 dark:bg-green-950/10 border-green-500 text-green-800 dark:text-green-400 font-semibold';
                    statusBadge = <span className="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 font-semibold shrink-0">✓ Đáp án đúng</span>;
                  } else if (isUserAns && !isCorrectAns) {
                    optionStyle += 'bg-red-500/5 dark:bg-red-950/10 border-red-400 text-red-800 dark:text-red-400 font-semibold';
                    statusBadge = <span className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-semibold shrink-0">✗ Bạn chọn sai</span>;
                  } else {
                    optionStyle += 'bg-slate-50/50 dark:bg-slate-900 border-slate-150 dark:border-slate-800/80 text-slate-600 dark:text-slate-400';
                  }
                  
                  return (
                    <div key={optIdx} className={optionStyle}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${isCorrectAns ? 'bg-green-500 text-white' : isUserAns ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="flex-1">{opt}</span>
                      {statusBadge}
                    </div>
                  );
                })}
              </div>

              {currentReviewQuestion.hint && (
                <div className="flex items-start gap-3 p-4 bg-amber-500/5 dark:bg-amber-950/10 border-l-4 border-amber-500 text-amber-900 dark:text-amber-300 rounded-r-xl ml-5 text-xs leading-relaxed shadow-sm">
                  <span className="text-base shrink-0 leading-none">💡</span>
                  <div>
                    <span className="font-bold block mb-0.5">Gợi ý & Giải thích:</span>
                    <span>{currentReviewQuestion.hint}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Inner review navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-150 dark:border-slate-800 pl-5">
              <button
                disabled={activeReviewIdx === 0}
                onClick={() => setActiveReviewIdx(activeReviewIdx - 1)}
                className="px-3.5 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                ← Câu trước
              </button>
              <button
                disabled={activeReviewIdx === quiz.questions.length - 1}
                onClick={() => setActiveReviewIdx(activeReviewIdx + 1)}
                className="px-3.5 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                Câu tiếp theo →
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 text-sm"
          >
            <span>✓</span> Hoàn thành & Quay lại dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Quiz Header info */}
      <div className="bg-purple-600 rounded-2xl p-5 text-white flex items-center justify-between">
        <div>
          <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold uppercase tracking-wide">Trắc nghiệm AI</span>
          <h2 className="text-xl font-bold mt-1.5">{quiz.title}</h2>
        </div>
        <button
          onClick={onBack}
          className="text-xs px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white font-bold transition-all"
        >
          Quay lại
        </button>
      </div>

      {/* Progress indicators */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>Câu {currentIdx + 1} / {totalQuestions}</span>
          <span className="text-purple-600 font-bold">{Math.round(((currentIdx + 1) / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-md font-bold">Luyện tập thông minh</span>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-3 mb-5 leading-relaxed">{currentQuestion.question}</h3>

        <div className="space-y-2.5">
          {currentQuestion.options.map((opt, oIdx) => (
            <button
              key={oIdx}
              onClick={() => onAnswer(currentIdx, oIdx)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3.5 ${answers[currentIdx] === oIdx ? 'border-purple-600 bg-purple-50/20 text-purple-700 dark:text-purple-400 font-semibold' : 'border-slate-150 dark:border-slate-800 hover:border-purple-300 hover:bg-slate-50/40 text-slate-700 dark:text-slate-300'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${answers[currentIdx] === oIdx ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {String.fromCharCode(65 + oIdx)}
              </div>
              <span className="text-sm">{opt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold"
        >
          ← Câu trước
        </button>
        
        {currentIdx < totalQuestions - 1 ? (
          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-sm text-sm"
          >
            Câu tiếp theo →
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!allAnswered}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Nộp bài làm
          </button>
        )}
      </div>
    </div>
  );
}
