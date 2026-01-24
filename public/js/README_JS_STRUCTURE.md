# Cấu trúc thư mục `js/` và chức năng các file

## Tổng quan
Thư mục `js/` chứa các file JavaScript chính cho ứng dụng Song Phương Mobile App, bao gồm quản lý sản phẩm, giỏ hàng, giao diện, bộ lọc, và các chức năng liên quan đến xây dựng PC.

## Cấu trúc và chức năng

- **app.js**
  - Quản lý trạng thái toàn cục, giỏ hàng, bộ lọc danh mục, định dạng tiền tệ, thông báo, khóa hướng màn hình, tích hợp ProductManager với dữ liệu sản phẩm.
- **bootstrap.bundle.min.js**
  - Thư viện Bootstrap cho giao diện và các thành phần UI.
- **buildpc-config.js**
  - Cấu hình cho module xây dựng PC (Build PC).
- **buildpc.js**
  - Chứa các class như OBStorage (quản lý lưu trữ cấu hình PC trong localStorage), OBUI (quản lý giao diện xây dựng PC), các thao tác thêm/xóa/sửa sản phẩm cấu hình PC.
- **categories-data.js**
  - Dữ liệu danh mục sản phẩm.
- **category-mapping-examples.js**
  - Ví dụ về ánh xạ danh mục sản phẩm.
- **category-mapping-tests.js**
  - Kiểm thử ánh xạ danh mục sản phẩm.
- **category-product-mapping.js**
  - Quản lý ánh xạ giữa danh mục và sản phẩm.
- **jquery.min.js**
  - Thư viện jQuery hỗ trợ thao tác DOM và Ajax.
- **nav-fallback.js**
  - Xử lý fallback cho điều hướng khi app.js không tải được.
- **product-details/**
  - Chứa các file chi tiết sản phẩm (details-xxx.js), mỗi file lưu thông tin chi tiết cho một nhóm sản phẩm.
- **product-details-data.js**
  - Dữ liệu chi tiết sản phẩm.
- **product-details.js**
  - Quản lý hiển thị và xử lý chi tiết sản phẩm.
- **product-filters-examples.js**
  - Ví dụ về bộ lọc sản phẩm.
- **product-hidden-attributes.js**
  - Quản lý thuộc tính ẩn của sản phẩm.
- **product-manager.js**
  - Quản lý dữ liệu sản phẩm từ CSV/JSON, tối ưu hóa tải dữ liệu, lazy load chi tiết, ánh xạ SKU, danh mục, thương hiệu, v.v.
- **products-data.js**
  - Dữ liệu sản phẩm tổng hợp.

## Ghi chú
- Các file có tiền tố `product-` liên quan đến quản lý, hiển thị, và xử lý dữ liệu sản phẩm.
- Thư mục `product-details/` chứa nhiều file chi tiết, giúp lazy load và tối ưu hiệu năng khi cần xem chi tiết sản phẩm.
- Các file `buildpc*` phục vụ chức năng xây dựng cấu hình PC, lưu trữ và giao diện.
- Các file `category*` phục vụ ánh xạ và kiểm thử danh mục sản phẩm.

---
*Đây là bản mô tả tổng quan, nếu cần chi tiết từng hàm hoặc module, vui lòng yêu cầu cụ thể hơn.*
