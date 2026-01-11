/**
 * Script kiểm tra đồng bộ giữa database categories và mapping
 */
const fs = require('fs');
const path = require('path');

// Đọc database
const dbPath = path.join(__dirname, '..', 'database-product', 'products-lite.json');
const products = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Lấy tất cả category unique từ database
const dbCategories = [...new Set(products.map(p => p.c).filter(c => c))].sort();

// Mapping đã định nghĩa
const PRODUCT_CATEGORY_MAPPING = {
    "PC Gaming": "PC Song Phương > PC Gaming",
    "PC Văn Phòng": "PC Song Phương > PC Văn Phòng",
    "PC Khuyến Mãi": "PC Song Phương > PC Khuyến Mãi",
    "Máy tính PC AI": "PC Song Phương > Máy tính PC AI",
    "Máy Bộ Theo Hãng": "Máy Tính Trọn Bộ > Máy Bộ Theo Hãng",
    "Máy Bộ Theo Nhu Cầu": "Máy Tính Trọn Bộ > Máy Bộ Theo Nhu Cầu",
    "MÁY BỘ iGAME": "Máy Tính Trọn Bộ > Máy Bộ Theo Hãng",
    "Laptop Theo Hãng": "Laptop - Máy Tính Xách Tay > Laptop Theo Hãng",
    "Laptop Theo Nhu Cầu": "Laptop - Máy Tính Xách Tay > Laptop Theo Nhu Cầu",
    "Laptop Theo Giá": "Laptop - Máy Tính Xách Tay > Laptop Theo Giá",
    "Laptop Intel": "Laptop - Máy Tính Xách Tay > Laptop Theo Hãng",
    "CPU - Bộ vi xử lý": "Linh Kiện Máy Tính > CPU - Bộ vi xử lý",
    "Main - Bo Mạch Chủ": "Linh Kiện Máy Tính > Main - Bo Mạch Chủ",
    "VGA - Card Màn Hình": "Linh Kiện Máy Tính > VGA - Card Màn Hình",
    "Vga Intel": "Linh Kiện Máy Tính > VGA - Card Màn Hình",
    "Ram - Bộ nhớ đệm": "Linh Kiện Máy Tính > Ram - Bộ nhớ đệm",
    "SSD - HDD": "Linh Kiện Máy Tính > SSD - HDD",
    "PSU - Nguồn máy tính": "Linh Kiện Máy Tính > PSU - Nguồn máy tính",
    "Case - Vỏ máy tính": "Linh Kiện Máy Tính > Case - Vỏ máy tính",
    "Tản Nhiệt Theo Hãng": "Tản Nhiệt - Cooling > Tản Nhiệt Theo Hãng",
    "Tản Nhiệt Khí CPU": "Tản Nhiệt - Cooling > Tản Nhiệt Khí CPU",
    "Tản Nhiệt Nước CPU": "Tản Nhiệt - Cooling > Tản Nhiệt Nước CPU",
    "Fan Thùng Case": "Tản Nhiệt - Cooling > Fan Thùng Case",
    "Phụ Kiện Tản Nhiệt": "Tản Nhiệt - Cooling > Phụ Kiện Tản Nhiệt",
    "Tản nhiệt Cougar": "Tản Nhiệt - Cooling > Tản Nhiệt Theo Hãng",
    "Màn Hình Theo Hãng": "Màn Hình Máy Tính > Màn Hình Theo Hãng",
    "Màn Hình Theo Nhu Cầu": "Màn Hình Máy Tính > Màn Hình Theo Nhu Cầu",
    "Màn hình HKC": "Màn Hình Máy Tính > Màn Hình Theo Hãng",
    "Tivi - Màn hình TV": "Màn Hình Máy Tính > Màn Hình Theo Nhu Cầu",
    "Keyboard - Bàn Phím": "Gaming Gear-Phím-Chuột > Keyboard - Bàn Phím",
    "Phím Theo Nhu Cầu": "Gaming Gear-Phím-Chuột > Phím Theo Nhu Cầu",
    "Mouse - Chuột": "Gaming Gear-Phím-Chuột > Mouse - Chuột",
    "Chuột Theo Nhu Cầu": "Gaming Gear-Phím-Chuột > Chuột Theo Nhu Cầu",
    "Headphone - Tai Nghe": "Gaming Gear-Phím-Chuột > Headphone - Tai Nghe",
    "Tai Nghe Theo Nhu Cầu": "Gaming Gear-Phím-Chuột > Tai Nghe Theo Nhu Cầu",
    "Tai Nghe - Phone": "Gaming Gear-Phím-Chuột > Headphone - Tai Nghe",
    "Bàn-Ghế Gaming": "Gaming Gear-Phím-Chuột > Bàn-Ghế Gaming",
    "Máy Chơi Game": "Gaming Gear-Phím-Chuột > Máy Chơi Game",
    "Loa Nghe Nhạc": "Thiết Bị Âm Thanh > Loa Nghe Nhạc",
    "Âm Thanh Các Hãng": "Thiết Bị Âm Thanh > Loa Nghe Nhạc",
    "Camera Phân Loại": "Camera An Ninh > Camera Phân Loại",
    "Camera Theo Hãng": "Camera An Ninh > Camera Theo Hãng",
    "Camera Theo Nhu Cầu": "Camera An Ninh > Camera Theo Nhu Cầu",
    "Đầu Thu Camera": "Camera An Ninh > Đầu Thu Camera",
    "TB Mạng Theo Hãng": "Thiết Bị Mạng Lan-Wifi > TB Mạng Theo Hãng",
    "TB Mạng Khác": "Thiết Bị Mạng Lan-Wifi > TB Mạng Khác",
    "TB Phát Sóng Wifi": "Thiết Bị Mạng Lan-Wifi > TB Phát Sóng Wifi",
    "Máy In - Photo": "Thiết Bị Văn Phòng > Máy In - Photo",
    "Máy In Theo Nhu Cầu": "Thiết Bị Văn Phòng > Máy In - Photo",
    "Máy VP Khác": "Thiết Bị Văn Phòng > Máy In - Photo",
    "Phụ kiện Laptop": "Phụ Kiện PC-Laptop-Mobile > Phụ kiện Laptop",
    "Phụ kiện Điện thoại": "Phụ Kiện PC-Laptop-Mobile > Phụ kiện Điện thoại",
    "Phụ kiện Máy tính PC": "Phụ Kiện PC-Laptop-Mobile > Phụ kiện Máy tính PC",
    "Phụ Kiện Khác": "Phụ Kiện PC-Laptop-Mobile > Phụ Kiện Khác",
    "Balo": "Phụ Kiện PC-Laptop-Mobile > Phụ kiện Laptop",
    "Dịch vụ Máy tính PC": "Dịch Vụ PC-Laptop > Dịch vụ Máy tính PC",
    "Dịch vụ Laptop": "Dịch Vụ PC-Laptop > Dịch vụ Laptop",
    "Dịch vụ Camera": "Dịch Vụ PC-Laptop > Dịch vụ Camera",
    "Dịch vụ Phòng Game": "Dịch Vụ PC-Laptop > Dịch vụ Phòng Game",
    "Dịch vụ Mạng Lan-Wifi": "Dịch Vụ PC-Laptop > Dịch vụ Mạng Lan-Wifi",
    "Dịch vụ Máy In": "Dịch Vụ PC-Laptop > Dịch vụ Máy In",
    "Giá Dịch vụ": "Dịch Vụ PC-Laptop > Dịch vụ Máy tính PC",
    "Linh Kiện Phòng Game": "Thiết Bị Phòng Game > Linh Kiện Phòng Game",
    "Server Game Net": "Thiết Bị Phòng Game > Server Game Net",
    "Apple": "Laptop - Máy Tính Xách Tay > Laptop Theo Hãng",
    "Ajazz": "Gaming Gear-Phím-Chuột > Keyboard - Bàn Phím",
    "Evoxz": "Gaming Gear-Phím-Chuột > Keyboard - Bàn Phím",
    "Philips": "Màn Hình Máy Tính > Màn Hình Theo Hãng",
    "Sản phẩm mới": "Sản phẩm mới",
    "Thiết Bị Khác": "Thiết Bị Khác",
    "Khác": "Khác"
};

