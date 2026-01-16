# 📋 Kế Hoạch Clean Code - Thư Mục JS

**Ngày tạo:** 2026-01-14  
**Mục tiêu:** Chuẩn hóa, tối ưu và làm sạch code trong thư mục `js/` để dễ bảo trì, mở rộng và giảm lỗi.

---

## 📊 1. TỔNG QUAN CẤU TRÚC HIỆN TẠI

### 1.1 Danh Sách File Theo Kích Thước

| File | Kích thước | Loại | Ưu tiên |
|------|-----------|------|---------|
| `products-data.js` | **15.1 MB** | Data | 🔴 CRITICAL |
| `buildpc.js` | **192 KB** | Logic | 🔴 HIGH |
| `app.js` | **95 KB** | Core | 🔴 HIGH |
| `product-details.js` | **41 KB** | Logic | 🟡 MEDIUM |
| `product-manager.js` | **19 KB** | Manager | 🟡 MEDIUM |
| `category-mapping-tests.js` | **17 KB** | Test | 🟢 LOW |
| `product-hidden-attributes.js` | **16 KB** | Config | 🟢 LOW |
| `product-filters-examples.js` | **15 KB** | Example | 🟢 LOW |
| `categories-data.js` | **15 KB** | Data | 🟡 MEDIUM |
| `category-product-mapping.js` | **13.5 KB** | Config | 🟢 LOW |
| `category-mapping-examples.js` | **13 KB** | Example | 🟢 LOW |
| `nav-fallback.js` | **4 KB** | Fallback | 🟢 LOW |
| `buildpc-config.js` | **2.7 KB** | Config | 🟢 LOW |
| `product-details-data.js` | **2.6 KB** | Data | 🟢 LOW |
| **Thư mục `product-details/`** | 149 files | Data chunks | 🟡 MEDIUM |

### 1.2 Phân Loại Theo Chức Năng

```
js/
├── 🎯 CORE APPLICATION
│   ├── app.js (95KB) - Main application logic
│   └── nav-fallback.js (4KB) - Navigation fallback
│
├── 🛒 PRODUCT MANAGEMENT
│   ├── product-manager.js (19KB) - Product manager class
│   ├── products-data.js (15.1MB) - Product database
│   ├── product-details.js (41KB) - Product detail page logic
│   ├── product-details-data.js (2.6KB) - Detail page config
│   └── product-details/ (149 files) - Product detail chunks
│
├── 🏗️ BUILD PC SYSTEM
│   ├── buildpc.js (192KB) - Build PC logic
│   └── buildpc-config.js (2.7KB) - Build PC configuration
│
├── 📂 CATEGORY SYSTEM
│   ├── categories-data.js (15KB) - Category definitions
│   ├── category-product-mapping.js (13.5KB) - Category mappings
│   ├── category-mapping-examples.js (13KB) - Examples
│   └── category-mapping-tests.js (17KB) - Tests
│
├── 🔧 UTILITIES & CONFIG
│   ├── product-filters-examples.js (15KB)
│   └── product-hidden-attributes.js (16KB)
│
└── 📚 THIRD-PARTY LIBRARIES
    ├── jquery.min.js (90KB)
    └── bootstrap.bundle.min.js (83KB)
```

---

## 🔍 2. ĐÁNH GIÁ CHẤT LƯỢNG CODE

### 2.1 File `app.js` (95KB) - CRITICAL

**Vấn đề phát hiện:**
- ❌ **File quá lớn** (95KB, ~2700 dòng)
- ❌ **Nhiều chức năng khác nhau** trong 1 file
- ❌ **Code lặp lại** (duplicate functions detected)
- ❌ **Thiếu module hóa** (tất cả trong global scope)
- ❌ **Comment không đầy đủ** cho các phần phức tạp
- ⚠️ **Naming convention** không nhất quán (camelCase vs snake_case)

**Các phần chính trong app.js:**
1. Global state & helpers (dòng 1-100)
2. Product search & rendering (dòng 100-800)
3. Infinite scroll (dòng 800-1000)
4. Sidebar & navigation (dòng 1000-1200)
5. Category filtering (dòng 1200-1400)
6. Banner slider (dòng 1400-1600)
7. User profile functions (dòng 1600-2000)
8. Notifications (dòng 2000-2200)
9. Settings & modals (dòng 2200-2400)
10. Footer & warranty (dòng 2400-2700)

