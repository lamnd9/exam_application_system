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

    // ===== Sidebar dynamic highlight based on URL =====
    const currentPath = window.location.pathname.split('/').pop() || 'admin.html';
    const currentQuery = window.location.search;
    const currentFull = currentPath + currentQuery;

    const sidebarItems = document.querySelectorAll('.sidebar-item');
    let matchedAny = false;

    // Sort by length descending to match most specific first (e.g. ?type=faculty before just page)
    const sortedItems = Array.from(sidebarItems).sort((a, b) => {
        return (b.getAttribute('href') || '').length - (a.getAttribute('href') || '').length;
    });

    sortedItems.forEach(function (item) {
        const itemHref = item.getAttribute('href');
        if (!matchedAny && itemHref && (currentFull === itemHref || currentFull.startsWith(itemHref + '&') || currentFull.includes(itemHref))) {
            // Clear existing
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            item.classList.add('active');
            matchedAny = true;
            
            // If it's in a group, uncollapse the group
            const groupItems = item.closest('.sidebar-group-items');
            if (groupItems) {
                groupItems.classList.remove('collapsed');
                groupItems.style.maxHeight = 'none'; // Will be set by header logic if needed, but none works for display
                const header = groupItems.previousElementSibling;
                if (header) header.classList.remove('collapsed');
            }
        }
    });

    // Handle clicks for # links
    sidebarItems.forEach(function (item) {
        item.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                sidebarItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
});
