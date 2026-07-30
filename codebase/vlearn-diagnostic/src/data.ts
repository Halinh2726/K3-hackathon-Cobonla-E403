import type { 
  Session, 
  TimeSlot, 
  DiagnosticQuestion,
  LearningPath,
  PostCheckQuestion,
  DiagnosticResult
} from './types';

export const sessions: Session[] = [
  {
    id: 'day1',
    title: 'Foundation - AI & Prompt Engineering',
    day: 1,
    topics: ['Giới thiệu AI', 'Prompt Engineering cơ bản', 'Context & Memory'],
    duration: 180,
    status: 'completed',
  },
  {
    id: 'day2',
    title: 'Xác định bài toán kinh doanh',
    day: 2,
    topics: ['Problem Statement', 'User Research', 'Impact Analysis'],
    duration: 180,
    status: 'completed',
  },
  {
    id: 'day3',
    title: 'Xây dựng AI Agent',
    day: 3,
    topics: ['Agent Architecture', 'Tool Calling', 'Workflow Design'],
    duration: 180,
    status: 'in-progress',
  },
  {
    id: 'day4',
    title: 'Tối ưu hoá & Production',
    day: 4,
    topics: ['Context Optimization', 'RAG', 'Monitoring & Evaluation'],
    duration: 180,
    status: 'not-started',
  },
  {
    id: 'day5',
    title: 'AI Product Development',
    day: 5,
    topics: ['Product Thinking', 'User-Centered Design', 'Ethics in AI'],
    duration: 180,
    status: 'not-started',
  },
  {
    id: 'day6',
    title: 'Deployment & Scaling',
    day: 6,
    topics: ['API Integration', 'Security', 'Scaling Strategies'],
    duration: 180,
    status: 'not-started',
  },
];

export const timeSlots: TimeSlot[] = [
  { id: 'slot1', time: '08:00 - 10:00', available: true },
  { id: 'slot2', time: '10:15 - 12:15', available: true },
  { id: 'slot3', time: '13:30 - 15:30', available: false },
  { id: 'slot4', time: '15:45 - 17:45', available: true },
  { id: 'slot5', time: '19:00 - 21:00', available: true },
];

export const learningGoals = [
  'Nắm vững kiến thức buổi học',
  'Chuẩn bị cho buổi học tiếp theo',
  'Ôn tập và củng cố kiến thức',
];

