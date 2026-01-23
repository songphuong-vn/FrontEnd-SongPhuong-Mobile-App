# Hướng dẫn Deploy lên Vercel

Dự án này đã được tối ưu hóa để triển khai trên Vercel.

## Các bước triển khai

1.  **Cài đặt Vercel CLI (nếu chưa có)**:
    ```bash
    npm i -g vercel
    ```

2.  **Đăng nhập vào Vercel**:
    ```bash
    vercel login
    ```

3.  **Deploy**:
    Chạy lệnh sau tại thư mục gốc của dự án:
    ```bash
    vercel
    ```
    - Làm theo hướng dẫn trên màn hình.
    - Chọn cài đặt mặc định (Vercel sẽ tự động phát hiện đây là dự án tĩnh).

4.  **Deploy Production**:
    Khi đã sẵn sàng deploy bản chính thức:
    ```bash
    vercel --prod
    ```

## Cấu hình đã tối ưu

-   **vercel.json**: Đã được cấu hình để:
    -   Cache các file tĩnh (ảnh, css, js) trong 1 năm để tăng tốc độ tải.
    -   Không cache file HTML để đảm bảo người dùng luôn thấy nội dung mới nhất khi cập nhật.
    -   URL sạch (clean URLs): `example.com/about` thay vì `example.com/about.html`.
-   **robots.txt & sitemap.xml**: Đã được thêm vào để hỗ trợ SEO.
-   **package.json**: Đã cập nhật script build để tương thích với quy trình CI/CD của Vercel.

## Lưu ý

-   Nếu bạn cập nhật nội dung, hãy chạy lại lệnh `vercel --prod` để cập nhật phiên bản trên cloud.
-   File `sitemap.xml` cần được cập nhật thủ công nếu bạn thêm trang mới quan trọng.