console.log('=== DATABASE CATEGORIES CHECK ===');
console.log('Total unique categories in DB:', dbCategories.length);
console.log('Total mapped categories:', Object.keys(PRODUCT_CATEGORY_MAPPING).length);

// Kiểm tra category nào chưa được map
const unmapped = dbCategories.filter(c => !PRODUCT_CATEGORY_MAPPING[c]);
if (unmapped.length > 0) {
    console.log('\n❌ UNMAPPED CATEGORIES:', unmapped.length);
    unmapped.forEach(c => console.log('  -', c));
} else {
    console.log('\n✅ ALL CATEGORIES ARE MAPPED!');
}

// Thống kê sản phẩm theo DB category
console.log('\n=== TOP 20 CATEGORIES BY PRODUCT COUNT ===');
const counts = {};
products.forEach(p => {
    counts[p.c] = (counts[p.c] || 0) + 1;
});
Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 20).forEach(([cat, count]) => {
    const mapped = PRODUCT_CATEGORY_MAPPING[cat] ? '✓' : '✗';
    console.log(`${mapped} ${count.toString().padStart(4)} - ${cat}`);
});

// Thống kê theo parent category
console.log('\n=== PRODUCT COUNT BY PARENT CATEGORY ===');
const parentCounts = {};
products.forEach(p => {
    const mapping = PRODUCT_CATEGORY_MAPPING[p.c];
    if (mapping) {
        const parent = mapping.split(' > ')[0];
        parentCounts[parent] = (parentCounts[parent] || 0) + 1;
    } else {
        parentCounts['(UNMAPPED)'] = (parentCounts['(UNMAPPED)'] || 0) + 1;
    }
});
Object.entries(parentCounts).sort((a,b) => b[1] - a[1]).forEach(([parent, count]) => {
    console.log(`${count.toString().padStart(5)} - ${parent}`);
});