// Diagnostic Questions - only multiple choice
export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: 'Kỹ thuật nào giúp AI hiểu rõ hơn ngữ cảnh của cuộc hội thoại?',
    options: [
      'A) Sử dụng prompt ngắn hơn',
      'B) Cung cấp thông tin nền (background) và ví dụ cụ thể',
      'C) Thay đổi model AI',
      'D) Gửi nhiều câu hỏi cùng lúc',
    ],
    correctAnswer: 1,
    topic: 'Context & Memory',
    reference: '[T04-012]',
    reviewQuestions: [
      {
        id: 101,
        question: 'Ví dụ nào sau đây giúp AI hiểu tốt hơn ngữ cảnh trong prompt?',
        options: [
          'A) "Viết code"',
          'B) "Viết code Python để xử lý file CSV với 1000 dòng dữ liệu, cần tách columns và tính tổng"',
          'C) "Viết code hay"',
          'D) "Viết code ngắn nhất có thể"',
        ],
        correctAnswer: 1,
        hint: 'Cung cấp chi tiết về ngôn ngữ, định dạng file, số lượng dữ liệu và yêu cầu cụ thể giúp AI hiểu rõ hơn.',
      },
      {
        id: 102,
        question: 'System prompt thường chứa những thông tin gì để định nghĩa AI?',
        options: [
          'A) Chỉ tên của AI',
          'B) Vai trò, luật lệ, giới hạn và định dạng phản hồi',
          'C) Lịch sử hội thoại',
          'D) Dữ liệu người dùng',
        ],
        correctAnswer: 1,
        hint: 'System prompt định nghĩa AI identity, behavior rules, và output format.',
      },
      {
        id: 103,
        question: 'Tại sao việc cung cấp ví dụ (few-shot) trong prompt lại quan trọng?',
        options: [
          'A) Làm cho prompt dài hơn',
          'B) Giúp AI hiểu pattern và định dạng mong muốn từ input→output',
          'C) Tăng chi phí API',
          'D) Không có tác dụng gì',
        ],
        correctAnswer: 1,
        hint: 'Few-shot examples cho AI thấy pattern cụ thể của input và expected output.',
      },
    ],
  },
  {
    id: 2,
    type: 'multiple-choice',
    question: 'Trong các chiến lược tối ưu prompt sau, chiến lược nào giúp giảm context overflow?',
    options: [
      'A) Write - Chuyển state ra ngoài context',
      'B) Compress - Tóm tắt lịch sử hội thoại',
      'C) Select - Chỉ chọn thông tin liên quan',
      'D) Tất cả các đáp án trên',
    ],
    correctAnswer: 3,
    topic: 'Context Optimization',
    reference: '[T04-014]',
    reviewQuestions: [
      {
        id: 201,
        question: 'Chiến lược "Write" trong Context Management có nghĩa là gì?',
        options: [
          'A) Viết thêm prompt dài hơn',
          'B) Chuyển state/context ra external storage thay vì giữ trong conversation',
          'C) Viết lại toàn bộ system prompt',
          'D) Ghi log các câu hỏi',
        ],
        correctAnswer: 1,
        hint: '"Write" strategy lưu trữ state ra bên ngoài context window để giải phóng không gian.',
      },
      {
        id: 202,
        question: 'Chiến lược "Select" giúp tối ưu context bằng cách nào?',
        options: [
          'A) Chọn tất cả thông tin',
          'B) Chỉ chọn những thông tin relevant với current task',
          'C) Xóa tất cả thông tin cũ',
          'D) Sao chép toàn bộ database',
        ],
        correctAnswer: 1,
        hint: '"Select" dùng semantic search để chỉ lấy những phần context liên quan đến query hiện tại.',
      },
      {
        id: 203,
        question: 'Context overflow xảy ra khi nào?',
        options: [
          'A) Prompt quá ngắn',
          'B) Số lượng tokens vượt quá context window limit của model',
          'C) Model quá nhanh',
          'D) Internet chậm',
        ],
        correctAnswer: 1,
        hint: 'Mỗi LLM có giới hạn context window - khi vượt quá sẽ gây overflow và mất thông tin.',
      },
    ],
  },
  {
    id: 3,
    type: 'multiple-choice',
    question: 'Thành phần nào trong Context Management chịu trách nhiệm định nghĩa vai trò và luật lệ của Agent?',
    options: [
      'A) History',
      'B) Current Input',
      'C) System (Policy)',
      'D) Tools',
    ],
    correctAnswer: 2,
    topic: 'Agent Architecture',
    reference: '[T04-015]',
    reviewQuestions: [
      {
        id: 301,
        question: 'System prompt trong Agent thường bao gồm những gì?',
        options: [
          'A) Chỉ có câu hỏi của user',
          'B) Role definition, behavior rules, output format, safety guardrails',
          'C) Chỉ là tên của AI',
          'D) Danh sách các API keys',
        ],
        correctAnswer: 1,
        hint: 'System prompt định nghĩa AI persona, rules, và cách response.',
      },
      {
        id: 302,
        question: 'Thành phần "History" trong Context Management có chức năng gì?',
        options: [
          'A) Định nghĩa vai trò AI',
          'B) Lưu trữ lịch sử hội thoại giữa user và assistant',
          'C) Chứa danh sách tools',
          'D) Quản lý policy',
        ],
        correctAnswer: 1,
        hint: 'History chứa conversation history để AI có memory của cuộc trò chuyện.',
      },
      {
        id: 303,
        question: 'Tại sao cần tách biệt System prompt và User prompt?',
        options: [
          'A) Để tăng chi phí',
          'B) Để AI phân biệt được instructions cố định và user requests',
          'C) Không cần thiết',
          'D) Chỉ để code clean hơn',
        ],
        correctAnswer: 1,
        hint: 'System prompts chứa instructions cố định, user prompts chứa requests thay đổi theo từng query.',
      },
    ],
  },
  {
    id: 4,
    type: 'multiple-choice',
    question: 'RAG (Retrieval-Augmented Generation) được sử dụng để?',
    options: [
      'A) Tăng tốc độ phản hồi của AI',
      'B) Cung cấp thông tin cập nhật cho AI từ external knowledge base',
      'C) Giảm chi phí API calls',
      'D) Tất cả đều đúng',
    ],
    correctAnswer: 1,
    topic: 'RAG',
    reference: '[T04-016]',
    reviewQuestions: [
      {
        id: 401,
        question: 'Trong RAG, bước "Retrieval" làm gì?',
        options: [
          'A) Generate text từ LLM',
          'B) Tìm kiếm và lấy relevant documents từ knowledge base',
          'C) Train model mới',
          'D) Xóa dữ liệu cũ',
        ],
        correctAnswer: 1,
        hint: 'Retrieval tìm documents liên quan đến query từ vector database.',
      },
      {
        id: 402,
        question: 'Embedding trong RAG dùng để làm gì?',
        options: [
          'A) Mã hóa API keys',
          'B) Chuyển đổi text thành vectors để so sánh similarity',
          'C) Nén dữ liệu',
          'D) Backup database',
        ],
        correctAnswer: 1,
        hint: 'Embedding models chuyển text thành numerical vectors để tính similarity.',
      },
      {
        id: 403,
        question: 'Tại sao RAG cần thiết khi đã có fine-tuning?',
        options: [
          'A) RAG rẻ hơn',
          'B) RAG cho phép cập nhật knowledge mà không cần retrain model',
          'C) Fine-tuning không hoạt động',
          'D) RAG nhanh hơn',
        ],
        correctAnswer: 1,
        hint: 'RAG cập nhật knowledge base riêng, không ảnh hưởng đến base model.',
      },
    ],
  },
  {
    id: 5,
    type: 'multiple-choice',
    question: 'Khi nào nên sử dụng Tool Calling trong AI Agent?',
    options: [
      'A) Khi cần AI trả lời nhanh hơn',
      'B) Khi cần thực hiện các tác vụ mà LLM không thể tự làm được',
      'C) Khi muốn giảm chi phí API',
      'D) Khi không có internet',
    ],
    correctAnswer: 1,
    topic: 'Tool Calling',
    reference: '[T04-017]',
    reviewQuestions: [
      {
        id: 501,
        question: 'Ví dụ nào sau đây là use case phù hợp cho Tool Calling?',
        options: [
          'A) Trả lời câu hỏi đơn giản như "2+2=?"',
          'B) Tra cứu database, gọi API, tính toán, tìm kiếm web',
          'C) Viết một đoạn văn ngắn',
          'D) Dịch thuật đơn giản',
        ],
        correctAnswer: 1,
        hint: 'Tool Calling dùng khi cần thực hiện actions bên ngoài capabilities của LLM.',
      },
      {
        id: 502,
        question: 'Cấu trúc function calling thường bao gồm những phần nào?',
        options: [
          'A) Chỉ có function name',
          'B) Name, description, parameters (schema)',
          'C) Chỉ có code Python',
          'D) Chỉ có API endpoint',
        ],
        correctAnswer: 1,
        hint: 'Function schema định nghĩa name, description, và parameters để LLM hiểu cách gọi.',
      },
      {
        id: 503,
        question: 'Điều gì xảy ra khi LLM gọi một tool?',
        options: [
          'A) LLM trả lời trực tiếp cho user',
          'B) LLM output tool call instruction, hệ thống execute và trả kết quả về cho LLM',
          'C) User phải tự gọi tool',
          'D) Không có gì xảy ra',
        ],
        correctAnswer: 1,
        hint: 'Agent loop: LLM → tool call → execute → return result → LLM process → response.',
      },
    ],
  },
];

