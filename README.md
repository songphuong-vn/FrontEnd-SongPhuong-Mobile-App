# � ĐỒ ÁN MÔN HỌC: ỨNG DỤNG QUẢN LÝ & KINH DOANH THIẾT BỊ CÔNG NGHỆ (SONG PHƯƠNG MOBILE)

## 1. TỔNG QUAN & TÍNH CẤP THIẾT
Trong kỷ nguyên số, việc mua sắm thiết bị công nghệ qua nền tảng di động đã trở thành nhu cầu thiết yếu. Đặc biệt đối với lĩnh vực phần cứng máy tính (PC), khách hàng không chỉ cần xem giá mà còn cần hỗ trợ kỹ thuật về tính tương thích khi xây dựng cấu hình (Build PC).

Đồ án **Song Phương Mobile App** được xây dựng nhằm giải quyết bài toán khó khăn của người dùng khi chọn mua linh kiện máy tính trên điện thoại: *Làm sao để xem hàng ngàn sản phẩm, kiểm tra tương thích và tự xây dựng cấu hình máy tính một cách trực quan, nhanh chóng nhất?*

## 2. MỤC TIÊU & Ý NGHĨA ĐỀ TÀI

### 🎯 Mục tiêu
- **Xây dựng hệ thống thương mại điện tử trên di động** với trải nghiệm người dùng tối ưu (Mobile-First).
- **Giải quyết bài toán dữ liệu lớn ở phía Client:** Xử lý hiển thị mượt mà cho hơn **10.000 mã sản phẩm** mà không cần backend phức tạp trong giai đoạn prototype.
- **Tự động hóa tư vấn kỹ thuật:** Tích hợp công cụ **Build PC** thông minh, giúp người không chuyên cũng có thể tự chọn cấu hình máy tính.

### 💡 Ý nghĩa
- **Về mặt học thuật:** Áp dụng kiến thức về lập trình thiết bị di động, tối ưu hóa hiệu năng JavaScript và thiết kế UI/UX hiện đại.
- **Về mặt thực tiễn:** Mang lại công cụ bán hàng hiệu quả, giúp khách hàng tiết kiệm thời gian tra cứu và tư vấn thông tin sản phẩm công nghệ.

## 3. CÔNG NGHỆ & NGÔN NGỮ SỬ DỤNG

Ứng dụng được phát triển theo hướng **Hybrid App**, kết hợp sức mạnh của công nghệ Web để chạy mượt mà trên môi trường di động:

### 💻 Ngôn ngữ lập trình cốt lõi
- **HTML5 / CSS3:** Xây dựng cấu trúc và giao diện người dùng responsive, tương thích đa nền tảng.
- **JavaScript (ES6+):** Ngôn ngữ chủ đạo xử lý toàn bộ logic nghiệp vụ, quản lý trạng thái và tương tác dữ liệu.

### 🛠️ Framework & Thư viện
- **Ionic Framework:** Nền tảng chính tạo giao diện chuẩn Mobile (Native-like UI), tối ưu thao tác chạm vuốt.
- **Bootstrap 5:** Hệ thống Grid System linh hoạt và các thành phần UI cơ bản.
- **jQuery:** Hỗ trợ thao tác DOM và xử lý sự kiện nhanh chóng.

### 🗄️ Dữ liệu & Kiến trúc
- **Client-side Data Handling:** Mô phỏng cơ sở dữ liệu NoSQL ngay trên trình duyệt bằng JSON và CSV.
- **Data Chunking & Lazy Loading:** Kỹ thuật chia nhỏ dữ liệu JS để tải mượt mà danh sách **9,926 sản phẩm** mà không gây treo ứng dụng.

## 4. PHÂN TÍCH CHỨC NĂNG CHÍNH

### 🛠️ Hệ thống Build PC (Xây dựng cấu hình)
Đây là chức năng trọng tâm và phức tạp nhất của đồ án:
- **Cơ chế:** Cho phép người dùng chọn lần lượt các linh kiện (CPU, Main, RAM, VGA...) theo quy trình chuẩn.
- **Thông minh:** Tự động tính toán tổng chi phí ước tính theo thời gian thực.
- **Giao diện:** Sử dụng Modal Picker trực quan, dễ dàng thay đổi lựa chọn.

### 📂 Hệ thống Phân loại & Danh mục Đa tầng
- **Cấu trúc:** Quản lý danh mục sản phẩm theo cây phân cấp 3 lớp (Ví dụ: Linh kiện > CPU > Intel Core i9).
- **Tự động hóa:** Hệ thống tự động ánh xạ (Mapping) dữ liệu thô từ CSV vào đúng nhóm danh mục tương ứng.

### 🔍 Tìm kiếm & Lọc nâng cao
- Hỗ trợ tìm kiếm thời gian thực (Real-time search) ngay khi gõ phím.
- Bộ lọc đa chiều: Theo giá, thương hiệu, danh mục và thông số kỹ thuật.

### 🎨 Trải nghiệm Người dùng (UX/UI)
- **Masonry Layout:** Hiển thị danh sách sản phẩm dạng lưới so le 2 cột hiện đại.
- **Infinite Scroll:** Cuộn vô tận - giải pháp tối ưu cho danh sách sản phẩm dài.
- **Sticky Navigation:** Thanh điều hướng thông minh bám theo thao tác người dùng.

## 5. KẾT QUẢ THỰC HIỆN

Sau quá trình nghiên cứu và phát triển, nhóm đã đạt được các kết quả cụ thể:

- ✅ **Về Hiệu năng:** Ứng dụng tải và hoạt động ổn định với tập dữ liệu lớn gần 10.000 sản phẩm. Thời gian phản hồi thao tác dưới 100ms.
- ✅ **Về Giao diện:** Hoàn thiện 100% các màn hình chức năng chính: *Trang chủ, Danh mục, Chi tiết sản phẩm, Build PC, Giỏ hàng, Hồ sơ cá nhân*. Giao diện hiện đại, đồng bộ màu sắc thương hiệu.
- ✅ **Về Chức năng:**
    - Hệ thống **Build PC** hoạt động chính xác.
    - Chức năng thêm vào giỏ hàng và tính tổng tiền hoạt động tốt.
    - Hệ thống phân loại danh mục tự động xử lý chính xác dữ liệu đầu vào.
- ✅ **Về Khả năng mở rộng:** Cấu trúc mã nguồn được module hóa rõ ràng (tách biệt logic và view), sẵn sàng cho việc tích hợp API Backend thực tế.

---

## 👥 THÔNG TIN NHÓM THỰC HIỆN

- **Trường:** Đại học Đà Lạt (Dalat University)
- **Môn học:** Lập trình thiết bị di động
- **Nhóm:** 11

**© 2026 Song Phương - Project Mobile App**
