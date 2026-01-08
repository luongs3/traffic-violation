document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const licenseInput = document.getElementById('license-input');
    const resultsContainer = document.getElementById('results-container');

    let violationsData = [];

    // Fetch the JSON data
    async function loadData() {
        try {
            const response = await fetch('violations.json');
            if (!response.ok) throw new Error('Không thể tải dữ liệu vi phạm');
            violationsData = await response.json();
            console.log(`Đã tải ${violationsData.length} bản ghi`);
        } catch (error) {
            console.error(error);
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>Lỗi</h3>
                    <p>Không thể tải dữ liệu từ server. Vui lòng đảm bảo bạn đang chạy website qua web server.</p>
                </div>
            `;
        }
    }

    // Clean license plate for searching
    function cleanInput(val) {
        return val.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }

    function search() {
        const rawInput = licenseInput.value.trim();
        const query = cleanInput(rawInput);
        
        if (!rawInput || !query) {
            resultsContainer.innerHTML = `
                <div class="empty-state">
                    <p>Vui lòng nhập biển số xe để tra cứu</p>
                </div>
            `;
            return;
        }

        const results = violationsData.filter(v => {
            const plate = cleanInput(v.license_plate);
            return plate === query || plate.endsWith(query);
        });

        renderResults(results, query);
    }

    function renderResults(results, query) {
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>Không tìm thấy vi phạm</h3>
                    <p>Biển số <strong>${query}</strong> hiện không có bản ghi vi phạm nào trong hệ thống.</p>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = `
            <div class="results-header">
                Tìm thấy <strong>${results.length}</strong> vi phạm cho biển số <strong>${query}</strong>
            </div>
            <div class="results-list">
                <div class="table-header">
                    <div class="col-index">STT</div>
                    <div class="col-plate">Biển số</div>
                    <div class="col-time">Thời gian vi phạm</div>
                    <div class="col-type">Loại phương tiện</div>
                </div>
                ${results.map(v => `
                    <div class="violation-row">
                        <div class="col-index">#${v.index}</div>
                        <div class="col-plate">
                            <span class="plate-badge-small">${v.license_plate_raw || v.license_plate}</span>
                        </div>
                        <div class="col-time">${v.violation_time}</div>
                        <div class="col-type">${v.vehicle_type}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Event listeners
    searchBtn.addEventListener('click', search);
    licenseInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') search();
    });

    // Initial load
    loadData();
});
