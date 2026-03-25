document.addEventListener('DOMContentLoaded', function () {
    
    // Sidebar active highlight
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(function (item) {
        item.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });

    const searchBtn = document.getElementById('btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            // Fake loading search result
            alert('検索を実行しました。（デモ）');
        });
    }

    const executeBtn = document.getElementById('btn-execute');
    if (executeBtn) {
        executeBtn.addEventListener('click', function () {
            if (confirm('受験番号を採番しますか？')) {
                alert('採番を完了しました。（デモ）');
            }
        });
    }
});
