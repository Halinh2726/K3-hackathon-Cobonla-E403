import { searchTranscripts } from './rag';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const getApiKey = () => localStorage.getItem('vlearn-gemini-api-key') || import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Standard fetch implementation for Gemini 3.5 Flash with optional file attachment (Base64)
 */
export async function askGemini(
  userQuery: string,
  history: { role: 'user' | 'model'; content: string }[],
  attachedFile?: { mimeType: string; base64: string }
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return 'Lỗi: Chưa cấu hình VITE_GEMINI_API_KEY trong file .env hoặc cài đặt.';
  }

  // 1. Retrieve context using RAG
  const relevantChunks = searchTranscripts(userQuery, 5);
  const contextText = relevantChunks.map(chunk => `[Nguồn ${chunk.id} - ${chunk.source}]: ${chunk.content}`).join('\n\n');

  // 2. Build system instructions
  const systemInstruction = `Bạn là VLearn AI Tutor, trợ lý học tập thông minh cho khóa học "AI Thực Chiến".
Nhiệm vụ của bạn là giải đáp thắc mắc của học viên dựa trên các tài liệu bài học và transcript được cung cấp dưới đây.
Học viên cũng có thể gửi các tệp đính kèm (như ảnh lỗi code, sơ đồ, ảnh chụp màn hình, tài liệu PDF). Hãy phân tích kỹ tài liệu đính kèm đó và đối chiếu với kiến thức bài học để giải đáp chính xác nhất.

DƯỚI ĐÂY LÀ NGỮ CẢNH BÀI HỌC (TRANSCRIPT):
---
${contextText || 'Không tìm thấy tài liệu phù hợp trong bài học cho câu hỏi này.'}
---

QUY TẮC QUAN TRỌNG:
1. CHỈ TRẢ LỜI dựa trên ngữ cảnh bài học được cung cấp ở trên. KHÔNG LẤY DỮ LIỆU BÊN NGOÀI hoặc trả lời các câu hỏi không liên quan đến bài học của mình (ví dụ: cách nấu ăn, viết code các dự án ngoài học phần, tin tức xã hội, giải trí...). Nếu học viên hỏi những câu hỏi này, hãy từ chối lịch sự bằng tiếng Việt: "Tôi là trợ lý học tập VLearn, tôi chỉ có thể giải đáp các câu hỏi liên quan đến nội dung bài học. Rất tiếc tôi không thể trả lời câu hỏi này."
2. Khi trích dẫn thông tin từ ngữ cảnh, hãy ghi rõ nguồn ở cuối câu bằng ký hiệu trích dẫn như: [T01-012] hoặc [T04-015].
3. Nếu học viên yêu cầu tạo câu hỏi trắc nghiệm hoặc quizz để ôn tập (ví dụ: "tạo quizz về Day 2", "cho tôi bài tập về RAG"), bạn hãy tạo một bộ câu hỏi gồm số lượng câu trắc nghiệm đúng theo yêu cầu của học viên (nếu học viên không chỉ định rõ số lượng thì mặc định tạo 3 câu, tối đa là 10 câu để tránh quá giới hạn ký tự) liên quan trực tiếp đến chủ đề đó dựa trên bài học.
   Để học viên có thể làm bài tập trực quan, bạn PHẢI đính kèm khối cấu trúc XML chứa dữ liệu JSON ở cuối câu trả lời của bạn:
   <quiz>
   {
     "title": "Tên Chủ Đề",
     "questions": [
       {"question": "Câu hỏi 1", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correctAnswer": 0, "hint": "Giải thích gợi ý"},
       {"question": "Câu hỏi 2", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correctAnswer": 1, "hint": "Giải thích gợi ý"},
       {"question": "Câu hỏi 3", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correctAnswer": 2, "hint": "Giải thích gợi ý"}
     ]
   }
   </quiz>
   
   Lưu ý về Quiz:
   - Phần JSON nằm ở giữa cặp thẻ <quiz> và </quiz> phải là một chuỗi JSON hợp lệ.
   - Hãy viết các câu hỏi, lựa chọn (options) và giải thích (hint) cực kỳ ngắn gọn, súc tích (không quá 15 từ mỗi câu) để tránh tình trạng phản hồi dài quá giới hạn và bị cắt ngang.
   - Khuyến khích viết toàn bộ phần JSON này một cách gọn gàng, liền mạch.
   - correctAnswer phải là chỉ mục dạng số (0 cho A, 1 cho B, 2 cho C, 3 cho D).
   - Các câu hỏi phải sát với kiến thức trong bài học được cung cấp.`;

  // 3. Format message history for Gemini API
  const userParts: any[] = [{ text: userQuery }];
  if (attachedFile) {
    userParts.unshift({
      inlineData: {
        mimeType: attachedFile.mimeType,
        data: attachedFile.base64
      }
    });
  }

  const contents = [
    ...history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })),
    {
      role: 'user',
      parts: userParts
    }
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 8192,
          }
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', errText);
      return `Lỗi kết nối API Gemini: ${response.statusText} (${response.status})`;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return 'Không nhận được câu trả lời từ AI. Vui lòng thử lại.';
    }

    return text;
  } catch (error) {
    console.error('API Call Exception:', error);
    return 'Lỗi: Không thể kết nối đến máy chủ Gemini. Vui lòng kiểm tra lại kết nối mạng.';
  }
}
