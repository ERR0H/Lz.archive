let type = document.title;
const file1 = `../src/${type}.json`; // Đường dẫn tới file JSON đầu tiên
const file2 = `../src/n_${type}.json`; // Đường dẫn tới file JSON thứ hai

const appear_position = document.querySelector("#container"); // Vị trí hiển thị nội dung

let start = 0, end = 20;
let searchKeyword = ""; // Biến lưu từ khóa tìm kiếm
let mergedData = []; // Biến lưu trữ dữ liệu đã tải

// Hiển thị trang hiện tại
const current_page = () => document.getElementById("page").value = end / 20;

// Tính tổng số trang
const max_page = length => Math.ceil(length / 20); // Làm tròn số trang

// Tải và hiển thị dữ liệu trang tiếp theo
const next_page = () => {
    if (end < filteredData.length) {
        start += 20;
        end += 20;
        renderObjects();
    }
}

// Tải và hiển thị dữ liệu trang trước đó
const previous_page = () => {
    if (start > 0) {
        start -= 20;
        end -= 20;
        renderObjects();
    }
}

// Nhảy đến trang chỉ định
const jump_to = move_to_page => {
    if (move_to_page >= 1 && move_to_page <= max_page(filteredData.length)) {
        end = move_to_page * 20;
        start = end - 20;
        renderObjects();
    }
}

// Thêm sự kiện khi người dùng nhập số trang và nhấn Enter 
document.getElementById("page").addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        jump_to(Number(e.target.value));
    }
});

// Hàm lấy dữ liệu từ file JSON 
const fetchJSON = async filex => {
    const response = await fetch(filex);
    return response.json();
}

// Hàm hợp nhất hai file JSON 
const loadAndMergeJSONFiles = async () => {
    const [data1, data2] = await Promise.all([fetchJSON(file1), fetchJSON(file2)]);
    mergedData = [...data2, ...data1];
}

// Lọc dữ liệu dựa trên từ khóa tìm kiếm
let filteredData = [];

const filterData = () => {
    if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        filteredData = mergedData.filter(item => item.name.toLowerCase().includes(keyword));
    } else {
        filteredData = mergedData;
    }
}

// Hàm hiển thị dữ liệu
const renderObjects = () => {
    appear_position.innerHTML = ""; // Xóa nội dung cũ
    current_page(); // Cập nhật trang hiện tại

    // Kiểm tra giới hạn phân trang
    let paginatedData = filteredData.slice(start, end);

    // Tạo một tài liệu ảo để giảm thao tác DOM
    let fragment = document.createDocumentFragment();

    paginatedData.forEach(obj => {
        const appear_obj = document.createElement("div");
        appear_obj.classList.add("asset");

        appear_obj.innerHTML = `
            <div class="information">${obj.name}</div>
            <div class="image-container">
                <img src="${obj.img}" alt="">
                <div class="image-overlay">
                    <a href="https://youtube.com/shorts/J3zAhNUXLMA?si=ZY8PdcLKJG7vzAFe" target="_blank"><i class="fa-solid fa-download"></i></a>
                    <a href="${obj.source}" target="_blank"><i class="fa-solid fa-link"></i></a>
                </div>
            </div>
        `;
        fragment.appendChild(appear_obj);
    });

    appear_position.appendChild(fragment);

    // Cập nhật tổng số trang
    document.getElementById("max").innerText = `/ ${max_page(filteredData.length)}`;
}

// Hàm khởi tạo
const init = async () => {
    await loadAndMergeJSONFiles(); // Tải và hợp nhất dữ liệu
    filterData(); // Lọc dữ liệu ban đầu
    renderObjects(); // Hiển thị dữ liệu
}

// Thêm sự kiện tìm kiếm khi người dùng nhập từ khóa
document.getElementById("search").addEventListener("input", e => {
    searchKeyword = e.target.value; // Lấy từ khóa tìm kiếm
    start = 0; // Đặt lại vị trí bắt đầu
    end = 20; // Đặt lại vị trí kết thúc
    filterData(); // Lọc lại dữ liệu
    renderObjects(); // Cập nhật hiển thị
});

// Khởi chạy khi DOM đã được tải
document.addEventListener("DOMContentLoaded", init);
