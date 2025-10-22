// ----- 1. LẤY CÁC PHẦN TỬ DOM CẦN THIẾT -----
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addProductBtn = document.getElementById('addProductBtn');
const addProductForm = document.getElementById('addProductForm');
const cancelBtn = document.getElementById('cancelBtn');
const productsContainer = document.getElementById('productsContainer');
const errorMsg = document.getElementById('errorMsg');

// ----- 2. KHỞI TẠO DANH SÁCH SẢN PHẨM -----
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

let products = JSON.parse(localStorage.getItem('products')) || defaultProducts;

// ----- 3. HÀM RENDER SẢN PHẨM -----
function renderProducts() {
    productsContainer.innerHTML = '';
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
function searchProducts() {
    const keyword = searchInput.value.toLowerCase().trim();
    const products = document.querySelectorAll('.product-item');
    
    products.forEach(product => {
        const productName = product.querySelector('.product-name');
        if (productName) {
            const name = productName.textContent.toLowerCase();
            if (name.includes(keyword)) {
                product.classList.remove('hidden');
            } else {
                product.classList.add('hidden');
            }
        }
    });
}

// ----- 5. HÀM HIỂN THỊ/ẨN FORM THÊM SẢN PHẨM -----
function toggleAddProductForm() {
    if (addProductForm.classList.contains('hidden')) {
        // Hiện form: xóa class hidden và đặt max-height
        addProductForm.classList.remove('hidden');
        addProductForm.style.maxHeight = addProductForm.scrollHeight + 'px';
        document.getElementById('productName').focus();
        errorMsg.style.display = 'none';
    } else {
        // Ẩn form: thêm class hidden sau khi transition hoàn tất
        addProductForm.style.maxHeight = '0';
        addProductForm.style.opacity = '0';
        setTimeout(() => {
            addProductForm.classList.add('hidden');
            addProductForm.style.opacity = '1'; // Khôi phục opacity cho lần hiện tiếp theo
        }, 500); // Thời gian khớp với transition
    }
}

// ----- 6. HÀM THÊM SẢN PHẨM MỚI -----
function addNewProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const imageUrl = document.getElementById('productImage').value.trim();
    
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
    
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
    
    products.unshift({
        name,
        description,
        price: Number(price),
        imageUrl
    });
    
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    addProductForm.reset();
    toggleAddProductForm(); // Sử dụng toggle để ẩn form với hiệu ứng
}

// ----- 7. HÀM HỖ TRỢ: FORMAT GIÁ -----
function formatPrice(price) {
    return parseInt(price).toLocaleString('vi-VN');
}

// ----- 8. HÀM HỦY FORM -----
function cancelAddProduct() {
    addProductForm.reset();
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
    toggleAddProductForm(); // Sử dụng toggle để ẩn form với hiệu ứng
}

// ----- 9. GẮN SỰ KIỆN CHO CÁC PHẦN TỬ -----
searchBtn.addEventListener('click', searchProducts);
searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchProducts();
    }
});
addProductBtn.addEventListener('click', toggleAddProductForm);
addProductForm.addEventListener('submit', addNewProduct);
cancelBtn.addEventListener('click', cancelAddProduct);

// ----- 10. TÍNH NĂNG BỔ SUNG: XÓA TẤT CẢ BỘ LỌC -----
const clearFilterBtn = document.createElement('button');
clearFilterBtn.textContent = 'Xóa bộ lọc';
clearFilterBtn.id = 'clearFilterBtn';
clearFilterBtn.className = 'clear-filter-btn';
const searchBox = document.querySelector('.search-box');
searchBox.appendChild(clearFilterBtn);

function clearFilter() {
    searchInput.value = '';
    const products = document.querySelectorAll('.product-item');
    products.forEach(product => {
        product.classList.remove('hidden');
    });
}

clearFilterBtn.addEventListener('click', clearFilter);

// ----- 11. KHỞI TẠO KHI TRANG TẢI -----
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
    renderProducts();
});
