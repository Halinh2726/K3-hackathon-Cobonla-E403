// Session & TimeSlot
export interface Session {
  id: string;
  title: string;
  day: number;
  topics: string[];
  duration: number;
  status: 'completed' | 'in-progress' | 'not-started';
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

// Diagnostic
export interface DiagnosticQuestion {
  id: number;
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  reference: string;
  reviewQuestions?: ReviewQuestion[];
}

export interface ReviewQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  hint?: string;
}

// Gap Analysis
export interface GapResult {
  topic: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  reference: string;
}

export interface DiagnosticResult {
  overallScore: number;
  readiness: 'ready' | 'not-ready' | 'partial';
  gaps: GapResult[];
  confidence: number; // 0-100
}

// Learning Path
export interface LearningModule {
  id: string;
  title: string;
  reference: string;
  gapContent: string;
  estimatedTime: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: LearningModule[];
  totalTime: string;
}

// Post-Check
export interface PostCheckQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  reviewQuestions?: ReviewQuestion[];
}

export interface PostCheckResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
}

// App State
export type AppStep = 
  | 'setup'           // Screen 1: Setup session
  | 'diagnostic'      // Screen 2: Diagnostic questions
  | 'diagnostic-review' // Screen 2b: Diagnostic review
  | 'diagnostic-review-practice' // Screen 2c: Review practice
  | 'diagnostic-result' // Screen 3: Diagnostic results
  | 'learning-path'   // Screen 4: Learning path
  | 'post-check'      // Screen 5: Post-check questions
  | 'post-check-review' // Screen 5b: Post-check review
  | 'post-check-review-practice' // Screen 5c: Review practice
  | 'post-check-result'; // Screen 5d: Final result

export interface AppState {
  currentStep: AppStep;
  
  // Setup
  selectedSession: Session | null;
  selectedTimeSlot: TimeSlot | null;
  learningGoal: string;
  
  // Diagnostic
  diagnosticAnswers: Record<number, number>;
  diagnosticSubmitted: boolean;
  
  // Diagnostic Result
  diagnosticResult: DiagnosticResult | null;
  
  // Wrong questions for review
  diagnosticWrongQuestions: number[];
  diagnosticReviewAnswers: Record<number, number>;
  
  // Learning Path
  learningPath: LearningPath | null;
  selectedModules: string[];
  
  // Post-Check
  postCheckAnswers: Record<number, number>;
  postCheckSubmitted: boolean;
  postCheckResult: PostCheckResult | null;
  
  // Wrong questions for post-check review
  postCheckWrongQuestions: number[];
  postCheckReviewAnswers: Record<number, number>;
  
  // Edit mode
  isEditingGaps: boolean;
}
