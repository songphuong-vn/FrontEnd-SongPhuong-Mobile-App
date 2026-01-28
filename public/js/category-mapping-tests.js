/**
 * Category Mapping System - Test Suite
 * Chạy các test này trong browser console để verify hệ thống
 */

// ============================================
// TEST UTILITIES
// ============================================

const TestSuite = {
    passed: 0,
    failed: 0,
    results: [],
    
    reset() {
        this.passed = 0;
        this.failed = 0;
        this.results = [];
    },
    
    assert(condition, testName, details = '') {
        if (condition) {
            this.passed++;
            this.results.push({
                status: 'PASS',
                name: testName,
                details: details
            });
            console.log(`✅ ${testName}${details ? ` (${details})` : ''}`);
        } else {
            this.failed++;
            this.results.push({
                status: 'FAIL',
                name: testName,
                details: details
            });
            console.error(`❌ ${testName}${details ? ` (${details})` : ''}`);
        }
    },
    
    assertEquals(actual, expected, testName) {
        if (actual === expected) {
            this.passed++;
            console.log(`✅ ${testName}: ${actual} === ${expected}`);
        } else {
            this.failed++;
            console.error(`❌ ${testName}: ${actual} !== ${expected}`);
        }
    },
    
    assertGreater(actual, minimum, testName) {
        if (actual > minimum) {
            this.passed++;
            console.log(`✅ ${testName}: ${actual} > ${minimum}`);
        } else {
            this.failed++;
            console.error(`❌ ${testName}: ${actual} <= ${minimum}`);
        }
    },
    
    report() {
        console.group("📋 TEST REPORT");
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📊 Total: ${this.passed + this.failed}`);
        console.log(`📈 Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(2)}%`);
        console.groupEnd();
        
        return this.failed === 0;
    }
};

// ============================================
// TEST 1: System Initialization
// ============================================

async function testSystemInitialization() {
    console.group("🧪 TEST 1: System Initialization");
    TestSuite.reset();
    
    // Test 1.1: ProductManager exists
    TestSuite.assert(
        typeof ProductManager !== 'undefined',
        'ProductManager exists'
    );
    
    // Test 1.2: Products loaded
    TestSuite.assertGreater(
        ProductManager.products.length,
        0,
        'Products data loaded'
    );
    
    // Test 1.3: Mapping functions exist
    TestSuite.assert(
        typeof getCategoryPath === 'function',
        'getCategoryPath function exists'
    );
    TestSuite.assert(
        typeof filterProductsByExactCategory === 'function',
        'filterProductsByExactCategory function exists'
    );
    TestSuite.assert(
        typeof filterProductsByParentCategory === 'function',
        'filterProductsByParentCategory function exists'
    );
    TestSuite.assert(
        typeof getSubCategoriesForParent === 'function',
        'getSubCategoriesForParent function exists'
    );
    TestSuite.assert(
        typeof getProductCountByCategory === 'function',
        'getProductCountByCategory function exists'
    );
    TestSuite.assert(
        typeof getUncategorizedProducts === 'function',
        'getUncategorizedProducts function exists'
    );
    
    console.groupEnd();
    return TestSuite.report();
}

// ============================================
// TEST 2: Mapping Functionality
// ============================================

function testMappingFunctionality() {
    console.group("🧪 TEST 2: Mapping Functionality");
    TestSuite.reset();
    
    // Test 2.1: getCategoryPath works
    const path1 = getCategoryPath("PC Gaming");
    TestSuite.assertEquals(
        path1,
        "PC Song Phương > PC Gaming",
        "PC Gaming maps correctly"
    );
    
    const path2 = getCategoryPath("Laptop Theo Hãng");
    TestSuite.assertEquals(
        path2,
        "Laptop - Máy Tính Xách Tay > Laptop Theo Hãng",
        "Laptop Theo Hãng maps correctly"
    );
    
    const path3 = getCategoryPath("Main - Bo Mạch Chủ");
    TestSuite.assertEquals(
        path3,
        "Linh Kiện Máy Tính > Main - Bo Mạch Chủ",
        "Main - Bo Mạch Chủ maps correctly"
    );
    
    // Test 2.2: Unknown category returns "Khác"
    const pathUnknown = getCategoryPath("Unknown Category");
    TestSuite.assertEquals(
        pathUnknown,
        "Khác",
        "Unknown category maps to Khác"
    );
    
    // Test 2.3: Empty category returns "Khác"
    const pathEmpty = getCategoryPath("");
    TestSuite.assertEquals(
        pathEmpty,
        "Khác",
        "Empty category maps to Khác"
    );
    
    // Test 2.4: Null category returns "Khác"
    const pathNull = getCategoryPath(null);
    TestSuite.assertEquals(
        pathNull,
        "Khác",
        "Null category maps to Khác"
    );
    
    console.groupEnd();
    return TestSuite.report();
}

// ============================================
// TEST 3: Filtering by Exact Category
// ============================================

function testFilterByExactCategory() {
    console.group("🧪 TEST 3: Filter by Exact Category");
    TestSuite.reset();
    
    // Test 3.1: Filter PC Gaming
    const pcGaming = filterProductsByExactCategory(
        ProductManager.products,
        "PC Song Phương > PC Gaming"
    );
    TestSuite.assertGreater(
        pcGaming.length,
        0,
        "PC Gaming products exist"
    );
    console.log(`   Found: ${pcGaming.length} PC Gaming products`);
    
    // Test 3.2: Filter Laptop Theo Hãng
    const laptopBrand = filterProductsByExactCategory(
        ProductManager.products,
        "Laptop - Máy Tính Xách Tay > Laptop Theo Hãng"
    );
    TestSuite.assertGreater(
        laptopBrand.length,
        0,
        "Laptop Theo Hãng products exist"
    );
    console.log(`   Found: ${laptopBrand.length} Laptop Theo Hãng products`);
    
    // Test 3.3: Filter Main
    const mainboards = filterProductsByExactCategory(
        ProductManager.products,
        "Linh Kiện Máy Tính > Main - Bo Mạch Chủ"
    );
    TestSuite.assertGreater(
        mainboards.length,
        0,
        "Mainboard products exist"
    );
    console.log(`   Found: ${mainboards.length} Mainboard products`);
    
    // Test 3.4: Empty result for non-existent category
    const empty = filterProductsByExactCategory(
        ProductManager.products,
        "Fake Category > Fake Subcat"
    );
    TestSuite.assertEquals(
        empty.length,
        0,
        "Non-existent category returns empty array"
    );
    
    console.groupEnd();
    return TestSuite.report();
}

// ============================================
// TEST 4: Filtering by Parent Category
// ============================================

function testFilterByParentCategory() {
    console.group("🧪 TEST 4: Filter by Parent Category");
    TestSuite.reset();
    
    // Test 4.1: Filter PC Song Phương
    const pcs = filterProductsByParentCategory(
        ProductManager.products,
        "PC Song Phương"
    );
    TestSuite.assertGreater(
        pcs.length,
        0,
        "PC Song Phương parent category products exist"
    );
    console.log(`   Found: ${pcs.length} PC Song Phương products`);
    
    // Test 4.2: Filter Laptop
    const laptops = filterProductsByParentCategory(
        ProductManager.products,
        "Laptop - Máy Tính Xách Tay"
    );
    TestSuite.assertGreater(
        laptops.length,
        0,
        "Laptop parent category products exist"
    );
    console.log(`   Found: ${laptops.length} Laptop products`);
    
    // Test 4.3: Filter Components
    const components = filterProductsByParentCategory(
        ProductManager.products,
        "Linh Kiện Máy Tính"
    );
    TestSuite.assertGreater(
        components.length,
        0,
        "Linh Kiện Máy Tính parent category products exist"
    );
    console.log(`   Found: ${components.length} Component products`);
    
    // Test 4.4: Parent filter > Exact filter
    TestSuite.assert(
        pcs.length >= filterProductsByExactCategory(ProductManager.products, "PC Song Phương > PC Gaming").length,
        "Parent category count >= Subcat count"
    );
    
    console.groupEnd();
    return TestSuite.report();
}

// ============================================
// TEST 5: Get Subcategories
// ============================================

function testGetSubcategories() {
    console.group("🧪 TEST 5: Get Subcategories");
    TestSuite.reset();
    
    // Test 5.1: Get PC Song Phương subcategories
    const pcSubs = getSubCategoriesForParent(
        ProductManager.products,
        "PC Song Phương"
    );
    TestSuite.assertGreater(
        pcSubs.length,
        0,
        "PC Song Phương has subcategories"
    );
    console.log(`   Found: ${pcSubs.join(', ')}`);
    
    // Test 5.2: Get Linh Kiện Máy Tính subcategories
    const componentSubs = getSubCategoriesForParent(
        ProductManager.products,
        "Linh Kiện Máy Tính"
    );
    TestSuite.assertGreater(
        componentSubs.length,
        0,
        "Linh Kiện Máy Tính has subcategories"
    );
    console.log(`   Found: ${componentSubs.join(', ')}`);
    
    // Test 5.3: Laptop subcategories
    const laptopSubs = getSubCategoriesForParent(
        ProductManager.products,
        "Laptop - Máy Tính Xách Tay"
    );
    TestSuite.assertGreater(
        laptopSubs.length,
        0,
        "Laptop has subcategories"
    );
    console.log(`   Found: ${laptopSubs.join(', ')}`);
    
    // Test 5.4: Subcategories are sorted
    TestSuite.assert(
        JSON.stringify(pcSubs) === JSON.stringify([...pcSubs].sort()),
        "Subcategories are sorted alphabetically"
    );
    
    console.groupEnd();
    return TestSuite.report();
}

// ============================================
// TEST 6: Product Count Statistics
// ============================================

function testProductCountStatistics() {
    console.group("🧪 TEST 6: Product Count Statistics");
    TestSuite.reset();
    
    const counts = getProductCountByCategory(ProductManager.products);
    
    // Test 6.1: Counts object exists
    TestSuite.assert(
        Object.keys(counts).length > 0,
        "Product counts generated"
    );
    
    // Test 6.2: Total matches product count
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    TestSuite.assertEquals(
        total,
        ProductManager.products.length,
        "Total count matches product count"
    );
    console.log(`   Total: ${total} products`);
    
    // Test 6.3: Top 5 categories
    const top5 = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    console.log("   Top 5 categories:");
    top5.forEach(([cat, count], i) => {
        console.log(`   ${i + 1}. ${cat}: ${count}`);
    });
    
    // Test 6.4: All counts are positive
    const allPositive = Object.values(counts).every(c => c > 0);
    TestSuite.assert(
        allPositive,
        "All category counts are positive"
    );
    
    console.groupEnd();
    return TestSuite.report();
}

// ============================================
// TEST 7: Uncategorized Products
// ============================================

function testUncategorizedProducts() {
    console.group("🧪 TEST 7: Uncategorized Products");
    TestSuite.reset();
    
    const uncategorized = getUncategorizedProducts(ProductManager.products);
    
    // Test 7.1: Uncategorized products exist
    TestSuite.assert(
        Array.isArray(uncategorized),
        "Uncategorized products is an array"
    );
    console.log(`   Count: ${uncategorized.length}`);
    
    // Test 7.2: Show some examples if exist
    if (uncategorized.length > 0) {
        console.log("   Examples:");
        uncategorized.slice(0, 3).forEach(p => {
            console.log(`   - SKU: ${p.s}, Category: "${p.c}"`);
        });
    }
    
    // Test 7.3: All uncategorized products should have category "Khác"
    if (uncategorized.length > 0) {
        const allKhac = uncategorized.every(p => getCategoryPath(p.c) === "Khác");
        TestSuite.assert(
            allKhac,
            "All uncategorized products map to 'Khác'"
        );
    } else {
        TestSuite.assert(true, "No uncategorized products (Good!)");
    }
    
    console.groupEnd();
    return TestSuite.report();
}

// ============================================
// TEST 8: Data Integrity
// ============================================

function testDataIntegrity() {
    console.group("🧪 TEST 8: Data Integrity");
    TestSuite.reset();
    
    const products = ProductManager.products;
    
    // Test 8.1: All products have 's' (SKU)
    const allHaveSku = products.every(p => p.s && p.s.trim() !== '');
    TestSuite.assert(
        allHaveSku,
        "All products have SKU"
    );
    
    // Test 8.2: All products have 'n' (Name)
    const allHaveName = products.every(p => p.n && p.n.trim() !== '');
    TestSuite.assert(
        allHaveName,
        "All products have name"
    );
    
    // Test 8.3: All products have 'c' (Category)
    const allHaveCategory = products.every(p => p.c);
    TestSuite.assert(
        allHaveCategory,
        "All products have category field"
    );
    
    // Test 8.4: No duplicate SKUs
    const skus = products.map(p => p.s);
    const uniqueSkus = new Set(skus);
    TestSuite.assertEquals(
        skus.length,
        uniqueSkus.size,
        "No duplicate SKUs"
    );
    
    // Test 8.5: Random sample mapping check
    const sample = products[Math.floor(Math.random() * products.length)];
    const path = getCategoryPath(sample.c);
    TestSuite.assert(
        path && path !== '',
        `Random sample mapping: "${sample.c}" -> "${path}"`
    );
    
    console.groupEnd();
    return TestSuite.report();
}

// ============================================
// RUN ALL TESTS
// ============================================

async function runAllTests() {
    console.clear();
    console.log("╔═══════════════════════════════════════════════════════╗");
    console.log("║   CATEGORY MAPPING SYSTEM - COMPREHENSIVE TEST SUITE  ║");
    console.log("╚═══════════════════════════════════════════════════════╝\n");
    
    let allPassed = true;
    
    // Run tests
    allPassed &= await testSystemInitialization();
    console.log("");
    
    allPassed &= testMappingFunctionality();
    console.log("");
    
    allPassed &= testFilterByExactCategory();
    console.log("");
    
    allPassed &= testFilterByParentCategory();
    console.log("");
    
    allPassed &= testGetSubcategories();
    console.log("");
    
    allPassed &= testProductCountStatistics();
    console.log("");
    
    allPassed &= testUncategorizedProducts();
    console.log("");
    
    allPassed &= testDataIntegrity();
    console.log("");
    
    // Final report
    console.log("╔═══════════════════════════════════════════════════════╗");
    if (allPassed) {
        console.log("║   ✅ ALL TESTS PASSED - SYSTEM IS WORKING CORRECTLY!  ║");
    } else {
        console.log("║   ⚠️  SOME TESTS FAILED - CHECK ABOVE FOR DETAILS     ║");
    }
    console.log("╚═══════════════════════════════════════════════════════╝");
    
    return allPassed;
}

// ============================================
// EXPORT
// ============================================

// Make available in global scope for console
window.CategoryMappingTests = {
    runAll: runAllTests,
    test1: testSystemInitialization,
    test2: testMappingFunctionality,
    test3: testFilterByExactCategory,
    test4: testFilterByParentCategory,
    test5: testGetSubcategories,
    test6: testProductCountStatistics,
    test7: testUncategorizedProducts,
    test8: testDataIntegrity
};

console.log("✅ Test suite loaded. Run CategoryMappingTests.runAll() to start all tests.");
console.log("   Or run individual tests:");
console.log("   - CategoryMappingTests.test1() through test8()");
// Đã xóa file này vì không còn sử dụng.