// Mock Learning Path with real transcript references
export const mockLearningPath: LearningPath = {
  id: 'lp1',
  title: 'Lộ trình học bù - Module 3',
  description: 'Hoàn thành các modules bên dưới để đạt chuẩn đầu ra buổi học',
  totalTime: '2 giờ 30 phút',
  modules: [
    {
      id: 'mod1',
      title: 'Context Management Fundamentals',
      reference: '[T04-012]',
      gapContent: 'Bạn cần cải thiện cách cung cấp ngữ cảnh cho AI. Hãy học cách sử dụng System prompt, History, và Current input một cách hiệu quả.',
      estimatedTime: '45 phút',
      status: 'pending',
    },
    {
      id: 'mod2',
      title: 'Tối ưu Context - Write, Select, Compress, Isolate',
      reference: '[T04-014]',
      gapContent: 'Học 4 chiến lược tối ưu context để tránh overflow và tăng hiệu quả của Agent.',
      estimatedTime: '60 phút',
      status: 'pending',
    },
    {
      id: 'mod3',
      title: 'Agent Design Patterns',
      reference: '[T04-018]',
      gapContent: 'Nắm vững các patterns cơ bản trong thiết kế AI Agent: Input/Output definition, Error handling, và Tool orchestration.',
      estimatedTime: '45 phút',
      status: 'pending',
    },
  ],
};