### 2.2 File `buildpc.js` (192KB) - CRITICAL

**Vấn đề:**
- ❌ **File CỰC LỚN** (192KB)
- ❌ **Chứa cả logic + data**
- ❌ **Khó maintain và debug**
- ⚠️ **Cần tách thành nhiều module**

### 2.3 File `products-data.js` (15.1MB) - CRITICAL

**Vấn đề:**
- ❌ **File KHỔNG LỒ** (15.1MB)
- ❌ **Làm chậm load time**
- ❌ **Không nên load toàn bộ vào memory**
- 💡 **Giải pháp:** Lazy loading, pagination, hoặc chuyển sang database

### 2.4 Thư Mục `product-details/` (149 files)

**Đánh giá:**
- ✅ **Tốt:** Đã tách nhỏ data
- ⚠️ **Cần:** Naming convention nhất quán
- ⚠️ **Cần:** Index file để quản lý

---

## 📝 3. CHUẨN HÓA CODING STANDARDS

### 3.1 Naming Conventions

```javascript
// ✅ ĐÚNG - Áp dụng cho toàn bộ dự án

// Variables & Functions: camelCase
let productList = [];
function getProductById(id) { }

// Classes & Constructors: PascalCase
class ProductManager { }

// Constants: UPPER_SNAKE_CASE
const MAX_PRODUCTS = 100;
const API_BASE_URL = 'https://api.example.com';

// Private methods: _prefixUnderscore
function _internalHelper() { }

// File names: kebab-case
// product-manager.js
// category-filter.js
```

### 3.2 Code Structure Standards

```javascript
// ✅ CHUẨN - Cấu trúc file module

/**
 * Module: Product Manager
 * Description: Manages product data and operations
 * @author Team Name
 * @version 1.0.0
 */

// ===========================
// IMPORTS
// ===========================
// (if using modules)

// ===========================
// CONSTANTS
// ===========================
const DEFAULT_PAGE_SIZE = 20;

// ===========================
// STATE
// ===========================
let currentProducts = [];

// ===========================
// HELPER FUNCTIONS
// ===========================
function _formatPrice(price) {
    // Implementation
}

// ===========================
// PUBLIC API
// ===========================
function getProducts() {
    // Implementation
}

// ===========================
// INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', init);

// ===========================
// EXPORTS
// ===========================
// (if using modules)
```

### 3.3 JSDoc Standards

```javascript
/**
 * Lấy danh sách sản phẩm theo bộ lọc
 * 
 * @param {Object} filters - Bộ lọc sản phẩm
 * @param {string} [filters.category] - Danh mục sản phẩm
 * @param {number} [filters.minPrice] - Giá tối thiểu
 * @param {number} [filters.maxPrice] - Giá tối đa
 * @param {number} [limit=20] - Số lượng sản phẩm tối đa
 * @returns {Array<Product>} Danh sách sản phẩm
 * @throws {Error} Khi filters không hợp lệ
 * 
 * @example
 * const products = getProducts({ category: 'laptop', minPrice: 1000 });
 */
function getProducts(filters = {}, limit = 20) {
    // Implementation
}
```

---

## 🔧 4. KẾ HOẠCH REFACTOR CHI TIẾT

### Phase 1: CRITICAL FILES (Tuần 1-2)

#### 4.1 Refactor `app.js` (95KB → Multiple modules)

**Mục tiêu:** Tách thành 10-12 module nhỏ

```
app.js (Main orchestrator - 10KB)
├── modules/
│   ├── state-manager.js (Global state)
│   ├── product-search.js (Search logic)
│   ├── product-renderer.js (Rendering)
│   ├── infinite-scroll.js (Scroll handling)
│   ├── sidebar-manager.js (Sidebar logic)
│   ├── category-filter.js (Category filtering)
│   ├── banner-slider.js (Banner logic)
│   ├── profile-manager.js (Profile functions)
│   ├── notification-manager.js (Notifications)
│   ├── modal-manager.js (Modals)
│   └── ui-helpers.js (UI utilities)
```

