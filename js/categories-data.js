// Cấu trúc danh mục sản phẩm - Sắp xếp theo thứ tự sidebar
const CATEGORIES = [
    {
        name: 'PC Song Phương',
        icon: 'icon ion-monitor',
        children: [
            {
                name: 'PC Gaming',
                children: ['PC Gaming Phổ Thông', 'PC Gaming Tầm trung', 'PC Gaming Cao cấp', 'PC Gaming CPU Intel', 'PC Gaming CPU Amd']
            },
            {
                name: 'PC Văn Phòng',
                children: ['PC Office Phổ thông', 'PC Office Tầm trung', 'PC Office Cao cấp', 'PC Office CPU Intel', 'PC Office CPU Amd']
            },
            {
                name: 'PC Đồ Họa',
                children: ['PC Đồ Họa Design', 'PC Đồ Họa Render', 'PC Đồ Họa CAD', 'PC Đồ Họa CPU Intel', 'PC Đồ Họa CPU Amd']
            },
            {
                name: 'PC Gaming Theo Hãng',
                children: ['PC Gaming Asus', 'PC Gaming MSI', 'PC Gaming Gigabyte']
            },
            {
                name: 'PC Theo Giá',
                children: ['Dưới 10 Triệu', '10 - 20 Triệu', '20 - 30 Triệu', '30 - 40 Triệu', 'Trên 40 Triệu']
            },
            {
                name: 'PC Khuyến Mãi',
                children: ['PC-KM AMD', 'PC-KM ASUS', 'PC-KM MSI']
            },
            {
                name: 'Máy tính PC AI',
                children: []
            }
        ]
    },
    {
        name: 'Máy Tính Trọn Bộ',
        icon: 'icon ion-ios-box',
        children: [
            {
                name: 'Máy Bộ Theo Hãng',
                children: ['MÁY BỘ HP', 'MÁY BỘ MSI', 'MÁY BỘ ASUS', 'MÁY BỘ GIGABYTE', 'MÁY BỘ INTEL', 'MÁY BỘ DELL']
            },
            {
                name: 'Máy Bộ Theo Nhu Cầu',
                children: ['Máy Bộ Văn Phòng', 'Máy Bộ Gaming', 'Máy Bộ WS', 'Máy Bộ Mini', 'Máy Bộ AIO']
            }
        ]
    },
    {
        name: 'Laptop - Máy Tính Xách Tay',
        icon: 'icon ion-laptop',
        children: [
            {
                name: 'Laptop Theo Hãng',
                children: ['Laptop MSI', 'Laptop Asus', 'Laptop HP', 'Laptop LG Gram', 'Laptop Dell', 'Laptop Acer', 'Laptop Lenovo', 'Laptop Gigabyte', 'Laptop Adata']
            },
            {
                name: 'Laptop Theo Nhu Cầu',
                children: ['Laptop Gaming', 'Laptop Đồ họa-WS', 'Laptop Doanh nhân', 'Laptop Phổ thông', 'Laptop Mini', 'Laptop Mới nhất', 'Laptop Mỏng-Nhẹ', 'Laptop Doanh nghiệp', 'Laptop AI']
            },
            {
                name: 'Laptop Theo Giá',
                children: ['Dưới 10 triệu', '10 - 20 triệu', '20 - 30 triệu', '30 - 40 triệu', 'Trên 40 triệu']
            },
            {
                name: 'Laptop Theo LCD',
                children: ['Dưới 14 inch', '14 - 15 inch', 'Trên 15 inch', 'Màn Hình Cảm ứng']
            }
        ]
    },
    {
        name: 'Linh Kiện Máy Tính',
        icon: 'icon ion-settings',
        children: [
            {
                name: 'CPU - Bộ vi xử lý',
                children: ['CPU AMD', 'CPU INTEL']
            },
            {
                name: 'Main - Bo Mạch Chủ',
                children: ['Main Intel', 'Main Amd', 'Main MSI', 'Main Asus', 'Main Gigabyte', 'Main Colorful']
            },
            {
                name: 'VGA - Card Màn Hình',
                children: ['Vga Nvidia', 'Vga Amd', 'Vga Msi', 'Vga Asus', 'Vga Gigabyte', 'Vga Sapphire', 'VGA Leadtek', 'Vga Colorful', 'Vga Quadro', 'Vga Radeon Pro', 'Vga PowerColor', 'Vga Inno3D']
            },
            {
                name: 'Ram - Bộ nhớ đệm',
                children: ['Ram Type', 'Ram Gskill', 'Ram Kingston', 'Ram Apacer', 'Ram Corsair', 'Ram Crucial', 'Ram Adata', 'Ram Kingmax', 'Ram Gigabyte', 'Ram Klevv', 'Ram Thermaltake', 'Ram Colorful', 'Ram TeamGroup', 'Ram GEIL', 'Ram Lexar', 'Ram Patriot']
            },
            {
                name: 'SSD - HDD',
                children: ['SSD Kingston', 'SSD Samsung', 'SSD Western Digital', 'SSD Corsair', 'SSD Apacer', 'SSD HP', 'SSD Adata', 'SSD Crucial', 'SSD KingMax', 'SSD Klevv', 'SSD Gigabyte', 'SSD Colorful', 'SSD MSI', 'SSD Lexar', 'SSD TeamGroup', 'SSD Patriot', 'HDD Western Digital', 'HDD Seagate']
            },
            {
                name: 'PSU - Nguồn máy tính',
                children: ['Nguồn Corsair', 'Nguồn Cooler Master', 'Nguồn FSP', 'Nguồn Antec', 'Nguồn Cougar', 'Nguồn Asus', 'Nguồn Aerocool', 'Nguồn Gigabyte', 'Nguồn Segotep', 'Nguồn MSI', 'Nguồn Thermaltake', 'Nguồn NZXT', 'Nguồn Xigmatek', 'Nguồn MIK', 'Nguồn DeepCool', 'Nguồn Acer', 'Nguồn Ocypus']
            },
            {
                name: 'Case - Vỏ máy tính',
                children: ['Case Xigmatek', 'Case Corsair', 'Case Cooler Master', 'Case MSI', 'Case Cougar', 'Case Antec', 'Case Asus', 'Case Aerocool', 'Case NZXT', 'Case Gigabyte', 'Case Thermaltake', 'Case Phanteks', 'Case Metallic Gear', 'Case Segotep', 'Case Iqunix', 'Case MIK', 'Case DeepCool', 'Case HYTE', 'Case Ocypus']
            }
        ]
    },
    {
        name: 'Tản Nhiệt - Cooling',
        icon: 'icon ion-ios-snowy',
        children: [
            {
                name: 'Tản Nhiệt Theo Hãng',
                children: ['Tản nhiệt Ocypus', 'Tản nhiệt DeepCool', 'Tản nhiệt Segotep', 'Tản nhiệt Asus', 'Tản nhiệt MSI', 'Tản nhiệt Xigmatek', 'Tản nhiệt NZXT', 'Tản nhiệt Antec', 'Tản nhiệt Corsair', 'Tản nhiệt Cooler Master', 'Tản nhiệt Noctua', 'Tản nhiệt Gigabyte', 'Tản nhiệt ID Cooling', 'Tản nhiệt Thermaltake', 'Tản nhiệt Khác']
            },
            {
                name: 'Tản Nhiệt Khí CPU',
                children: ['Tản Khí Các Hãng', 'Tản Khí Dưới 1 triệu', 'Tản Khí 1 - 2 triệu', 'Tản Khí Trên 2 triệu']
            },
            {
                name: 'Tản Nhiệt Nước CPU',
                children: ['Tản AIO Các Hãng', 'Tản AIO Dưới 2 triệu', 'Tản AIO 2 - 3 triệu', 'Tản AIO Trên 3 triệu']
            },
            {
                name: 'Fan Thùng Case',
                children: ['Fan LED Các Hãng', 'Fan LED Bộ', 'Fan LED Rời', 'Fan Loại khác']
            },
            {
                name: 'Phụ Kiện Tản Nhiệt',
                children: []
            }
        ]
    },
    {
        name: 'Màn Hình Máy Tính',
        icon: 'icon ion-android-desktop',
        children: [
            {
                name: 'Màn Hình Theo Hãng',
                children: ['Màn hình Samsung', 'Màn hình HP', 'Màn hình LG', 'Màn hình Asus', 'Màn hình Viewsonic', 'Màn hình MSI', 'Màn hình Dell', 'Màn hình Gigabyte', 'Màn Hình BENQ', 'Màn hình AOC', 'Màn hình Lenovo', 'Màn hình AIWA', 'Màn hình KTC', 'Màn hình Acer']
            },
            {
                name: 'Màn Hình Theo Nhu Cầu',
                children: ['Màn hình Gaming', 'Màn hình Game-Net', 'Màn hình Phổ thông', 'Màn hình Cong', 'Màn hình Đồ họa', 'Màn hình Cảm ứng']
            },
            {
                name: 'Màn Hình - Kích Thước',
                children: ['Dưới 20 inch', '21.5 - 25 inch', '27 - 29 inch', '31.5 - 49 inch']
            },
            {
                name: 'Màn Hình - Độ Phân Giải',
                children: ['Màn hình HD/HD+', 'Màn hình FHD/FHD+', 'Màn hình 2K QHD', 'Màn hình 4K UHD', 'Màn hình 5K']
            },
            {
                name: 'Màn Hình Theo Giá',
                children: ['Dưới 3 triệu', '3 - 5 triệu', '5 - 7 triệu', '7 - 9 triệu', '9 - 15 triệu', 'Trên 15 triệu']
            }
        ]
    },
    {
        name: 'Phụ Kiện PC-Laptop-Mobile',
        icon: 'icon ion-usb',
        children: []
    },
    {
        name: 'Gaming Gear-Phím-Chuột',
        icon: 'icon ion-mouse',
        children: [
            {
                name: 'Keyboard - Bàn Phím',
                children: ['Fuhlen', 'Gamdias', 'Dareu', 'Razer', 'SteelSeries', 'Corsair', 'MSI', 'Asus', 'Logitech', 'Akko', 'Thermaltake', 'Kingston', 'Iqunix', 'Microsoft', 'Rapoo', 'Xiberia', 'Darmoshark', 'MIKIT', 'Machenike']
            },
            {
                name: 'Phím Theo Nhu Cầu',
                children: ['Bàn Phím Gaming', 'Phím Game-Net', 'Phím Phổ thông', 'Bàn Phím Không dây', 'Combo Phím/Chuột']
            },
            {
                name: 'Mouse - Chuột',
                children: ['Fuhlen', 'Gamdias', 'Dareu', 'Logitech', 'Razer', 'SteelSeries', 'Corsair', 'MSI', 'Zowie', 'Cougar', 'Asus', 'Gigabyte', 'Thermaltake', 'Kingston', 'Microsoft', 'Rapoo', 'Xiberia', 'Darmoshark', 'Machenike']
            },
            {
                name: 'Chuột Theo Nhu Cầu',
                children: ['Chuột Gaming', 'Chuột Game-Net', 'Chuột Phổ thông', 'Chuột Không Dây']
            },
            {
                name: 'Headphone - Tai Nghe',
                children: ['Razer', 'SteelSeries', 'Logitech', 'Corsair', 'Cooler Master', 'Fuhlen', 'MSI', 'Dareu', 'Asus', 'Eaglend', 'Xiberia', 'Thermaltake', 'Kingston', 'Rapoo']
            },
            {
                name: 'Tai Nghe Theo Nhu Cầu',
                children: ['Tai nghe Cao cấp', 'Tai nghe Game-Net', 'Tai nghe Phổ thông', 'Tai Nghe Không dây']
            },
            {
                name: 'Bàn-Ghế Gaming',
                children: ['ACE', 'Hồng Quân', 'Speed', 'MSI', 'Noblechairs', 'Aerocool', 'Gigabyte', 'Warrior', 'Cooler Master', 'Corsair', 'Asus', 'Thermaltake', 'Razer', 'Cougar', 'Bàn Gaming']
            },
            {
                name: 'Bàn/Ghế Theo Nhu Cầu',
                children: ['Ghế Gaming Cao cấp', 'Ghế Gaming Phổ thông', 'Bàn/Ghế Game-Net']
            },
            {
                name: 'Máy Chơi Game',
                children: ['Sony PlayStation']
            }
        ]
    },
    {
        name: 'Thiết Bị Văn Phòng',
        icon: 'icon ion-printer',
        children: []
    },
    {
        name: 'Camera An Ninh',
        icon: 'icon ion-videocamera',
        children: [
            {
                name: 'Camera Phân Loại',
                children: ['Camera IP', 'Camera WIFI', 'Camera Hành trình', 'Camera Speed Dome', 'Camera Analog']
            },
            {
                name: 'Camera Theo Hãng',
                children: ['Camera Dahua', 'Camera Ezviz', 'Camera Hikvision', 'Camera Imou', 'Camera TP-Link']
            },
            {
                name: 'Camera Theo Nhu Cầu',
                children: ['Camera Nhà ở', 'Camera Cửa hàng/Shop']
            },
            {
                name: 'Camera Trọn Bộ',
                children: ['Trọn Bộ 2 Kênh', 'Trọn Bộ 4 Kênh', 'Trọn Bộ 6 Kênh', 'Trọn Bộ 8 Kênh', 'Trọn Bộ 16 Kênh', 'Trọn Bộ 32 Kênh']
            },
            {
                name: 'Đầu Thu Camera',
                children: ['Đầu Thu Dahua', 'Đầu Thu Hikvision', 'Đầu Thu TP-Link']
            },
            {
                name: 'Phụ Kiện Camera',
                children: ['Jack/PK Khác', 'Adaptor/Nguồn']
            },
            {
                name: 'Thiết Bị An Ninh',
                children: ['Báo Trộm Độc lập', 'Bộ Báo Trộm']
            }
        ]
    },
    {
        name: 'Thiết Bị Âm Thanh',
        icon: 'icon ion-speakerphone',
        children: []
    },
    {
        name: 'Thiết Bị Mạng Lan-Wifi',
        icon: 'icon ion-wifi',
        children: []
    },
    {
        name: 'Dịch Vụ PC-Laptop',
        icon: 'icon ion-wrench',
        children: [
            { name: 'Dịch vụ Máy tính PC', children: [] },
            { name: 'Dịch vụ Laptop', children: [] },
            { name: 'Dịch vụ Camera', children: [] },
            { name: 'Dịch vụ Phòng Game', children: [] },
            { name: 'Dịch vụ Mạng Lan-Wifi', children: [] },
            { name: 'Dịch vụ Máy In', children: [] }
        ]
    },
    {
        name: 'Thiết Bị Phòng Game',
        icon: 'icon ion-game-controller-b',
        children: []
    },
    {
        name: 'Phần Mềm Bản Quyền',
        icon: 'icon ion-social-windows',
        children: []
    }
];

