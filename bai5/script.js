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

// ----- 2. KHỞI TẠO DANH SÁCH SẢN PHẨM -----
/**
 * Danh sách sản phẩm mặc định (dùng khi localStorage chưa có dữ liệu)
 */
const defaultProducts = [
    {
        name: 'Nhà Giả Kim',
        description: 'Một cuốn tiểu thuyết triết lý đầy cảm hứng về hành trình theo đuổi ước mơ.',
        price: 120000,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/vi/9/9c/Nh%C3%A0_gi%E1%BA%A3_kim_%28s%C3%A1ch%29.jpg'
    },
    {
        name: 'Đắc Nhân Tâm',
        description: 'Cuốn sách kỹ năng sống kinh điển giúp bạn xây dựng mối quan hệ và thành công hơn.',
        price: 98000,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/vi/9/9c/Nh%C3%A0_gi%E1%BA%A3_kim_%28s%C3%A1ch%29.jpg'
    },
    {
        name: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        description: 'Lời nhắn gửi chân thành về tuổi trẻ, khát vọng và hành trình tìm kiếm bản thân.',
        price: 105000,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/vi/9/9c/Nh%C3%A0_gi%E1%BA%A3_kim_%28s%C3%A1ch%29.jpg'
    }
];

// Khởi tạo danh sách sản phẩm từ localStorage hoặc mặc định
let products = JSON.parse(localStorage.getItem('products')) || defaultProducts;

// ----- 3. HÀM RENDER SẢN PHẨM -----
/**
 * Hiển thị danh sách sản phẩm lên giao diện
 */
function renderProducts() {
    // Xóa nội dung hiện tại của container
    productsContainer.innerHTML = '';
    
    // Duyệt qua danh sách sản phẩm và tạo phần tử HTML
    products.forEach(product => {
        const newProduct = document.createElement('article');
        newProduct.className = 'product-item';
        newProduct.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3 class="product-name">${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">${formatPrice(product.price)}₫</p>
        `;
        productsContainer.appendChild(newProduct);
    });
}

// ----- 4. HÀM TÌM KIẾM/LỌC SẢN PHẨM -----
/**
 * Hàm tìm kiếm sản phẩm theo tên
 * - Lấy từ khóa từ ô nhập
 * - Duyệt qua tất cả sản phẩm
 * - Hiển thị sản phẩm có tên chứa từ khóa, ẩn các sản phẩm khác
 */
function searchProducts() {
    const keyword = searchInput.value.toLowerCase().trim();
    const products = document.querySelectorAll('.product-item');
    
    products.forEach(function(product) {
        const productName = product.querySelector('.product-name');
        if (productName) {
            const name = productName.textContent.toLowerCase();
            product.style.display = name.includes(keyword) ? '' : 'none';
        }
    });
}

// ----- 5. HÀM HIỂN THỊ/ẨN FORM THÊM SẢN PHẨM -----
/**
 * Toggle (bật/tắt) hiển thị form thêm sản phẩm
 */
function toggleAddProductForm() {
    addProductForm.classList.toggle('hidden');
    if (!addProductForm.classList.contains('hidden')) {
        document.getElementById('productName').focus();
        errorMsg.style.display = 'none';
    }
}

// ----- 6. HÀM THÊM SẢN PHẨM MỚI -----
/**
 * Xử lý khi submit form thêm sản phẩm
 * - Validate dữ liệu
 * - Thêm sản phẩm vào mảng
 * - Lưu vào localStorage
 * - Cập nhật giao diện
 */
function addNewProduct(event) {
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
    
    // Thêm sản phẩm mới vào đầu mảng
    products.unshift({
        name,
        description,
        price: Number(price),
        imageUrl
    });
    
    // Lưu vào localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Cập nhật giao diện
    renderProducts();
    
    // Reset form và ẩn
    addProductForm.reset();
    addProductForm.classList.add('hidden');
}

// ----- 7. HÀM HỖ TRỢ: FORMAT GIÁ -----
/**
 * Format số tiền theo định dạng Việt Nam
 */
function formatPrice(price) {
    return parseInt(price).toLocaleString('vi-VN');
}

// ----- 8. HÀM HỦY FORM -----
/**
 * Hủy thao tác thêm sản phẩm
 */
function cancelAddProduct() {
    addProductForm.reset();
    addProductForm.classList.add('hidden');
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
}

// ----- 9. GẮN SỰ KIỆN CHO CÁC PHẦN TỬ -----

// Sự kiện click cho nút "Tìm"
searchBtn.addEventListener('click', searchProducts);

// Sự kiện keyup cho ô tìm kiếm
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

// ----- 10. TÍNH NĂNG BỔ SUNG: XÓA TẤT CẢ BỘ LỌC -----
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

// Hàm xóa bộ lọc
function clearFilter() {
    searchInput.value = '';
    const products = document.querySelectorAll('.product-item');
    products.forEach(function(product) {
        product.style.display = '';
    });
}

// Gắn sự kiện cho nút "Xóa bộ lọc"
clearFilterBtn.addEventListener('click', clearFilter);

// ----- 11. KHỞI TẠO KHI TRANG TẢI -----
/**
 * Khi trang tải, render danh sách sản phẩm từ localStorage
 */
document.addEventListener('DOMContentLoaded', function() {
    // Nếu localStorage trống, lưu danh sách mặc định
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
    // Render sản phẩm
    renderProducts();
});

