# Template AI Spec *(spec.md — commit trước 23:59 N1 · quality bar chốt từ thời điểm nộp)*

> Cấu trúc phủ đúng "SPEC 8 phần" của chương trình: Bằng chứng (§1-§2) · Lát cắt (§4) · Canvas (đính kèm CP1) · Augment/Automate (§4) · 4 đường đi của trải nghiệm (§6) · Kiểu lỗi (§5) · Kiểm thử (§7) · Phân công (§8). Hướng dẫn viết từng mục: `02-guide.md`.

```markdown
# AI SPEC — [Sau một buổi học, Gap2Go tạo bài kiểm tra ngắn từ slide, dùng kết quả để xác định khái niệm người học có khả năng chưa hiểu và đề xuất đúng phần slide cần ôn lại trong thời gian giới hạn.] · Nhóm [Cobonla] · Zone [5]
Hướng: [ x ] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [ ] Tối ưu tính năng có sẵn  [ x ] Tính năng mới

## §1. User & Job
- Job executor + workflow:
  Học viên vừa kết thúc một buổi học có slide, muốn kiểm tra nhanh mình đã hiểu bài chưa
  trước khi chuyển sang bài tiếp theo hoặc làm bài tập.
  Học viên xin nghỉ học, chưa nắm được kiến thức. 

  Workflow hiện tại:
  Mở lại slide → đọc lại toàn bộ → tự đoán phần chưa hiểu → tìm video hoặc hỏi bạn →
  mất nhiều thời gian nhưng vẫn không chắc mình đang thiếu kiến thức nào.

- Core JTBD:
  Sau một buổi học, xác định chính xác phần kiến thức mình chưa nắm và biết phần tối thiểu
  cần ôn lại trước khi tiếp tục học.

- Problem statement:
  Học viên thường chỉ nhận ra mình chưa hiểu khi bắt đầu làm bài tập. Việc đọc lại toàn bộ
  slide tốn thời gian và không chỉ ra được nguyên nhân gốc, đặc biệt khi vấn đề nằm ở một
  kiến thức tiên quyết.
- Evidence:
  - Số liệu mining / kết quả khảo sát:

    Nhóm đã thực hiện khảo sát với 116–117 người học.

    - 91/117 người, tương đương 77,8%, cho biết sau một buổi học lý thuyết họ chỉ đọng lại dưới 50% kiến thức; chỉ 26/117 người, tương đương 22,2%, cho biết nhớ được trên 50%.

    - Trong 116 người trả lời về khó khăn lớn nhất khi ôn bài:
      - 61/116 người, tương đương 52,6%, không biết chính xác mình chưa hiểu phần nào.
      - 20/116 người, tương đương 17,2%, phải đọc hoặc xem lại quá nhiều nội dung.
      - 18/116 người, tương đương 15,5%, không biết mình đang thiếu kiến thức của bài hiện tại hay kiến thức từ bài trước.
      - 17/116 người, tương đương 14,7%, tìm được tài liệu nhưng không biết nên học phần nào trước.

    - 105/117 người, tương đương 89,7%, sẵn sàng sử dụng chatbot hỗ trợ tạo quiz từ kiến thức sau buổi học.

    - 106/117 người, tương đương 90,6%, cho rằng tính năng tổng hợp những phần kiến thức chưa hiểu sau khi làm quiz là hữu ích.

    Kết quả cho thấy phần lớn người được khảo sát gặp khó khăn trong việc xác định chính xác lỗ hổng kiến thức, đồng thời có mức sẵn sàng sử dụng cao đối với tính năng tạo quiz và tổng hợp phần cần ôn lại.

- Quote/ví dụ minh họa giả định:

  1. "Học xong em biết là mình chưa hiểu, nhưng không biết chính xác đang vướng ở slide nào."  

  2. "Nhiều lúc em làm sai bài nhưng không biết là do phần hôm nay khó hay do em quên kiến thức buổi trước."  

  3. "Mỗi lần ôn em thường đọc lại từ đầu, tốn khá nhiều thời gian mà vẫn không chắc phần nào là quan trọng."  

  4. "Em tìm được nhiều video với tài liệu lắm, nhưng không biết nên xem cái nào trước nên cuối cùng lại bỏ qua."  

  5. "Nếu hệ thống chỉ rõ vì sao em sai và dẫn đúng phần cần học lại thì em sẽ tin hơn là chỉ báo đúng hay sai."  

## §2. Impact & quyết định chọn

| Ứng viên | Bao nhiêu người gặp / xác nhận nhu cầu | Tần suất | Tốn gì mỗi lần | Khả thi trong sự kiện | Chọn |
|---|---:|---|---|---|---|
| Tóm tắt slide sau buổi học | Tín hiệu gần nhất là 20/116 người (17,2%) cho biết phải đọc hoặc xem lại quá nhiều nội dung | Có thể xảy ra sau mỗi buổi học lý thuyết; chưa đo số lần/tuần | Tốn thời gian đọc hoặc xem lại nhiều nội dung; chưa đo cụ thể số phút | Cao | Không |
| Sinh đề kiểm tra từ slide | 105/117 người (89,7%) sẵn sàng sử dụng chatbot tạo quiz sau buổi học | Có nhu cầu sau buổi học; chưa đo số lần/tuần | Tốn công tự kiểm tra mức độ hiểu bài hoặc tự tìm câu hỏi; chưa đo cụ thể số phút | Cao | Không |
| Phát hiện lỗ hổng và chọn phần cần ôn | 106/117 người (90,6%) cho rằng tính năng tổng hợp phần chưa hiểu là hữu ích; 96/116 người (82,8%) gặp khó khăn trực tiếp liên quan đến xác định lỗ hổng, kiến thức nền hoặc thứ tự ôn tập | Có nhu cầu sau mỗi lần học xong hoặc trước khi làm bài; chưa đo số lần/tuần | Có nguy cơ phải ôn lại sai phần, đọc quá nhiều nội dung và không biết nên học gì trước; chưa đo cụ thể số phút hoặc điểm số | Trung bình | Có |

- Ứng viên ĐÃ LOẠI:
  1. Tóm tắt slide: dễ xây nhưng không kiểm tra được người học thực sự chưa hiểu gì.
  2. Chỉ sinh đề: tạo được câu hỏi nhưng chưa chuyển kết quả sai thành hành động học tiếp theo.

- Ứng viên CHỌN:
  Phát hiện lỗ hổng và đề xuất phần học bù tối thiểu vì [điền số liệu khảo sát/mining],
  đồng thời có thể prototype bằng một môn, một bộ slide và một bài kiểm tra ngắn.

## §3. Giải pháp tương tự đã nghiên cứu

- ChatGPT / chế độ học tập:
  - Flow: người học tải nội dung hoặc đặt câu hỏi, hệ thống hướng dẫn theo hội thoại.
  - Đáng học: có thể hỏi tiếp và điều chỉnh theo phản hồi của người học.
  - Đáng né: kết quả có thể mở rộng ngoài phạm vi tài liệu nếu không kiểm soát nguồn.
  - Gap2Go khác: mọi câu hỏi và chẩn đoán phải trỏ được về concept và slide nguồn.

- NotebookLM:
  - Flow: nhập nguồn, đặt câu hỏi hoặc tạo nội dung dựa trên nguồn.
  - Đáng học: hiển thị căn cứ để người dùng kiểm tra.
  - Đáng né: chưa tập trung vào chẩn đoán prerequisite từ chuỗi câu trả lời.
  - Gap2Go khác: kết quả chính là bản đồ lỗ hổng và lộ trình học bù theo thời gian.

- Quizlet hoặc công cụ sinh quiz:
  - Flow: nhập tài liệu → tạo câu hỏi → người học trả lời.
  - Đáng học: flow làm bài nhanh, phản hồi trực tiếp.
  - Đáng né: câu trả lời sai thường chỉ dẫn đến xem đáp án, chưa xác định nguyên nhân gốc.
  - Gap2Go khác: sai một câu chỉ là bằng chứng; hệ thống cần nhiều bằng chứng trước khi kết luận.

## §4. Thiết kế

- Lát cắt MỘT CÂU:
  Một học viên vừa học xong trên slide, làm bài kiểm tra 8-10 câu; hệ thống dùng các câu sai
  và mức độ câu hỏi để xác định khái niệm có khả năng bị hổng, rồi chọn phần slide tối thiểu
  cần ôn lại trong giới hạn 15 phút.

- Non-goals:
  1. Không xây hệ thống quản lý khóa học đầy đủ.
  2. Không hỗ trợ mọi môn học trong prototype.
  3. Không tự động quyết định điểm số chính thức.
  4. Không tạo bài giảng mới hoàn toàn ngoài slide.
  5. Không khẳng định chắc chắn lỗ hổng chỉ dựa trên một câu sai.

- Mức prototype nhắm tới:
  [x] Mock

  Phần thật:
  - Đọc nội dung slide hoặc dữ liệu slide đã trích xuất.
  - Sinh câu hỏi bằng AI.
  - Gắn câu hỏi với concept và slide.
  - Phân tích đáp án và đề xuất phần cần ôn.

  Phần mock:
  - Tích hợp LMS.
  - Kho học liệu bên ngoài.

- Automation:
  [x] Conditional

- Lý do theo cost-of-error:
  AI có thể tự tạo đề và chẩn đoán khi thông tin trong slide rõ và có căn cứ.
  Khi slide mờ, thiếu nội dung, có nhiều cách hiểu hoặc chỉ có một bằng chứng,
  hệ thống phải giảm mức chắc chắn, hỏi thêm hoặc không kết luận.
  Chẩn đoán sai có thể khiến học viên học sai phần và mất thời gian, vì vậy không chọn
  automate hoàn toàn.
### §4b. Nguyên tắc đã áp dụng

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| G1 — Làm rõ hệ thống làm được gì | Màn hình đầu nói rõ hệ thống chỉ tạo đề và chẩn đoán dựa trên slide đã tải |
| G2 — Làm rõ nó làm tốt đến đâu | Kết quả có mức tin cậy và danh sách slide làm căn cứ |
| G10 — Thu hẹp phạm vi khi nghi ngờ | Slide không rõ hoặc thiếu dữ kiện thì không sinh câu hỏi khẳng định chắc chắn |
| G9 — Sửa dễ dàng | Người học có thể báo câu hỏi sai, chọn lại đáp án hoặc yêu cầu tạo câu xác nhận |
| G11 — Giải thích vì sao | Mỗi lỗ hổng hiển thị các câu sai, concept liên quan và đoạn slide dẫn đến kết luận |
| PAIR — Feedback & Control | Người học được bỏ qua đề xuất, chọn thời gian học và phản hồi “chẩn đoán không đúng” |

## §5. Kiểu lỗi — 4 lớp chỗ khó

| Tình huống | Lớp | Hành vi mong muốn | Nguyên tắc |
|---|---|---|---|
| Một slide là ảnh mờ, không đọc được công thức | Nguồn sự thật | Đánh dấu slide không đọc được, không tạo câu hỏi từ phần đó | G2, G10 |
| Slide chỉ ghi kết quả mà không có giải thích | Nguồn sự thật | Chỉ hỏi nội dung xuất hiện; không tự thêm lập luận ngoài tài liệu | G1, G10 |
| File có hai chủ đề nhưng người dùng không chọn chủ đề | Mơ hồ | Hỏi người dùng muốn kiểm tra chủ đề nào | G10 |
| Người dùng yêu cầu bài 5 phút nhưng không có trình độ đầu vào | Mơ hồ | Tạo đề cơ bản và nói rõ giả định; cho phép đổi mức | G2, G9 |
| Người dùng hỏi kiến thức không xuất hiện trong slide | Ngoài phạm vi | Nói rõ nội dung ngoài nguồn và không dùng nó để chẩn đoán | G1, G10 |
| Người dùng yêu cầu dự đoán chính xác câu thi | Ngoài phạm vi | Từ chối khẳng định; chỉ tạo câu luyện tập từ slide | G1 |
| Một câu trắc nghiệm có hai đáp án hợp lý | Đặc thù domain | Không đưa câu vào đề hoặc đánh dấu cần duyệt | G2, G10 |
| Học viên sai một câu do đọc nhầm nhưng hệ thống kết luận hổng kiến thức | Đặc thù domain | Chỉ ghi “có khả năng”; tạo câu xác nhận trước khi kết luận | G11, G9 |
| Prerequisite không có trong slide hiện tại | Đặc thù domain | Ghi đây là giả thuyết, yêu cầu tài liệu buổi trước hoặc câu kiểm tra bổ sung | G2, G10 |
| Đáp án trong slide và ví dụ mâu thuẫn nhau | Nguồn sự thật | Nêu mâu thuẫn, không chọn một phía như sự thật | G2, G11 |

## §6. Bốn đường đi của trải nghiệm

- Happy path:
  Người học tải slide rõ → hệ thống trích xuất concept → tạo đề → học viên trả lời →
  hiển thị concept đã nắm, concept cần ôn và các slide nên xem lại.

- Low-confidence:
  Hệ thống chỉ có một câu sai hoặc quan hệ prerequisite chưa chắc →
  hiển thị “có khả năng” và đưa thêm một câu xác nhận.

- Failure/không căn cứ:
  Slide không đọc được hoặc không chứa đủ nội dung →
  chỉ rõ slide nào có vấn đề và yêu cầu người dùng tải bản rõ hơn.

- Correction:
  Người học chọn “câu này mơ hồ” hoặc sửa câu trả lời →
  hệ thống tính lại chẩn đoán và lưu dấu thay đổi.

- Khi bị đòi ngoài phạm vi:
  Hệ thống không trả lời như thể kiến thức đó có trong slide; giải thích phạm vi nguồn.

- Case đặc thù domain:
  Khi câu hỏi có nhiều đáp án đúng hoặc công thức không đủ điều kiện,
  hệ thống loại câu đó khỏi phần chấm và thông báo lý do.

## §7. Kiểm thử

- Chiều chất lượng + định nghĩa kiểm chứng được:

  1. Groundedness:
     Pass khi nội dung cần để trả lời câu hỏi xuất hiện trong slide được dẫn chiếu.

  2. Tính đơn nghĩa:
     Pass khi chỉ có một đáp án đúng theo nội dung slide.

  3. Coverage:
     Pass khi các concept quan trọng đều có ít nhất một câu kiểm tra phù hợp.

  4. Diagnostic validity:
     Pass khi chẩn đoán được hỗ trợ bởi ít nhất hai bằng chứng hoặc được ghi là giả thuyết
     cần xác nhận.

  5. Actionability:
     Pass khi đề xuất học lại trỏ đến slide hoặc đoạn nội dung cụ thể, không chỉ ghi “ôn lại bài”.

  6. Graceful failure:
     Pass khi input không đủ nhưng hệ thống không bịa và đưa được hành động tiếp theo.
- Golden set:
  - 8 case thông thường.
  - 2 case slide mờ/thiếu nguồn.
  - 2 case nguồn mâu thuẫn.
  - 2 case input mơ hồ.
  - 2 case ngoài phạm vi.
  - 2 case câu hỏi có nhiều đáp án hoặc sai chuyên môn.
  - 2 case chỉ có một bằng chứng nhưng hệ thống có nguy cơ kết luận quá mức.
- Quality bar:
  "Đạt khi ít nhất 70% case qua toàn bộ tiêu chí;
  100% câu hỏi được chấp nhận phải có căn cứ từ slide;
  và không có lỗi nghiêm trọng khiến người học học sai kiến thức."

## §8. Phân công & kế hoạch

- Phân công:
  - [Hà Hoàng Tuấn Hùng] khảo sát và tổng hợp quote, system prompt
  - [Phạm Hà Linh] data, idea, pipeline
  - [Trần Chí Tâm] code/UI, git, AI
  - [Nguyễn Doãn Hoàng] backend, AI

- Willing users:
  1. [Trung — vai người học]
  2. [Thái — vai người học]
  3. [Nguyên — vai người học]
  4. [Thiện — vai người học]
  5. [Dương — vai người học]


- Kế hoạch validation:
  Giao task: “Hãy dùng slide này để kiểm tra xem bạn cần ôn phần nào trước khi làm bài tập.”

  Sau khi quan sát, hỏi:
  1. Điều gì khó hiểu hoặc khó chịu nhất?
  2. Bạn có tin kết quả chẩn đoán này không? Vì sao?
  3. Bạn có dùng nó sau một buổi học thật không? Vì sao hoặc vì sao chưa?

- Multi-prototype:
  - Phương án A: tạo đề ngay sau khi tải slide.
  - Phương án B: cho người học chọn mục tiêu và thời gian trước khi tạo đề.
  - Trục khác biệt: mức độ chủ động của hệ thống.
  - Phương án chọn: [điền sau khi thử].

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
```