// Post-Check Questions - 3 fixed questions
export const postCheckQuestions: PostCheckQuestion[] = [
  {
    id: 1,
    question: 'Chiến lược "Compress" trong tối ưu context nghĩa là gì?',
    options: [
      'A) Xóa bỏ tất cả lịch sử hội thoại',
      'B) Tóm tắt lịch sử hội thoại và kết quả từ tools',
      'C) Nén dữ liệu để truyền nhanh hơn',
      'D) Sử dụng ít token hơn',
    ],
    correctAnswer: 1,
    topic: 'Context Optimization',
    reviewQuestions: [
      {
        id: 601,
        question: 'Kỹ thuật "Summarization" trong Compress strategy hoạt động như thế nào?',
        options: [
          'A) Xóa tất cả messages cũ',
          'B) Dùng LLM để tóm tắt conversation chunks thành distilled notes',
          'C) Gửi ít dữ liệu hơn qua API',
          'D) Nén text bằng thuật toán nén',
        ],
        correctAnswer: 1,
        hint: 'Summarization dùng chính LLM để tạo ra bản tóm tắt ngắn gọn của conversation history.',
      },
      {
        id: 602,
        question: 'Chiến lược Compress khác gì so với Write strategy?',
        options: [
          'A) Giống hệt nhau',
          'B) Compress giữ thông tin trong context nhưng rút gọn, Write chuyển ra external storage',
          'C) Compress xóa dữ liệu, Write giữ lại',
          'D) Không có gì khác biệt',
        ],
        correctAnswer: 1,
        hint: 'Compress vẫn giữ data trong context nhưng rút gọn, Write chuyển data ra ngoài hoàn toàn.',
      },
      {
        id: 603,
        question: 'Khi nào nên sử dụng Compress strategy?',
        options: [
          'A) Khi context đầy và cần giữ một số thông tin quan trọng',
          'B) Chỉ khi có internet chậm',
          'C) Khi muốn xóa tất cả',
          'D) Không bao giờ cần',
        ],
        correctAnswer: 1,
        hint: 'Compress phù hợp khi cần giữ context nhưng không gian bị giới hạn.',
      },
    ],
  },
  {
    id: 2,
    question: 'Thành phần nào trong Context Management chịu trách nhiệm định nghĩa vai trò và luật lệ của Agent?',
    options: [
      'A) History',
      'B) Current Input',
      'C) System (Policy)',
      'D) Tools',
    ],
    correctAnswer: 2,
    topic: 'Agent Architecture',
    reviewQuestions: [
      {
        id: 604,
        question: 'System prompt tốt cần có những thành phần nào?',
        options: [
          'A) Chỉ cần tên AI',
          'B) Role, personality, rules, format constraints, safety guardrails',
          'C) Chỉ cần câu "You are a helpful assistant"',
          'D) Không cần System prompt',
        ],
        correctAnswer: 1,
        hint: 'System prompt hiệu quả định nghĩa đầy đủ: AI identity, behavior, output style, và boundaries.',
      },
      {
        id: 605,
        question: 'Policy trong Agent Architecture khác gì với Rules?',
        options: [
          'A) Giống nhau hoàn toàn',
          'B) Policy định nghĩa high-level behavior, Rules chi tiết hóa constraints',
          'C) Rules quan trọng hơn Policy',
          'D) Không có khác biệt',
        ],
        correctAnswer: 1,
        hint: 'Policy = high-level guidelines, Rules = specific dos and don\'ts chi tiết hơn.',
      },
      {
        id: 606,
        question: 'Tại sao System prompt nên được tách biệt với user messages?',
        options: [
          'A) Để tiết kiệm token',
          'B) Để AI phân biệt instructions cố định và user requests thay đổi',
          'C) Không cần tách',
          'D) Chỉ để code clean',
        ],
        correctAnswer: 1,
        hint: 'Separation giúp maintainability và giúp LLM hiểu rõ đâu là base instructions.',
      },
    ],
  },
  {
    id: 3,
    question: 'Một AI Agent cần có những thành phần cơ bản nào?',
    options: [
      'A) Chỉ cần LLM',
      'B) LLM + Tools + Memory + Planning',
      'C) Chỉ cần API',
      'D) Không cần gì đặc biệt',
    ],
    correctAnswer: 1,
    topic: 'Agent Architecture',
    reviewQuestions: [
      {
        id: 607,
        question: 'Component "Planning" trong Agent có chức năng gì?',
        options: [
          'A) Chỉ gọi LLM',
          'B) Decompose tasks, sequence actions, reflect on results',
          'C) Chỉ lưu data',
          'D) Không cần thiết',
        ],
        correctAnswer: 1,
        hint: 'Planning component giúp Agent break down complex tasks và strategize approach.',
      },
      {
        id: 608,
        question: 'Memory trong Agent khác gì so với History?',
        options: [
          'A) Giống nhau',
          'B) Memory = broader concept (short-term + long-term), History = session logs',
          'C) History rộng hơn',
          'D) Không khác nhau',
        ],
        correctAnswer: 1,
        hint: 'Memory có thể include external storage, summaries, facts; History là conversation transcript.',
      },
      {
        id: 609,
        question: 'Agent loop thường hoạt động như thế nào?',
        options: [
          'A) User → LLM → Response (một lần)',
          'B) User → LLM → Action/Reasoning → Tools → Observation → LLM → Response',
          'C) Chỉ LLM một mình',
          'D) Không có loop',
        ],
        correctAnswer: 1,
        hint: 'Agent loop: perceive → think → act → observe → repeat cho đến khi hoàn thành task.',
      },
    ],
  },
];

// Mock diagnostic result - simulates AI analysis
export function analyzeDiagnosticResults(
  answers: Record<number, number>,
  questions: DiagnosticQuestion[]
): DiagnosticResult {
  let correctCount = 0;
  
  const gaps: DiagnosticResult['gaps'] = [];
  
  questions.forEach((q) => {
    const answer = answers[q.id];
    if (answer === q.correctAnswer) {
      correctCount++;
    } else {
      // Add gap
      gaps.push({
        topic: q.topic,
        level: Math.random() > 0.5 ? 'high' : 'medium',
        description: `Cần ôn lại: ${q.topic}`,
        reference: q.reference,
      });
    }
  });
  
  const score = Math.round((correctCount / questions.length) * 100);
  
  return {
    overallScore: score,
    readiness: score >= 80 ? 'ready' : score >= 50 ? 'partial' : 'not-ready',
    gaps,
    confidence: Math.round(70 + Math.random() * 20), // 70-90%
  };
}
