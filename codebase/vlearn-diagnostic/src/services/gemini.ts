import { searchTranscripts } from './rag';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const getApiKey = () => localStorage.getItem('vlearn-gemini-api-key') || import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Standard fetch implementation for Gemini 3.5 Flash with optional file attachment (Base64)
 * Optional slideContext adds the currently viewed slide's content to the context
 */
export async function askGemini(
  userQuery: string,
  history: { role: 'user' | 'model'; content: string }[],
  attachedFile?: { mimeType: string; base64: string },
  slideContext?: string,
  reviewMode?: {
    isReviewMode: boolean;
    wrongQuestions: { index: number; question: any }[];
    quizTitle: string;
  }
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return 'Lỗi: Chưa cấu hình VITE_GEMINI_API_KEY trong file .env hoặc cài đặt.';
  }

  // 1. Retrieve context using RAG
  const relevantChunks = searchTranscripts(userQuery, 5);
  const contextText = relevantChunks.map(chunk => `[Nguồn ${chunk.id} - ${chunk.source}]: ${chunk.content}`).join('\n\n');

  // 2. Build system instructions
  const slideContextSection = slideContext ? `
=== SLIDE ĐANG XEM ===
${slideContext}
=== HẾT SLIDE ===
` : '';

  // Review mode context
  let reviewModeSection = '';
  let reviewModeInstruction = '';
  if (reviewMode?.isReviewMode && reviewMode.wrongQuestions.length > 0) {
    const wrongQsList = reviewMode.wrongQuestions
      .map((wq) => `Câu ${wq.index + 1}: ${wq.question.question}`)
      .join('\n');
    reviewModeSection = `
=== CHẾ ĐỘ ÔN TẬP SAU QUIZ ===
Quiz: "${reviewMode.quizTitle}"
Các câu bị sai:
${wrongQsList}
---`;
    reviewModeInstruction = `

4. [CHẾ ĐỘ ÔN TẬP] Khi có danh sách các câu bị sai:
   a) GIẢI THÍCH từng câu sai với nội dung đúng từ slide/transcript
   b) KÈM TRÍCH DẪN cụ thể: ví dụ "[SLIDE-2]", "[T01-015]"
   c) Dùng format: "**Câu X bị sai**: [giải thích đúng] [trích dẫn]"
   d) SAU KHI giải thích xong, THÊM hỏi user: "Bạn muốn luyện tập thêm không?"
   e) NẾU user muốn quiz: hỏi "Bạn muốn quiz về **(1)** toàn bộ nội dung hay **(2)** chỉ các câu sai?"`;
  } else {
    reviewModeInstruction = `4.`;
  }

  const systemInstruction = `Bạn là VLearn AI Tutor, trợ lý học tập thông minh cho khóa học "AI Thực Chiến".
Nhiệm vụ của bạn là giải đáp thắc mắc của học viên dựa trên các tài liệu bài học và transcript được cung cấp dưới đây.
Học viên cũng có thể gửi các tệp đính kèm (như ảnh lỗi code, sơ đồ, ảnh chụp màn hình, tài liệu PDF). Hãy phân tích kỹ tài liệu đính kèm đó và đối chiếu với kiến thức bài học để giải đáp chính xác nhất.

DƯỚI ĐÂY LÀ NGỮ CẢNH BÀI HỌC (TRANSCRIPT):
---
${contextText || 'Không tìm thấy tài liệu phù hợp trong bài học cho câu hỏi này.'}
---${slideContextSection}${reviewModeSection}

QUY TẮC QUAN TRỌNG:
1. ƯU TIÊU trả lời dựa trên nội dung SLIDE ĐANG XEM nếu có. Sau đó mới dùng ngữ cảnh transcript.
2. CHỈ TRẢ LỜI dựa trên ngữ cảnh bài học được cung cấp ở trên. KHÔNG LẤY DỮ LIỆU BÊN NGOÀI hoặc trả lời các câu hỏi không liên quan đến bài học của mình (ví dụ: cách nấu ăn, viết code các dự án ngoài học phần, tin tức xã hội, giải trí...). Nếu học viên hỏi những câu hỏi này, hãy từ chối lịch sự bằng tiếng Việt: "Tôi là trợ lý học tập VLearn, tôi chỉ có thể giải đáp các câu hỏi liên quan đến nội dung bài học. Rất tiếc tôi không thể trả lời câu hỏi này."
3. Khi trích dẫn thông tin từ ngữ cảnh, hãy ghi rõ nguồn ở cuối câu bằng ký hiệu trích dẫn như: [T01-012] hoặc [SLIDE-3].
${reviewModeInstruction}
5. Nếu học viên yêu cầu tạo câu hỏi trắc nghiệm hoặc quiz để ôn tập (ví dụ: "tạo quiz về bài này", "cho tôi bài tập", "ôn tập"), bạn hãy tạo bộ câu hỏi trắc nghiệm theo các quy tắc sau:
   a) NẾU KHÔNG CÓ SLIDE ĐANG XEM (slideContext rỗng): Trả lời lịch sự rằng "Bạn cần truy cập vào một slide cụ thể trước để tôi có thể tạo quiz phù hợp với nội dung bài học đó. Vui lòng chọn slide từ Thư viện Slide trước nhé!"
   b) NẾU CÓ SLIDE: Tự quyết định số lượng câu hỏi dựa trên độ dài và phức tạp của nội dung:
      - Slide ngắn (< 300 từ): 3-5 câu
      - Slide trung bình (300-800 từ): 5-10 câu
      - Slide dài (> 800 từ): 10-20 câu
   c) Nếu học viên yêu cầu số câu cụ thể (ví dụ: "tạo 30 câu", "tạo quiz đầy đủ với 50 câu"), hãy tạo đúng số lượng đó miễn là nội dung cho phép.
   <quiz>
   {
     "title": "Tên Chủ Đề",
     "questions": [
       {"question": "Câu hỏi 1", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correctAnswer": 0, "hint": "Giải thích gợi ý"},
       {"question": "Câu hỏi 2", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correctAnswer": 1, "hint": "Giải thích gợi ý"}
     ]
   }
   </quiz>
   
   Lưu ý về Quiz:
   - Phần JSON nằm ở giữa cặp thẻ <quiz> và </quiz> phải là một chuỗi JSON hợp lệ.
   - Viết câu hỏi, lựa chọn và hint cực kỳ ngắn gọn (không quá 15 từ mỗi câu) để tránh phản hồi bị cắt ngang.
   - correctAnswer phải là chỉ mục dạng số (0 cho A, 1 cho B, 2 cho C, 3 cho D).
   - Các câu hỏi phải sát với kiến thức trong slide được cung cấp.${reviewMode?.isReviewMode ? `

   [QUAN TRỌNG] Khi tạo quiz trong chế độ ôn tập:
   - Nếu user chọn "(1) toàn bộ nội dung": tạo quiz bao quát toàn bộ slide
   - Nếu user chọn "(2) chỉ các câu sai": tạo quiz chỉ về nội dung các câu bị sai, câu hỏi phải KHÁC HOÀN TOÀN với các câu đã làm sai (đảo ngược logic, thay đổi context hỏi)` : ''}`;

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
      `https://generativelanguage.googleapis.com/v1beta/models/${import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`,
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
      let errorMessage = `Lỗi kết nối API Gemini: ${response.statusText} (${response.status})`;

      // Try to parse error from response
      try {
        const errData = JSON.parse(errText);
        const errMsg = errData?.error?.message || '';
        if (response.status === 503 || errMsg.toLowerCase().includes('high demand')) {
          errorMessage = '⚠️ Gemini đang quá tải. Vui lòng chờ vài giây rồi thử lại.';
        } else if (response.status === 400 && errMsg.toLowerCase().includes('api key')) {
          errorMessage = '🔑 API Key không hợp lệ. Vui lòng kiểm tra lại API Key trong phần Cài đặt.';
        } else if (response.status === 429) {
          errorMessage = '⏳ Đã vượt giới hạn request. Vui lòng chờ và thử lại sau.';
        } else if (errMsg) {
          errorMessage = `Lỗi: ${errMsg}`;
        }
      } catch {
        // Use default error message
      }

      return errorMessage;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return 'Không nhận được câu trả lời từ AI. Vui lòng thử lại.';
    }

    return text;
  } catch (error) {
    return '🌐 Lỗi mạng. Vui lòng kiểm tra kết nối internet và thử lại.';
  }
}
