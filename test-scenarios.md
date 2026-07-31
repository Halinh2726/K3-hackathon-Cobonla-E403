# Kịch bản Test - VLearn Diagnostic

## 1. Luồng cơ bản: Xem slide và đặt câu hỏi

**Mô tả:** Người dùng mở slide, đọc nội dung và đặt câu hỏi cho AI tutor

**Các bước thực hiện:**
1. Mở ứng dụng → Hiển thị thư viện slide
2. Chọn 1 slide từ danh sách
3. Slide viewer mở ra, hiển thị nội dung PDF
4. Bấm nút chat (góc dưới phải) → Chatbot mở
5. Gõ câu hỏi: "Giải thích khái niệm này"
6. AI trả lời
7. Bấm đóng chatbot

**Kết quả mong đợi:**
- Slide hiển thị đúng nội dung
- Chatbot mở/đóng mượt mà
- AI trả lời đúng ngữ cảnh slide đang xem

---

## 2. Luồng Quiz: Tạo và làm bài trắc nghiệm

**Mô tả:** Người dùng yêu cầu AI tạo quiz từ nội dung slide, sau đó làm bài

**Các bước thực hiện:**
1. Mở slide → Bấm nút chat
2. Gõ: "Tạo quiz 5 câu từ nội dung này"
3. AI trả lời kèm `<quiz>...</quiz>` JSON
4. Bấm nút "Bắt đầu làm Quiz"
5. Làm 5 câu hỏi (chọn đáp án)
6. Bấm "Nộp bài"
7. Xem kết quả + danh sách câu sai

**Kết quả mong đợi:**
- Quiz được tạo đúng format JSON
- Mỗi câu có: `question`, `options` (4), `correctAnswer`
- Đáp án đúng/sai được đánh dấu sau khi nộp
- Hiển thị điểm số và % hoàn thành

---

## 3. Luồng Ôn tập: Kiểm tra → Ôn tập AI → Kiểm tra lại

**Mô tả:** Sau khi làm quiz sai, yêu cầu AI tutor ôn tập, rồi làm lại quiz

**Các bước thực hiện:**
1. Làm quiz lần 1 (giả sử sai 2 câu)
2. Nộp bài → Xem kết quả
3. Bấm "Ôn tập câu sai với AI Tutor"
4. Chatbot mở, AI giải thích các câu sai
5. Hỏi thêm: "Cho thêm ví dụ"
6. AI cung cấp ví dụ
7. Bấm "Tạo quiz mới"
8. AI tạo quiz mới
9. Bấm "Bắt đầu làm Quiz" lần 2
10. Làm quiz → Nộp bài

**Kết quả mong đợi:**
- AI nhận context là các câu sai từ quiz trước
- Quiz mới không trùng câu cũ
- AI tạo quiz với đầy đủ fields (`title`, `questions`)
- Lần 2 bấm quiz không bị crash
- Có thể lặp: Ôn tập → Quiz → Ôn tập → Quiz nhiều vòng

---

## 4. Luồng Bôi đen text: Chọn text và yêu cầu giải thích

**Mô tả:** Người dùng bôi đen 1 đoạn text trong slide, yêu cầu AI giải thích

**Các bước thực hiện:**
1. Mở slide có nhiều text
2. Bôi đen (highlight) 1 đoạn text trong slide
3. Thấy indicator "Đã chọn: ..."
4. Bấm nút "Giải thích với AI" (hoặc kéo vào chatbot)
5. Chatbot nhận text đã chọn
6. AI giải thích đoạn text đó

**Kết quả mong đợi:**
- Bôi đen text hoạt động trên PDF viewer
- Selected text được hiển thị
- Text được gửi kèm context lên AI
- AI giải thích đúng đoạn text được chọn

---

## 5. Luồng Quiz History: Xem lại các bài quiz đã lưu

**Mô tả:** Người dùng xem lại lịch sử các bài quiz đã làm

**Các bước thực hiện:**
1. Làm và lưu quiz thành công
2. Mở Chatbot → Bấm "Lịch sử Quiz"
3. Thấy danh sách các quiz đã lưu
4. Chọn 1 quiz cũ
5. Xem chi tiết: số câu, thời gian tạo
6. Bấm "Làm lại" hoặc "Xóa"

**Kết quả mong đợi:**
- Hiển thị đầy đủ quiz đã lưu trong localStorage
- Thông tin quiz: title, số câu, slide gốc, ngày tạo
- Chọn "Làm lại" → Mở quiz để làm lại
- Chọn "Xóa" → Quiz được xóa khỏi danh sách

---

## Checklist Test Cases

| STT | Test Case | Status |
|-----|-----------|--------|
| 1 | Mở slide từ thư viện | [ ] |
| 2 | Chat với AI tutor | [ ] |
| 3 | Tạo quiz từ AI | [ ] |
| 4 | Làm quiz và nộp bài | [ ] |
| 5 | Xem kết quả quiz | [ ] |
| 6 | Ôn tập với AI Tutor | [ ] |
| 7 | Tạo quiz lần 2 sau review | [ ] |
| 8 | Bôi đen text trong slide | [ ] |
| 9 | Gửi text đã chọn cho AI | [ ] |
| 10 | Xem lịch sử quiz | [ ] |
| 11 | Làm lại quiz cũ | [ ] |
| 12 | Xóa quiz khỏi lịch sử | [ ] |
| 13 | Validation quiz không hợp lệ | [ ] |
| 14 | Đóng/mở chatbot | [ ] |
| 15 | Chuyển trang slide | [ ] |