**Checklist:**
- [ ] Tạo thư mục `js/modules/`
- [ ] Tách `state-manager.js` (Global state & helpers)
- [ ] Tách `product-search.js` (Search functionality)
- [ ] Tách `product-renderer.js` (Product rendering)
- [ ] Tách `infinite-scroll.js` (Infinite scroll logic)
- [ ] Tách `sidebar-manager.js` (Sidebar & navigation)
- [ ] Tách `category-filter.js` (Category filtering)
- [ ] Tách `banner-slider.js` (Banner slider)
- [ ] Tách `profile-manager.js` (User profile)
- [ ] Tách `notification-manager.js` (Notifications)
- [ ] Tách `modal-manager.js` (Modals: edit contact, settings)
- [ ] Tách `ui-helpers.js` (formatCurrency, showNotification, etc.)
- [ ] Cập nhật `app.js` để import và orchestrate
- [ ] Test toàn bộ chức năng
- [ ] Update documentation

#### 4.2 Refactor `buildpc.js` (192KB → Multiple modules)

**Mục tiêu:** Tách logic và data

```
buildpc/
├── buildpc-main.js (Main logic - 30KB)
├── buildpc-data.js (Product data - 150KB)
├── buildpc-ui.js (UI rendering - 20KB)
├── buildpc-validator.js (Validation logic - 10KB)
└── buildpc-calculator.js (Price calculation - 10KB)
```

**Checklist:**
- [ ] Tạo thư mục `js/buildpc/`
- [ ] Tách data ra `buildpc-data.js`
- [ ] Tách UI rendering ra `buildpc-ui.js`
- [ ] Tách validation logic ra `buildpc-validator.js`
- [ ] Tách price calculation ra `buildpc-calculator.js`
- [ ] Giữ lại orchestration logic trong `buildpc-main.js`
- [ ] Test build PC functionality
- [ ] Update documentation

#### 4.3 Optimize `products-data.js` (15.1MB)

**Giải pháp:**

**Option 1: Lazy Loading (Recommended)**
```javascript
// products-data-index.js (Small index file)
const PRODUCT_CHUNKS = {
    'laptop': 'data/products-laptop.js',
    'pc': 'data/products-pc.js',
    // ...
};

async function loadProductsByCategory(category) {
    const script = document.createElement('script');
    script.src = PRODUCT_CHUNKS[category];
    document.head.appendChild(script);
}
```

**Option 2: Pagination**
```javascript
// Load only 100 products at a time
const PRODUCTS_PER_PAGE = 100;
```

**Option 3: IndexedDB/LocalStorage Cache**
```javascript
// Cache products in browser storage
```

**Checklist:**
- [ ] Phân tích usage pattern (categories nào được load nhiều nhất)
- [ ] Tách `products-data.js` thành chunks theo category
- [ ] Implement lazy loading mechanism
- [ ] Add loading indicators
- [ ] Test performance improvement
- [ ] Measure load time before/after

### Phase 2: MEDIUM PRIORITY (Tuần 3-4)

#### 4.4 Clean Up Category System

**Checklist:**
- [ ] Review `categories-data.js` - Đảm bảo data structure nhất quán
- [ ] Review `category-product-mapping.js` - Optimize mapping logic
- [ ] Xóa/Archive `category-mapping-examples.js` (move to docs)
- [ ] Xóa/Archive `category-mapping-tests.js` (move to tests folder)
- [ ] Consolidate vào 1-2 files nếu có thể

#### 4.5 Organize Product Details

**Checklist:**
- [ ] Review naming convention trong `product-details/`
- [ ] Tạo `product-details/index.js` để manage chunks
- [ ] Implement lazy loading cho detail chunks
- [ ] Add JSDoc cho `product-details.js`
- [ ] Optimize rendering logic

### Phase 3: LOW PRIORITY (Tuần 5-6)

#### 4.6 Clean Up Utilities & Examples

**Checklist:**
- [ ] Move examples sang thư mục `docs/examples/`
- [ ] Move tests sang thư mục `tests/`
- [ ] Review `product-filters-examples.js` - Archive or integrate
- [ ] Review `product-hidden-attributes.js` - Optimize if needed
- [ ] Clean up `nav-fallback.js` - Add comments

---

## 🎯 5. CHECKLIST TỔNG HỢP

### 5.1 Code Quality Checklist

**Cho mỗi file được refactor:**
- [ ] **Naming:** Tất cả biến/hàm follow naming convention
- [ ] **Comments:** JSDoc cho public functions
- [ ] **Structure:** Follow standard structure template
- [ ] **DRY:** Không có code lặp lại
- [ ] **Single Responsibility:** Mỗi function làm 1 việc
- [ ] **Magic Numbers:** Không có số cứng, dùng constants
- [ ] **Error Handling:** Có try-catch cho async operations
- [ ] **Performance:** Optimize loops, avoid memory leaks

