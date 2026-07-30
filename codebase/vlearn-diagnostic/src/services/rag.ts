import { d1SlideContent } from '../data/slideContent';

export interface RAGChunk {
  id: string;
  source: string;
  content: string;
  cleanContent: string;
}

// Load transcripts from glob
const transcriptModules = import.meta.glob<string>('../assets/transcripts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const rawTranscripts = Object.entries(transcriptModules).map(([path, text]) => ({
  text,
  source: path.split('/').pop()?.replace(/\.md$/, '') ?? 'Transcript bai hoc',
}));

function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Ä‘/g, 'd')
    .replace(/Ä/g, 'D');
}

// Parse transcripts into searchable chunks
const transcriptChunks: RAGChunk[] = (() => {
  const parsedChunks: RAGChunk[] = [];
  
  rawTranscripts.forEach(({ text, source }) => {
    const paragraphs = text.split(/\n\s*\n/);
    
    paragraphs.forEach(p => {
      const trimmed = p.trim();
      if (!trimmed) return;
      
      const match = trimmed.match(/\[(T\d{2}-\d{3})\]/);
      if (match) {
        const id = match[1];
        const content = trimmed
          .replace(/\*\*\[T\d{2}-\d{3}\]\*\*/g, '')
          .replace(/\[T\d{2}-\d{3}\]/g, '')
          .trim();
          
        if (content.length > 20) {
          parsedChunks.push({
            id,
            source,
            content,
            cleanContent: removeAccents(content.toLowerCase()),
          });
        }
      }
    });
  });
  
  return parsedChunks;
})();

// Parse slide content into searchable chunks
const slideChunks: RAGChunk[] = (() => {
  const parsedChunks: RAGChunk[] = [];
  const paragraphs = d1SlideContent.split(/\n{2,}/);
  
  let pageNum = 1;
  paragraphs.forEach(p => {
    const trimmed = p.trim();
    if (!trimmed || trimmed.length < 30) return;
    
    // Extract page number from content
    const pageMatch = trimmed.match(/--\s*(\d+)\s*of\s*\d+\s*--/);
    if (pageMatch) {
      pageNum = parseInt(pageMatch[1]);
      return; // Skip page separator lines
    }
    
    parsedChunks.push({
      id: `SLIDE-${pageNum}`,
      source: 'Day 1: AI & LLM Foundation (Slide)',
      content: trimmed,
      cleanContent: removeAccents(trimmed.toLowerCase()),
    });
  });
  
  return parsedChunks;
})();

// All chunks combined
const allChunks = [...transcriptChunks, ...slideChunks];

export function searchTranscripts(query: string, topK = 4): RAGChunk[] {
  const cleanQuery = removeAccents(query.toLowerCase());
  const stopwords = new Set([
    'toi', 'dang', 'hoc', 'ket', 'qua', 'lam', 'bai', 'cau', 'tra', 'loi',
    'cua', 'la', 'cac', 'khac', 'dung', 'sai', 'hay', 'giup', 'phat', 'hien',
    'lo', 'hong', 'kien', 'thuc', 'va', 'de', 'xuat', 'slide', 'tuong', 'ung',
    'can', 'on', 'tap', 'nhe', 'cho', 'minh', 'xem', 'voi', 've', 'co', 'co-the',
    'trong', 'mot', 'nhung', 'de-xuat', 'gi', 'chi', 'ra', 'se', 'viec'
  ]);
  const words = cleanQuery.split(/\s+/).filter(w => w.length > 1 && !stopwords.has(w));
  
  if (words.length === 0) return [];
  
  const scored = allChunks.map(chunk => {
    let score = 0;
    
    words.forEach(word => {
      if (chunk.cleanContent.includes(word)) {
        score += 10;
        if (chunk.cleanContent.indexOf(word) !== -1) {
          score += 2;
        }
      }
    });
    
    // Boost score for slide content if query seems to be about current lesson
    const lessonKeywords = ['ai', 'llm', 'transformer', 'attention', 'token', 'context', 'agent', 'rag', 'prompt'];
    const isLessonQuery = words.some(w => lessonKeywords.includes(w));
    if (isLessonQuery && chunk.source.includes('Slide')) {
      score *= 1.2; // Slight boost for slide content
    }
    
    const lengthPenalty = Math.log(chunk.content.length) * 0.1;
    const finalScore = score > 0 ? score - lengthPenalty : 0;
    
    return { chunk, score: finalScore };
  });
  
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.chunk);
}

export function getAvailableTopics(): string[] {
  return [
    'Prompt Engineering co ban',
    'Context & Memory in LLMs',
    'Problem Statement in AI',
    'User Research & Impact Analysis',
    'Agent Architecture & Tool Calling',
    'RAG & Context Optimization',
    'Transformer & Attention Mechanism',
    'LLM Foundation - Slide Day 1',
  ];
}
