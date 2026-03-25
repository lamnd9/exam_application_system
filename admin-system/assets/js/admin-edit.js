document.addEventListener('DOMContentLoaded', function () {

    // ===== Tab Switching =====
    const tabs = document.querySelectorAll('.edit-tab');
    const tabContents = document.querySelectorAll('.edit-tab-content');

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            const targetStep = this.getAttribute('data-tab');

            // Remove active from all tabs/contents
            tabs.forEach(function (t) { t.classList.remove('active'); });
            tabContents.forEach(function (c) { c.classList.remove('active'); });

            // Activate clicked tab and matching content
            this.classList.add('active');
            document.querySelector('.edit-tab-content[data-tab="' + targetStep + '"]').classList.add('active');
        });
    });

    // ===== Sidebar active highlight =====
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(function (item) {
        item.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            sidebarItems.forEach(function (i) { i.classList.remove('active'); });
            this.classList.add('active');
        });
    });

    // ===== Save button =====
    const saveBtn = document.getElementById('btn-save');
    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            alert('データを保存しました。（デモ）');
        });
    }
});