### 5.2 Testing Checklist

**Sau mỗi refactor:**
- [ ] Manual testing: Test toàn bộ chức năng
- [ ] Browser console: Không có errors
- [ ] Performance: Check load time, memory usage
- [ ] Cross-browser: Test trên Chrome, Firefox, Edge
- [ ] Mobile: Test responsive trên mobile devices

### 5.3 Documentation Checklist

- [ ] Update `README_JS_STRUCTURE.md` với cấu trúc mới
- [ ] Tạo `ARCHITECTURE.md` mô tả kiến trúc module
- [ ] Tạo `API_REFERENCE.md` cho public APIs
- [ ] Update inline comments cho complex logic
- [ ] Tạo migration guide nếu có breaking changes

---

## 🛠️ 6. TOOLS & AUTOMATION

### 6.1 Linter Setup (ESLint)

```json
// .eslintrc.json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 4],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-unused-vars": "warn",
    "no-console": "off"
  }
}
```

### 6.2 Prettier Setup

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 4
}
```

### 6.3 Pre-commit Hooks

```bash
# package.json scripts
{
  "scripts": {
    "lint": "eslint js/**/*.js",
    "format": "prettier --write js/**/*.js",
    "test": "echo 'Run tests here'"
  }
}
```

---

## 📈 7. METRICS & SUCCESS CRITERIA

### 7.1 Performance Metrics

**Before Refactor:**
- Initial load time: ___ ms
- Time to interactive: ___ ms
- Bundle size: 15.5 MB
- Number of files: 136

**Target After Refactor:**
- Initial load time: < 2000ms (50% improvement)
- Time to interactive: < 3000ms
- Bundle size: < 5 MB (lazy loading)
- Number of files: ~50 (consolidated)

### 7.2 Code Quality Metrics

**Before:**
- Lines of code in app.js: ~2700
- Average function length: ~30 lines
- Code duplication: High
- JSDoc coverage: ~10%

**Target:**
- Lines per module: < 300
- Average function length: < 15 lines
- Code duplication: Minimal
- JSDoc coverage: > 80%

---

## 📅 8. TIMELINE & MILESTONES

### Week 1-2: Phase 1 - Critical Files
- **Day 1-3:** Refactor `app.js` → modules
- **Day 4-6:** Refactor `buildpc.js` → modules
- **Day 7-10:** Optimize `products-data.js` → lazy loading
- **Day 11-14:** Testing & bug fixes

### Week 3-4: Phase 2 - Medium Priority
- **Day 15-18:** Clean up category system
- **Day 19-22:** Organize product details
- **Day 23-28:** Testing & documentation

### Week 5-6: Phase 3 - Low Priority & Polish
- **Day 29-32:** Clean up utilities & examples
- **Day 33-36:** Setup linter & formatter
- **Day 37-40:** Final testing & optimization
- **Day 41-42:** Documentation & handoff

---

## ⚠️ 9. RISKS & MITIGATION

### Risk 1: Breaking Existing Functionality
**Mitigation:**
- Refactor incrementally (1 module at a time)
- Comprehensive testing after each change
- Keep backup of working code
- Use feature flags for gradual rollout

### Risk 2: Performance Regression
**Mitigation:**
- Measure performance before/after
- Profile with Chrome DevTools
- Test on low-end devices
- Rollback if performance degrades

### Risk 3: Team Coordination
**Mitigation:**
- Clear communication of changes
- Code review for all refactors
- Pair programming for complex parts
- Daily standups during refactor period

---

## 📚 10. REFERENCES & RESOURCES

### Coding Standards
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

### Tools
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [JSDoc](https://jsdoc.app/)

### Performance
- [Web.dev Performance](https://web.dev/performance/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

## ✅ NEXT STEPS

1. **Review this plan** với team
2. **Prioritize** các tasks dựa trên business needs
3. **Setup development environment** (ESLint, Prettier)
4. **Create feature branch** cho refactor
5. **Start with Phase 1** - Critical files
6. **Daily progress tracking** và updates

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-14  
**Owner:** Development Team  
**Status:** 📝 Draft - Awaiting Review
