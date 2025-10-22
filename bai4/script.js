// ----- 1. LẤY CÁC PHẦN TỬ DOM CẦN THIẾT -----
// Lấy ô nhập tìm kiếm và nút tìm
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Lấy nút "Thêm sản phẩm" và form thêm sản phẩm
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const cancelBtn = document.getElementById('cancelBtn');

// Lấy container chứa các sản phẩm
const productsContainer = document.getElementById('productsContainer');

// Lấy phần tử hiển thị thông báo lỗi
const errorMsg = document.getElementById('errorMsg');

// ----- 2. HÀM TÌM KIẾM/LỌC SẢN PHẨM -----
/**
 * Hàm tìm kiếm sản phẩm theo tên
 * - Lấy từ khóa từ ô nhập
 * - Duyệt qua tất cả sản phẩm
 * - Hiển thị sản phẩm có tên chứa từ khóa, ẩn các sản phẩm khác
 */
function searchProducts() {
    // Lấy giá trị từ ô tìm kiếm và chuyển về chữ thường để so sánh không phân biệt hoa thường
    const keyword = searchInput.value.toLowerCase().trim();
    
    // Lấy tất cả các sản phẩm trên trang (lấy mới mỗi lần để bao gồm sản phẩm mới thêm)
    const products = document.querySelectorAll('.product-item');
    
    // Duyệt qua từng sản phẩm
    products.forEach(function(product) {
        // Lấy tên sản phẩm từ thẻ h3 có class "product-name"
        const productName = product.querySelector('.product-name');
        
        // Kiểm tra nếu phần tử tên sản phẩm tồn tại
        if (productName) {
            // Lấy text của tên sản phẩm và chuyển về chữ thường
            const name = productName.textContent.toLowerCase();
            
            // Kiểm tra tên có chứa từ khóa tìm kiếm không
            if (name.includes(keyword)) {
                // Nếu có: hiển thị sản phẩm
                product.style.display = '';
            } else {
                // Nếu không: ẩn sản phẩm
                product.style.display = 'none';
            }
        }
    });
}

// ----- 3. HÀM HIỂN THỊ/ẨN FORM THÊM SẢN PHẨM -----
/**
 * Toggle (bật/tắt) hiển thị form thêm sản phẩm
 * - Nếu form đang ẩn (có class "hidden") thì hiện ra
 * - Nếu form đang hiện thì ẩn đi
 */
function toggleAddProductForm() {
    // Sử dụng classList.toggle để thêm/xóa class "hidden"
    addProductForm.classList.toggle('hidden');
    
    // Nếu form vừa được hiển thị, focus vào ô nhập tên sản phẩm và xóa thông báo lỗi
    if (!addProductForm.classList.contains('hidden')) {
        document.getElementById('productName').focus();
        errorMsg.style.display = 'none';
    }
}

// ----- 4. HÀM THÊM SẢN PHẨM MỚI -----
/**
 * Xử lý khi submit form thêm sản phẩm
 * - Validate dữ liệu
 * - Tạo phần tử HTML mới cho sản phẩm
 * - Thêm vào đầu danh sách sản phẩm
 * - Reset form và ẩn đi
 */
