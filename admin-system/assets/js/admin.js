document.addEventListener('DOMContentLoaded', function () {

    // ===== Sidebar Group Toggle =====
    const groupHeaders = document.querySelectorAll('.sidebar-group-header');
    groupHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
            const items = this.nextElementSibling;
            const isCollapsed = items.classList.contains('collapsed');

            if (isCollapsed) {
                items.classList.remove('collapsed');
                items.style.maxHeight = items.scrollHeight + 'px';
                this.classList.remove('collapsed');
            } else {
                items.style.maxHeight = items.scrollHeight + 'px';
                items.offsetHeight;
                items.style.maxHeight = '0';
                items.classList.add('collapsed');
                this.classList.add('collapsed');
            }
        });

        const items = header.nextElementSibling;
        if (!items.classList.contains('collapsed')) {
            items.style.maxHeight = items.scrollHeight + 'px';
        }
    });

    // ===== Detail Conditions Toggle =====
    const detailBtn = document.getElementById('detail-toggle-btn');
    const detailSection = document.getElementById('detail-section');

    if (detailBtn && detailSection) {
        detailSection.style.maxHeight = detailSection.scrollHeight + 'px';

        detailBtn.addEventListener('click', function () {
            const isCollapsed = detailSection.classList.contains('collapsed');

            if (isCollapsed) {
                detailSection.classList.remove('collapsed');
                detailSection.style.maxHeight = detailSection.scrollHeight + 'px';
                detailBtn.classList.remove('collapsed');
                detailBtn.innerHTML = '<span class="toggle-icon">∧</span> 詳細条件を閉じる';
            } else {
                detailSection.style.maxHeight = detailSection.scrollHeight + 'px';
                detailSection.offsetHeight;
                detailSection.style.maxHeight = '0';
                detailSection.classList.add('collapsed');
                detailBtn.classList.add('collapsed');
                detailBtn.innerHTML = '<span class="toggle-icon">∨</span> 詳細条件を開く';
            }
        });
    }

    // ===== Sidebar active item highlight =====
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(function (item) {
        item.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                sidebarItems.forEach(function (i) {
                    i.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
});
