import { useState, useRef, useEffect } from 'react';
import { askGemini } from '../services/gemini';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  actions?: {
    label: string;
    type: 'quiz-full' | 'quiz-wrong' | 'other';
    value?: string;
  }[];
}

interface SavedQuiz {
  title: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    hint?: string;
  }[];
  slideTitle: string;
  createdAt: string;
}

interface ChatbotProps {
  onLaunchQuiz: (quizData: any) => void;
  chatQuery: string;
  onClearChatQuery: () => void;
  slideContext?: string;
  slideTitle?: string;
  savedQuizzes: SavedQuiz[];
  onSaveQuiz: (quiz: SavedQuiz) => void;
  onDeleteQuiz: (index: number) => void;
  quizSlideContext?: { name: string; textContent: string } | null;
  chatQuizContext?: {
    slideName: string;
    slideContent: string;
    wrongQuestions: any[];
    quizTitle: string;
  } | null;
  onClearChatQuizContext?: () => void;
}

export function Chatbot({ onLaunchQuiz, chatQuery, onClearChatQuery, slideContext, slideTitle, savedQuizzes, onSaveQuiz, onDeleteQuiz, quizSlideContext, chatQuizContext, onClearChatQuizContext }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('vlearn-chat-history');
    if (saved) {
      try {
        return JSON.parse(saved).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
      } catch (e) {
        console.error('Failed to parse saved chat history', e);
      }
    }
    return [
      {
        id: 'welcome',
        role: 'model',
        content: 'Xin chào! Tôi là **VLearn AI Tutor**. Tôi có nhiệm vụ hỗ trợ bạn tìm kiếm và ôn tập thông tin từ các slide/bài học trong khóa "AI Thực Chiến".\n\nBạn cần tôi giải thích chủ đề nào hay muốn tạo bài tập trắc nghiệm (quiz) để ôn tập hôm nay?',
        timestamp: new Date(),
      },
    ];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<{ name: string; mimeType: string; base64: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showQuizHistory, setShowQuizHistory] = useState(false);
  const [pendingReviewContext, setPendingReviewContext] = useState<{
    slideName: string;
    slideContent: string;
    wrongQuestions: any[];
    quizTitle: string;
  } | null>(null);
  const quizContextRef = useRef<{ name: string; textContent: string } | null>(null);
  const quizReviewContextRef = useRef<{
    slideName: string;
    slideContent: string;
    wrongQuestions: any[];
    quizTitle: string;
  } | null>(null);

  // Close chat when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && chatWindowRef.current && !chatWindowRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Save chat to localStorage on change
  useEffect(() => {
    localStorage.setItem('vlearn-chat-history', JSON.stringify(messages));
  }, [messages]);

  // Handle external query pre-fills (from Lesson tab clicks or SlideLibrary)
  useEffect(() => {
    if (chatQuery) {
      setIsOpen(true);
      quizContextRef.current = quizSlideContext || null;
      if (chatQuizContext) {
        quizReviewContextRef.current = chatQuizContext;
        setPendingReviewContext(chatQuizContext);
      }
      handleSendMessage(chatQuery, undefined, quizSlideContext || undefined);
      onClearChatQuery();
      if (chatQuizContext) {
        onClearChatQuizContext?.();
      }
    }
  }, [chatQuery, quizSlideContext, chatQuizContext]);

  // Scroll to bottom when messages list updates or chat opens
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Dung lượng file quá lớn. Vui lòng chọn file dưới 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setAttachedFile({
        name: file.name,
        mimeType: file.type,
        base64: base64Data,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (textToSend: string, overrideFile?: typeof attachedFile, slideContextOverride?: { name: string; textContent: string }) => {
    const cleanText = textToSend.trim();
    const fileToUpload = overrideFile !== undefined ? overrideFile : attachedFile;
    if (!cleanText && !fileToUpload) return;
    if (isLoading) return;

    const displayContent = fileToUpload 
      ? `[Tệp đính kèm: ${fileToUpload.name}]\n\n${cleanText}`
      : cleanText;

    const userMsg: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: displayContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsLoading(true);

    try {
      const apiHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const contextToUse = slideContextOverride ? slideContextOverride.textContent : (quizContextRef.current?.textContent || slideContext);
      
      // Build enhanced context with wrong questions if available
      let fullContext = contextToUse || '';
      if (quizReviewContextRef.current && quizReviewContextRef.current.wrongQuestions.length > 0) {
        const wrongQsList = quizReviewContextRef.current.wrongQuestions
          .map((wq: any) => `Câu ${wq.index + 1}: ${wq.question.question}`)
          .join('\n');
        fullContext = `${quizReviewContextRef.current.slideContent || ''}\n\n--- CÁC CÂU HỎI BỊ SAI TRONG BÀI QUIZ TRƯỚC ---\n${wrongQsList}`;
      }
      
      // Check if in review mode
      const isReviewMode = !!pendingReviewContext;
      const reviewMode = isReviewMode && pendingReviewContext ? {
        isReviewMode: true,
        wrongQuestions: pendingReviewContext.wrongQuestions,
        quizTitle: pendingReviewContext.quizTitle,
      } : undefined;
      
      const responseText = await askGemini(cleanText, apiHistory, fileToUpload || undefined, fullContext, reviewMode);

      const aiMsg: Message = {
        id: Math.random().toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'model',
          content: 'Lỗi: Không thể kết nối với AI Agent. Vui lòng kiểm tra lại cấu hình API key.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerClearHistory = () => {
    setShowClearConfirm(true);
  };

  const handleClearHistoryConfirm = () => {
    const defaultWelcome: Message[] = [
      {
        id: 'welcome',
        role: 'model',
        content: 'Xin chào! Tôi là **VLearn AI Tutor**. Tôi có nhiệm vụ hỗ trợ bạn tìm kiếm và ôn tập thông tin từ các slide/bài học trong khóa "AI Thực Chiến".\n\nBạn cần tôi giải thích chủ đề nào hay muốn tạo bài tập trắc nghiệm (quiz) để ôn tập hôm nay?',
        timestamp: new Date(),
      },
    ];
    setMessages(defaultWelcome);
    localStorage.removeItem('vlearn-chat-history');
    setShowClearConfirm(false);
  };

  // Save quiz to localStorage
  const handleSaveQuiz = (quiz: SavedQuiz) => {
    onSaveQuiz(quiz);
  };

  // Render message text, parsing and hiding XML quiz tags and replacing them with a custom button
  const renderMessageContent = (text: string) => {
    const quizRegex = /<quiz>([\s\S]*?)<\/quiz>/;
    const match = text.match(quizRegex);

    if (match) {
      const xmlBlock = match[0];
      const jsonStr = match[1].trim();
      const textParts = text.split(xmlBlock);

      let parsedQuiz: any = null;
      try {
        parsedQuiz = JSON.parse(jsonStr);
      } catch (e) {
        console.error('Failed to parse quiz json:', e);
      }

      const handleStartQuiz = () => {
        // Validate quiz structure thoroughly
        if (!parsedQuiz) {
          alert('Quiz không hợp lệ. Vui lòng yêu cầu AI tạo lại quiz.');
          return;
        }
        if (!parsedQuiz.title) {
          alert('Quiz thiếu tiêu đề. Vui lòng yêu cầu AI tạo lại quiz.');
          return;
        }
        if (!Array.isArray(parsedQuiz.questions) || parsedQuiz.questions.length === 0) {
          alert('Quiz không có câu hỏi. Vui lòng yêu cầu AI tạo lại quiz.');
          return;
        }
        // Validate each question has required fields
        for (let i = 0; i < parsedQuiz.questions.length; i++) {
          const q = parsedQuiz.questions[i];
          if (!q.question || typeof q.question !== 'string') {
            alert(`Câu ${i + 1} thiếu nội dung câu hỏi. Vui lòng yêu cầu AI tạo lại quiz.`);
            return;
          }
          if (!Array.isArray(q.options) || q.options.length < 2) {
            alert(`Câu ${i + 1} thiếu các lựa chọn. Vui lòng yêu cầu AI tạo lại quiz.`);
            return;
          }
          if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
            alert(`Câu ${i + 1} có đáp án không hợp lệ. Vui lòng yêu cầu AI tạo lại quiz.`);
            return;
          }
        }
        
        // All validations passed - launch quiz
        const titleToUse = quizContextRef.current?.name || slideTitle;
        const newQuiz: SavedQuiz = {
          title: parsedQuiz.title,
          questions: parsedQuiz.questions,
          slideTitle: titleToUse || 'Unknown',
          createdAt: new Date().toLocaleString('vi-VN'),
        };
        handleSaveQuiz(newQuiz);
        // Clear quiz context refs to prevent old context interference
        quizContextRef.current = null;
        quizReviewContextRef.current = null;
        onLaunchQuiz(newQuiz);
      };

      return (
        <div className="space-y-3">
          <div className="whitespace-pre-wrap">{textParts[0].trim()}</div>
          {parsedQuiz && (
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 rounded-xl space-y-2 text-center">
              <p className="text-xs text-purple-700 dark:text-purple-400 font-semibold">🤖 Đã tạo thành công bài trắc nghiệm!</p>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{parsedQuiz.title} ({parsedQuiz.questions?.length} câu)</h4>
              <button
                onClick={handleStartQuiz}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
              >
                📝 Bắt đầu làm Quiz
              </button>
            </div>
          )}
          {textParts[1] && <div className="whitespace-pre-wrap">{textParts[1].trim()}</div>}
        </div>
      );
    }

    return <div className="whitespace-pre-wrap">{text}</div>;
  };

  const suggestions = [
    'Chiến lược Compress trong tối ưu context là gì?',
    'Cách LLM hoạt động & RAG là gì?',
    'Tạo bài trắc nghiệm ôn tập về Day 2',
    'Giải thích về Transformer & Attention',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center relative group"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500"></span>
          </span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="absolute right-16 scale-0 group-hover:scale-100 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-md whitespace-nowrap transition-all duration-150 font-semibold">
            Trợ lý AI VLearn
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div ref={chatWindowRef} className="w-96 h-[550px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-slideUp relative">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-sm">Trợ lý VLearn</h3>
                <p className="text-[10px] text-white/80">AI Agent hoạt động 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Quiz History Button */}
              <button
                onClick={() => setShowQuizHistory(!showQuizHistory)}
                className={`p-1.5 rounded transition-colors text-white/95 ${showQuizHistory ? 'bg-white/20' : 'hover:bg-white/10'}`}
                title="Xem lại các bài quiz đã tạo"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </button>
              {/* Trash Icon */}
              <button
                onClick={triggerClearHistory}
                className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/95"
                title="Xóa cuộc trò chuyện"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              {/* Minimize Icon */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/95 font-bold"
                title="Ẩn cửa sổ"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quiz History Panel */}
          {showQuizHistory && (
            <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 max-h-48 overflow-y-auto">
              {savedQuizzes.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  Chưa có bài quiz nào được tạo.
                </div>
              ) : (
                <div className="p-2 space-y-1.5">
                  {savedQuizzes.map((quiz, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{quiz.title}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{quiz.slideTitle} • {quiz.questions.length} câu</p>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500">{quiz.createdAt}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => {
                            const quizData = { title: quiz.title, questions: quiz.questions };
                            onLaunchQuiz(quizData);
                            setShowQuizHistory(false);
                          }}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-lg transition-colors"
                        >
                          Làm lại
                        </button>
                        <button
                          onClick={() => {
                            onDeleteQuiz(idx);
                          }}
                          className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 text-[10px] font-bold rounded-lg transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-800 rounded-bl-none'
                  }`}
                >
                  {renderMessageContent(msg.content)}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="bg-white dark:bg-slate-800 text-slate-500 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-100 dark:border-slate-850 shadow-sm text-sm flex items-center gap-1.5">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                  <span className="text-xs">AI Tutor đang suy nghĩ...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions (Show only when no pending user message input) */}
          {messages.length <= 2 && !isLoading && (
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
              <p className="text-[10px] text-slate-400 font-semibold px-1">GỢI Ý HỎI AI:</p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(s)}
                    className="shrink-0 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 hover:border-blue-500 text-slate-700 dark:text-slate-300 font-medium hover:text-blue-600 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* File Attachment Preview */}
          {attachedFile && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2 text-xs text-slate-650 dark:text-slate-350">
                <span className="text-sm">📎</span>
                <span className="font-semibold truncate max-w-[200px]">{attachedFile.name}</span>
                <span className="text-[10px] text-slate-400">({attachedFile.mimeType.split('/')[1]?.toUpperCase()})</span>
              </div>
              <button 
                onClick={() => {
                  setAttachedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }} 
                className="text-xs text-red-500 hover:text-red-700 font-bold px-1.5 py-0.5 rounded hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                Xóa
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                className="hidden"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 shrink-0"
                title="Đính kèm file ảnh hoặc PDF"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                disabled={isLoading}
                placeholder="Hỏi AI về nội dung bài học..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-sm focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100 disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={isLoading || (!inputValue.trim() && !attachedFile)}
                className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-40 shadow-md shrink-0"
              >
                <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Custom Clear History Modal Overlay */}
          {showClearConfirm && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3.5 w-full max-w-[280px] animate-scaleUp text-center">
                <div className="text-2xl">🗑️</div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Xóa cuộc trò chuyện?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tất cả tin nhắn cũ của bạn với AI Tutor sẽ bị xóa sạch và không thể phục hồi.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1.5">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-2 px-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 font-semibold text-xs rounded-xl transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleClearHistoryConfirm}
                    className="flex-1 py-2 px-3 bg-red-650 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-colors shadow"
                  >
                    Xóa sạch
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
