// Slide service - handles slide data, text extraction, and simple RAG

import { d1SlideContent, d1SlideTotalPages } from '../data/slideContent';

export interface SlideData {
  id: string;
  name: string;
  pdfUrl: string;
  pdfBase64?: string; // For imported slides stored in localStorage
  textContent: string;
  totalPages: number;
  createdAt: number;
}

// Default slide - Day 1 Hackathon
const DEFAULT_SLIDE: SlideData = {
  id: 'd1-slide-hackathon',
  name: 'Day 1: AI & LLM Foundation',
  pdfUrl: '/slides/d1-slide-hackathon.pdf',
  textContent: d1SlideContent,
  totalPages: d1SlideTotalPages,
  createdAt: Date.now(),
};

const STORAGE_KEY = 'vlearn-slides';

function loadSlidesFromStorage(): SlideData[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load slides from storage', e);
  }
  return [];
}

function saveSlidesToStorage(slides: SlideData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
  } catch (e) {
    console.error('Failed to save slides to storage', e);
  }
}

// In-memory storage
let slideStorage: SlideData[] = [DEFAULT_SLIDE];

export function initializeSlides(): void {
  const saved = loadSlidesFromStorage();
  if (saved.length > 0) {
    slideStorage = saved;
  }
}

export function getDefaultSlide(): SlideData {
  return DEFAULT_SLIDE;
}

export function getAllSlides(): SlideData[] {
  // Merge storage slides with default slide
  const storageSlides = slideStorage.filter(s => s.id !== DEFAULT_SLIDE.id);
  return [DEFAULT_SLIDE, ...storageSlides];
}

export function getSlideById(id: string): SlideData | undefined {
  if (id === DEFAULT_SLIDE.id) return DEFAULT_SLIDE;
  return slideStorage.find(s => s.id === id);
}

export function addSlide(slide: SlideData): void {
  slideStorage = slideStorage.filter(s => s.id !== slide.id);
  slideStorage.unshift(slide);
  saveSlidesToStorage(slideStorage);
}

export async function importSlideFromFile(file: File): Promise<SlideData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const base64 = (e.target?.result as string).split(',')[1];
        const id = `slide-${Date.now()}`;
        const name = file.name.replace('.pdf', '');
        
        // For now, use placeholder text - could integrate pdf.js for extraction
        const slideData: SlideData = {
          id,
          name,
          pdfUrl: '', // Will use base64 instead
          pdfBase64: base64,
          textContent: `[Slide đã import: ${name}]\n\nNội dung text sẽ được trích xuất khi bạn mở slide.`,
          totalPages: 1, // Placeholder
          createdAt: Date.now(),
        };
        
        addSlide(slideData);
        resolve(slideData);
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Simple RAG: search relevant content from slide text
export interface SearchResult {
  content: string;
  score: number;
  page?: number;
}

export function searchSlideContent(
  query: string, 
  slideText: string, 
  maxResults: number = 3
): SearchResult[] {
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  if (queryWords.length === 0) {
    return [];
  }

  // Split text into paragraphs/sentences
  const paragraphs = slideText
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(p => p.length > 50);

  // Score each paragraph
  const scored = paragraphs.map(para => {
    const lowerPara = para.toLowerCase();
    let score = 0;
    
    for (const word of queryWords) {
      // Count occurrences
      const matches = (lowerPara.match(new RegExp(word, 'g')) || []).length;
      score += matches;
      
      // Bonus for exact phrase match
      if (lowerPara.includes(query.toLowerCase())) {
        score += 5;
      }
    }
    
    return { content: para, score };
  });

  // Return top results
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => ({ ...s, page: extractPageFromContent(s.content) }));
}

function extractPageFromContent(content: string): number {
  // Try to extract page number from content
  const pageMatch = content.match(/--\s*(\d+)\s*of\s*\d+\s*--/);
  if (pageMatch) {
    return parseInt(pageMatch[1]);
  }
  
  // Default to page 1
  return 1;
}

// Build context for AI from search results
export function buildRAGContext(query: string, slideText: string): string {
  const results = searchSlideContent(query, slideText, 5);
  
  if (results.length === 0) {
    return '';
  }

  const contextParts = results.map((r, i) => {
    const pageInfo = r.page ? ` (Trang ${r.page})` : '';
    return `[Đoạn liên quan ${i + 1}${pageInfo}]:\n${r.content}`;
  });

  return `
=== NGỮ CẢNH TỪ SLIDE ===
${contextParts.join('\n\n')}
=== HẾT NGỮ CẢNH ===
`;
}
