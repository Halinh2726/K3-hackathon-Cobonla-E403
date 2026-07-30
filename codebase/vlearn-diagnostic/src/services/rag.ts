import t1 from '../assets/transcripts/transcript-01-clean.md?raw';
import t2 from '../assets/transcripts/transcript-02-clean.md?raw';
import t3 from '../assets/transcripts/transcript-03-clean.md?raw';
import t4 from '../assets/transcripts/transcript-04-clean.md?raw';
import t5 from '../assets/transcripts/transcript-05-clean.md?raw';
import t6 from '../assets/transcripts/transcript-06-clean.md?raw';

export interface RAGChunk {
  id: string;
  source: string;
  content: string;
  cleanContent: string;
}

const rawTranscripts = [
  { text: t1, source: 'Day 2 sáng - Xác định bài toán kinh doanh cho AI' },
  { text: t2, source: 'Day 2 - Chỉ số thành công & mức tự động hoá' },
  { text: t3, source: 'Day 2 chiều - Soi bài toán các nhóm & ràng buộc' },
  { text: t4, source: 'Day 1 - Foundation: cách LLM hoạt động' },
  { text: t5, source: 'Buổi về bài toán, đánh giá & dữ liệu' },
  { text: t6, source: 'Buổi Foundation: transformer & attention' },
];

function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// Parse transcripts into searchable chunks
const chunks: RAGChunk[] = (() => {
  const parsedChunks: RAGChunk[] = [];
  
  rawTranscripts.forEach(({ text, source }) => {
    // Split by double newline or lines to find paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    
    paragraphs.forEach(p => {
      const trimmed = p.trim();
      if (!trimmed) return;
      
      // Match [Txx-NNN] or **[Txx-NNN]**
      const match = trimmed.match(/\[(T\d{2}-\d{3})\]/);
      if (match) {
        const id = match[1];
        // Clean content: remove block markers
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

/**
 * Searches the transcripts using simple keyword overlap with accent insensitivity
 */
export function searchTranscripts(query: string, topK = 4): RAGChunk[] {
  const cleanQuery = removeAccents(query.toLowerCase());
  const stopwords = new Set([
    'toi', 'dang', 'hoc', 'ket', 'qua', 'lam', 'bai', 'cau', 'tra', 'loi',
    'cua', 'la', 'cac', 'khac', 'dung', 'sai', 'hay', 'giup', 'phat', 'hien',
    'lo', 'hong', 'kien', 'thuc', 'va', 'de', 'xuat', 'slide', 'tuong', 'ung',
    'can', 'on', 'tap', 'nhe', 'cho', 'minh', 'xem', 'voi', 've', 'co', 'co-the',
    'trong', 'mot', 'nhung', 'de-xuat'
  ]);
  const words = cleanQuery.split(/\s+/).filter(w => w.length > 1 && !stopwords.has(w));
  
  if (words.length === 0) return [];
  
  const scored = chunks.map(chunk => {
    let score = 0;
    
    // Calculate simple keyword match score
    words.forEach(word => {
      if (chunk.cleanContent.includes(word)) {
        score += 10; // base points for match
        // bonus if it matches exact substring
        if (chunk.cleanContent.indexOf(word) !== -1) {
          score += 2;
        }
      }
    });
    
    // Penalize excessively long chunks slightly to favor concise answers
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

/**
 * Gets a quick list of unique topics from the lessons for suggestions
 */
export function getAvailableTopics(): string[] {
  return [
    'Prompt Engineering cơ bản',
    'Context & Memory in LLMs',
    'Problem Statement in AI',
    'User Research & Impact Analysis',
    'Agent Architecture & Tool Calling',
    'RAG & Context Optimization',
    'Transformer & Attention Mechanism',
  ];
}
