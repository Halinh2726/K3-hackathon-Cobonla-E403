// Extracted text content from d1-slide-hackathon.pdf
// This content is used for RAG context when user asks chatbot about the slide

export const d1SlideTotalPages = 29;

export const d1SlideContent = `
AI IN ACTION - Day 1
AI & LLM Foundation
Bạn đang dùng AI mỗi ngày — nhưng thực sự bên trong nó đang làm gì?

-- 1 of 29 --

Agenda:
- Bức tranh AI và các tầng của AI
- Lịch sử AI 70 năm
- Bên trong LLM: cơ chế vận hành
- Từ LLM đến AI Agent
- Landscape: model hôm nay và cuộc đua hiện tại
- Chọn model và chi phí token
- Gọi API lần đầu
- Tổng kết

Từ "nghe AI" đến "gọi AI" trong một ngày

-- 2 of 29 --

AI, ML, Deep Learning, GenAI, LLM — nằm ở đâu trong cùng một hệ?

AI — chiếc ô lớn nhất: mọi hệ thống có yếu tố "thông minh".
Machine learning — học từ dữ liệu thay vì viết luật tay.
Deep learning — mạng nơ-ron nhiều tầng tự học đặc trưng.
Generative AI — sinh nội dung mới: văn bản, ảnh, code.
LLM — model nền chuyên ngôn ngữ, tim của làn sóng hiện nay.

Thứ tự từ rộng đến hẹp:
- ARTIFICIAL INTELLIGENCE
- MACHINE LEARNING
- DEEP LEARNING
- GENERATIVE AI
- LLM

Ví dụ:
- AI: kể cả hệ luật tay, robot
- ML: lọc spam, gợi ý phim
- Deep Learning: nhận diện ảnh, giọng nói
- GenAI: văn bản, ảnh, code
- LLM: GPT, Claude, Kimi

LLM không phải toàn bộ AI — nhưng nó là tầng nền của gần hết trải nghiệm AI bạn dùng hôm nay.

-- 3 of 29 --

Discriminative AI: Giỏi phân loại, dự đoán: lọc spam, phát hiện gian lận, nhận diện ảnh. Input → một nhãn, một con số

Generative AI: Sinh ra thứ mới: văn bản, ảnh, code. ChatGPT, Claude, Midjourney. Prompt → nội dung mới

Agentic AI: Nhận mục tiêu rồi tự làm nhiều bước: lập kế hoạch, dùng công cụ, hành động. Goal → Plan → Action

Ba nhóm AI chính: phân loại, sinh nội dung, hành động

LLM là engine chung của cả Generative lẫn Agentic

Hành trình khóa học: LLM Foundation → Agent → Multi-Agent → Deploy → Evaluate

-- 4 of 29 --

Lịch sử AI 70 năm:
- Khai sinh, lời hứa đầu tiên
- 2 lần mùa đông, cách tiếp cận chạm trần
- Từ model đơn lẻ sang system có khả năng hành động như agent

-- 5 of 29 --

1980: Hệ chuyên gia (expert system)
Đặt lại vấn đề: "Nếu AI chỉ giải thật tốt một loại bài toán chuyên môn hẹp thì sao?"
→ Sự ra đời của expert systems

AI đổi chiến lược: thôi theo đuổi trí tuệ tổng quát và tập trung giải thật tốt một miền hẹp bằng cách mã hóa tri thức chuyên gia thành luật

-- 6 of 29 --

2009: Fei-Fei Li và ImageNet — cuộc cách mạng của dữ liệu
Trong khi cả ngành chạy theo thuật toán thông minh hơn, Fei-Fei Li chọn con đường khác: xây bộ dữ liệu lớn hơn — 14 triệu ảnh được gán nhãn tay, hơn 20.000 loại vật.
Ba năm sau, chính bộ dữ liệu đó là sân khấu cho cú nổ AlexNet 2012 → bài học định hình cả kỷ nguyên: đôi khi dữ liệu tốt hơn đánh bại thuật toán khôn hơn.

-- 7 of 29 --

2017: Transformer
Transformer là bước ngoặt vì nó cho mô hình hiểu ngôn ngữ theo cách linh hoạt hơn: mỗi từ có thể nhìn sang những từ quan trọng khác trong cả câu, thay vì chỉ đi tuần tự từng bước → trở thành nền móng kỹ thuật cho GPT, BERT và toàn bộ làn sóng LLM sau đó.

-- 8 of 29 --

2022: ChatGPT
ChatGPT xuất hiện như một trải nghiệm đại chúng
Lần đầu tiên rất đông người dùng phổ thông có thể trực tiếp chạm vào một mô hình ngôn ngữ mạnh, thông qua một giao diện đơn giản đến mức ai cũng hiểu cách dùng

-- 9 of 29 --

1 model nền (LLM) có thể làm nhiều việc:
- Chatbot
- Tóm tắt tài liệu
- Viết code
- Dịch và phân tích

LLM là gì? — một bộ não nền, không phải một chatbot
LLM (Large Language Model) là một mô hình ngôn ngữ rất lớn, thường dựa trên kiến trúc Transformer, được luyện trên hàng nghìn tỷ mảnh chữ để học cách đoán mảnh chữ tiếp theo trong ngữ cảnh.
Nhờ được luyện đủ rộng, nó trở thành một nền chung: thay vì mỗi việc train một model riêng, cùng một model làm được rất nhiều việc.
Chatbot chỉ là một dạng sản phẩm đóng gói quanh bộ não đó — lớp áo bên ngoài.

Model hiện nay chủ yếu là kiến trúc decoder-only (GPT, Claude, Gemini, Kimi), nhiều model dùng MoE; sau pre-training còn các bước căn chỉnh (SFT, RLHF/DPO) và luyện suy luận (reasoning training).

-- 10 of 29 --

Bên trong Transformer: đầu ra luôn là một phân bố xác suất
Với mọi ngữ cảnh, model chấm điểm MỌI từ trong từ vựng — "land" 22%, "forest" 9%… — rồi chọn theo xác suất đó

-- 11 of 29 --

Sinh văn bản = đoán → nối vào câu → đoán tiếp
Mỗi token mới được nối vào ngữ cảnh, rồi model chạy lại từ đầu — vòng lặp predict → append → rerun

-- 12 of 29 --

Token: model không đọc "từ", model đọc mảnh chữ
Model không nhìn từ nguyên vẹn. Nó cắt văn bản thành các mảnh nhỏ gọi là token: có từ là một mảnh, có từ vỡ ba bốn mảnh, cả dấu câu và khoảng trắng cũng là mảnh.

Ví dụ:
- "Hello world" ≈ 2 token
- "Xin chào" có thể tới 3-4 token
- Tiếng Việt, code, JSON tốn token hơn tiếng Anh thường

Mọi thứ model làm đều quy ra token — và mỗi token đều có giá.

-- 13 of 29 --

Context: bàn làm việc có hạn của model
Mỗi lần trả lời, model chỉ nhìn được một lượng chữ có hạn — gọi là context.
Quy đổi:
- 128K token ≈ một cuốn sách 300 trang
- 1M token ≈ 4-5 cuốn sách trên bàn cùng lúc

Bàn đầy quá thì đồ ở giữa bàn dễ bị bỏ sót — đặt điều quan trọng ở giữa một prompt rất dài, model có thể "quên" mất.

Context càng dài càng tốn tiền và càng chậm.

-- 14 of 29 --

Attention: mỗi từ được "nhìn sang" những từ quan trọng khác
Thay vì đọc tuần tự từng chữ, cơ chế attention cho phép mỗi token:
- Chủ động "quay đầu" nhìn lại các token trước đó trong câu
- Chấm điểm mức độ liên quan của từng token đối với nghĩa của mình
- Khóa nghĩa theo ngữ cảnh

Đây chính là chữ T trong GPT.

-- 15 of 29 --

3 cách dùng attention hiệu quả:

1. Đặt điều quan trọng đầu - cuối
Đầu và cuối prompt được chú ý nhiều nhất; đồ ở giữa dễ bị bỏ sót.

2. Giữ bàn làm việc sạch
Context rác = attention rác. Khi chat dài, tóm tắt lại thay vì kéo theo mọi thứ.

3. Cho tra sổ thay vì bắt nhớ
Tài liệu dài: lấy đoạn liên quan nhét vào context (RAG) thay vì trông chờ model nhớ hết.

-- 16 of 29 --

Sự phát triển của LLM:
- 2020: GPT-3 với 175 tỷ tham số, một "bác sĩ đa năng" — mọi token đều đi qua toàn bộ khớp nối (dense)
- 2026: Kimi K3 với 2.800 tỷ tham số, một "bệnh viện đa khoa" — mỗi token chỉ gọi vài chuyên gia (MoE)

compute / dữ liệu (thang log) →
test loss ↓

Luật chơi 2020-2024: cứ thêm compute + dữ liệu là model khôn lên một cách dự đoán được (scaling law)

Tham số (parameter): những "khớp nối" model học được. Sau khi luyện xong, những gì model "biết" nằm trong các con số cố định bên trong.

Nhiều tham số ≠ tốn hơn tuyến tính — nhờ MoE, bệnh viện lớn gấp 16 lần mà chi phí mỗi ca khám gần như không đổi.

-- 17 of 29 --

LLM được tạo ra như thế nào?

1. Pre-training — "đọc cả thư viện": học tiếng nói và kiến thức từ hàng nghìn tỷ token
2. SFT — "được chỉ cách trả lời": học theo ví dụ mẫu để ra dáng trợ lý
3. RLHF/DPO — "được uốn nắn": học theo phản hồi con người, an toàn và dễ chịu hơn
4. Luyện suy luận — "giải đề tự chấm" (từ 2025): luyện toán/code có đáp án kiểm chứng được → model biết làm nháp trước khi trả lời

Đọc vạn cuốn sách chưa chắc biết trả lời phỏng vấn — đó là lý do cần bước 2, 3, 4.

-- 18 of 29 --

RLHF: ba bước uốn cỗ máy đoán token thành trợ lý biết nghe lời

1. Model viết nhiều câu trả lời
2. Người chấm xếp hạng → Reward Model (máy chấm điểm thay người)
3. Huấn luyện theo điểm: tăng xác suất câu ghi điểm cao

Lặp lại hàng nghìn lần → model dần "biết nghe lời"

Cỗ máy đoán token + điểm xếp hạng của con người → trợ lý helpful, harmless, honest

-- 19 of 29 --

Ba bong bóng thời gian của LLM:

1. Bong bóng thời gian
Model bị "đóng băng" tại ngày ngừng đọc. Chuyện sau đó nó không biết.

2. Nói chắc như đúng rồi
Model tối ưu cho câu nghe hợp lý, không phải tra sự thật — nên có thể tự tin mà sai (hallucination).

3. Bàn làm việc có hạn
Context có trần; quá dài vừa tốn tiền vừa dễ bỏ sót thông tin ở giữa.

Giới hạn bẩm sinh: học giả trong bong bóng. Vì vậy ta cần prompt tốt, context sạch, tra sổ (RAG), tools, và luôn kiểm chứng.

-- 20 of 29 --

Ba "đường tắt" (spurious cues) LLM có thể học vẹt:

1. Phân loại spam: Model thực chất học "đếm số hyperlink trong email"
2. Câu chủ quan vs khách quan: Model học "có phải câu trích từ film review không"
3. Suy luận ngôn ngữ (MNLI): Model học "câu có động từ phủ định"

Vì sao model vẫn sai: nó rất giỏi học vẹt đường tắt. Benchmark cao ≠ model hiểu đúng thứ bạn tưởng.

-- 21 of 29 --

Chain-of-Thought: chỉ thêm "giấy nháp", từ sai thành đúng

Bài toán: "Có 5 quả bóng tennis. Mua thêm 2 hộp, mỗi hộp 3 quả. Hỏi tổng cộng có bao nhiêu quả?"

Không có nháp: Đáp án là 27 quả. SAI

Có giấy nháp:
"Bắt đầu có 5 quả.
Mỗi hộp 3 quả × 2 hộp = 6 quả.
5 + 6 = 11.
Đáp án là 11 quả."
ĐÚNG

Cùng một model, cùng một câu hỏi — cho nó được viết nháp từng bước, bản chất suy luận lộ ra.

-- 22 of 29 --

Từ LLM đến agent: bốn mức độ — mỗi bậc thêm một năng lực

LEVEL 0: Bộ não suy luận
LLM trần — không công cụ, không dữ liệu mới

LEVEL 1: Có kết nối
+ tools: search web, đọc database, gọi API — vượt khỏi bong bóng thời gian

LEVEL 2: Biết lập kế hoạch
+ tự chia mục tiêu thành nhiều bước, dùng nhiều tool nối tiếp, tự kiểm tra kết quả từng bước

LEVEL 3: Đội agent phối hợp
+ nhiều agent chuyên biệt chia việc như một đội ngũ (multi-agent)

Agent không phải "một loại model khác" — đó là LLM được đặt vào vòng làm việc có mục tiêu và hành động.

-- 23 of 29 --

Giải phẫu một agent: 5 bộ phận là một vòng lặp

1. Goal: mục tiêu cần đạt
2. Reasoning: bộ não LLM chia bước
3. Tools: search, API, database, code
4. Memory: sổ tay ghi nhớ các bước
5. Action: hành động ra đời thật

Agent = Goal + Reasoning + Tools + Memory + Action — chạy thành vòng lặp cho tới khi xong việc

-- 24 of 29 --

Cùng một mức năng lực, giá rơi khoảng 10 lần mỗi năm
Việc năm ngoái phải dùng model đắt nhất — năm nay model rẻ đã làm được

-- 25 of 29 --

Chọn model theo TẦNG, không chọn theo tên

VIỆC CỦA BẠN | TẦNG MODEL
- Việc đơn giản, khối lượng lớn: phân loại, trích xuất, tóm tắt ngắn
- Việc hàng ngày: viết, code, phân tích công việc, automation
- Việc khó nhất: suy luận nhiều bước, code phức tạp, tài liệu dài, độ tin cậy cao
- Việc cần kiểm soát: dữ liệu nhạy cảm, chi phí ở quy mô lớn

TẦNG 1 — FRONTIER ĐÓNG: Fable 5, GPT-5.6 Sol, Opus 4.8 (đắt nhất — chỉ trả cho việc thật sự khó)

TẦNG 2 — RẺ MÀ MẠNH: Sonnet 4.6, Terra, Gemini 3.1 Pro, Kimi K3, Haiku, Flash (giải quyết đa số việc hằng ngày, MẶC ĐỊNH THỬ TẦNG NÀY TRƯỚC)

TẦNG 3 — SELF-HOST / SIÊU RẺ: Kimi K3 open-weight, DeepSeek, Qwen (khi cần kiểm soát dữ liệu hoặc chi phí quy mô lớn)

Bắt đầu từ model đủ tốt và đủ rẻ — chỉ nâng tầng khi kết quả thực sự chặn use case.

-- 26 of 29 --

Token có giá: vé vào rẻ, vé ra đắt gấp 3-5 lần

VÉ VÀO — INPUT:
- 1 phần chữ BẠN gửi đi: prompt, system instruction, context, lịch sử chat
- rẻ — model chỉ cần đọc

VÉ RA — OUTPUT:
- 3-5 phần MODEL viết ra — nó phải tự sinh từng mảnh một, vừa chậm vừa tốn
- đắt — model phải "vắt óc"

Input tokens + Output tokens = Chi phí mỗi lần gọi — kiểm soát output là núm vặn lớn nhất.

-- 27 of 29 --

Giải phẫu một prompt: bốn lớp xếp chồng

LỚP 1: System instruction — "Lời dặn đầu ca": model là ai, cư xử thế nào, không được làm gì

LỚP 2: User input — Câu hỏi/yêu cầu của người dùng trong lượt này

LỚP 3: Context bổ sung — Tài liệu, lịch sử chat, dữ liệu tra sổ — phần bày lên "bàn làm việc"

LỚP 4: Output mong muốn — Dạng kết quả: gạch đầu dòng? bảng? JSON? dài bao nhiêu?

Viết rõ cả 4 lớp = đã làm tốt một nửa "prompt engineering".

-- 28 of 29 --

Hai núm vặn chọn từ: temperature và top_p

temperature — "núm vặn độ liều":
- T = 0: luôn chọn từ chắc nhất → ổn định, lặp lại, hợp code & phân tích
- T = 1: cân bằng tự nhiên — vẫn ưu tiên từ hợp lý
- T = 2: phân bố phẳng ra → đa dạng, "phiêu", dễ lạc đề

top_p — "chỉ xem top đầu bảng": cắt những từ xác suất thấp khỏi lựa chọn.

Mặc định an toàn: temperature = 0 cho việc cần ổn định — chỉ tăng khi thật sự cần đa dạng.

-- 29 of 29 --

Tổng kết — những ý để mang về:

1. AI là chiếc ô lớn, LLM chỉ là phần nền — nhưng là phần nền của gần hết trải nghiệm AI hôm nay.

2. LLM là cỗ máy đoán token — attention giúp nó nhìn ngữ cảnh, nhưng vẫn có "bong bóng" về thời gian và sự thật.

3. Dùng attention hiệu quả: bàn sạch, đặt quan trọng đầu-cuối, dùng RAG thay vì bắt nhớ.

4. Chọn model theo tầng — bắt đầu từ đủ tốt và đủ rẻ, chỉ nâng khi cần.

5. Từ LLM đến Agent = thêm Tools, Planning, Memory — đây là nội dung ngày tiếp theo.
`;