// Utility function để lấy tất cả danh mục dạng flat
function getAllCategories() {
    const flatCategories = [];
    
    CATEGORIES.forEach(parent => {
        // Thêm danh mục cha
        flatCategories.push({
            name: parent.name,
            level: 0,
            path: parent.name,
            icon: parent.icon
        });
        
        // Thêm danh mục con cấp 1
        if (parent.children && parent.children.length > 0) {
            parent.children.forEach(child => {
                if (typeof child === 'string') {
                    flatCategories.push({
                        name: child,
                        level: 1,
                        path: `${parent.name} > ${child}`,
                        parent: parent.name
                    });
                } else {
                    flatCategories.push({
                        name: child.name,
                        level: 1,
                        path: `${parent.name} > ${child.name}`,
                        parent: parent.name
                    });
                    
                    // Thêm danh mục con cấp 2
                    if (child.children && child.children.length > 0) {
                        child.children.forEach(subchild => {
                            flatCategories.push({
                                name: subchild,
                                level: 2,
                                path: `${parent.name} > ${child.name} > ${subchild}`,
                                parent: child.name
                            });
                        });
                    }
                }
            });
        }
    });
    
    return flatCategories;
}

// Export cho browser
window.CATEGORIES = CATEGORIES;
window.getAllCategories = getAllCategories;

// Export cho Node.js module (nếu cần)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CATEGORIES, getAllCategories };
}