function addNewProduct(event) {
    // Ngăn chặn hành vi mặc định của form (không reload trang)
    event.preventDefault();
    
    // Lấy giá trị từ các ô nhập
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const imageUrl = document.getElementById('productImage').value.trim();
    
    // Xóa thông báo lỗi cũ
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
    
    // Validate dữ liệu
    if (!name) {
        errorMsg.textContent = 'Vui lòng nhập tên sản phẩm!';
        errorMsg.style.display = 'block';
        return;
    }
    if (!description || description.length < 10) {
        errorMsg.textContent = 'Mô tả phải có ít nhất 10 ký tự!';
        errorMsg.style.display = 'block';
        return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
        errorMsg.textContent = 'Vui lòng nhập giá hợp lệ và lớn hơn 0!';
        errorMsg.style.display = 'block';
        return;
    }
    if (!imageUrl) {
        errorMsg.textContent = 'Vui lòng nhập URL hình ảnh!';
        errorMsg.style.display = 'block';
        return;
    }
    
    // Tạo phần tử article mới cho sản phẩm
    const newProduct = document.createElement('article');
    newProduct.className = 'product-item'; // Gán class để áp dụng CSS
    
    // Tạo nội dung HTML cho sản phẩm mới
    newProduct.innerHTML = `
        <img src="${imageUrl}" alt="${name}">
        <h3 class="product-name">${name}</h3>
        <p>${description}</p>
        <p class="price">${formatPrice(price)}₫</p>
    `;
    
    // Thêm sản phẩm mới vào đầu danh sách
    productsContainer.prepend(newProduct);
    
    // Reset form
    addProductForm.reset();
    
    // Ẩn form sau khi thêm thành công
    addProductForm.classList.add('hidden');
}

// ----- 5. HÀM HỖ TRỢ: FORMAT GIÁ -----
/**
 * Format số tiền theo định dạng Việt Nam (thêm dấu phẩy ngăn cách hàng nghìn)
 * Ví dụ: 120000 => 120,000
 */
function formatPrice(price) {
    // Chuyển sang số và format với dấu phân cách
    return parseInt(price).toLocaleString('vi-VN');
}

// ----- 6. HÀM HỦY FORM -----
/**
 * Hủy thao tác thêm sản phẩm
 * - Reset form
 * - Ẩn form
 * - Xóa thông báo lỗi
 */
function cancelAddProduct() {
    // Reset tất cả các trường trong form
    addProductForm.reset();
    // Ẩn form
    addProductForm.classList.add('hidden');
    // Xóa thông báo lỗi
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
}

// ----- 7. GẮN SỰ KIỆN CHO CÁC PHẦN TỬ -----

// Sự kiện click cho nút "Tìm"
searchBtn.addEventListener('click', searchProducts);

// Sự kiện keyup cho ô tìm kiếm (tìm kiếm khi gõ phím)
searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchProducts();
    }
});

// Sự kiện click cho nút "Thêm sản phẩm"
addProductBtn.addEventListener('click', toggleAddProductForm);

// Sự kiện submit cho form thêm sản phẩm
addProductForm.addEventListener('submit', addNewProduct);

// Sự kiện click cho nút "Hủy"
cancelBtn.addEventListener('click', cancelAddProduct);

// ----- 8. TÍNH NĂNG BỔ SUNG: XÓA TẤT CẢ BỘ LỌC -----
/**
 * Thêm nút "Xóa bộ lọc" để hiển thị lại tất cả sản phẩm
 */
const clearFilterBtn = document.createElement('button');
clearFilterBtn.textContent = 'Xóa bộ lọc';
clearFilterBtn.id = 'clearFilterBtn';
clearFilterBtn.className = 'clear-filter-btn';

// Thêm nút vào sau ô tìm kiếm
const searchBox = document.querySelector('.search-box');
searchBox.appendChild(clearFilterBtn);

// Hàm xóa bộ lọc - hiển thị lại tất cả sản phẩm
function clearFilter() {
    // Xóa nội dung ô tìm kiếm
    searchInput.value = '';
    
    // Hiển thị lại tất cả sản phẩm
    const products = document.querySelectorAll('.product-item');
    products.forEach(function(product) {
        product.style.display = '';
    });
}

// Gắn sự kiện cho nút "Xóa bộ lọc"
clearFilterBtn.addEventListener('click', clearFilter);

// ----- 9. CONSOLE LOG THÔNG BÁO -----
console.log('✅ JavaScript đã được tải và sẵn sàng!');
console.log('📚 Các chức năng có sẵn:');
console.log('   - Tìm kiếm sản phẩm');
console.log('   - Thêm sản phẩm mới với validate');
console.log('   - Hiển thị/Ẩn form thêm sản phẩm');