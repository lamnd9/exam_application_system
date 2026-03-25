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

    // --- Tab Switching Logic ---
    const tabs = document.querySelectorAll('.master-tab');
    const panes = document.querySelectorAll('.master-tab-pane');
    const titleEl = document.getElementById('current-tab-title');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and corresponding pane
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // Update Title
            titleEl.textContent = tab.textContent + '一覧';
        });
    });

    // --- Modal Logic ---
    const modalOverlay = document.getElementById('modal-overlay');
    const btnAddNew = document.getElementById('btn-add-new');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancel = document.getElementById('btn-cancel');
    const btnSave = document.getElementById('btn-save');
    const modalTitle = document.getElementById('modal-title');

    const inputName = document.getElementById('input-name');
    const inputOrder = document.getElementById('input-order');
    const inputStatus = document.getElementById('input-status');

    function openModal() {
        const activeTab = document.querySelector('.master-tab.active').textContent;
        modalTitle.textContent = activeTab + '追加';
        inputName.value = '';
        inputOrder.value = '10';
        inputStatus.value = 'active';
        modalOverlay.classList.add('active');
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
    }

    btnAddNew.addEventListener('click', openModal);
    btnCloseModal.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);

    // Click outside to close
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Dummy Save Function
    btnSave.addEventListener('click', () => {
        const nameVal = inputName.value.trim();
        const orderVal = inputOrder.value;
        const statusVal = inputStatus.value;

        if (!nameVal) {
            alert('名称を入力してください。');
            return;
        }

        // Get active pane
        const activePane = document.querySelector('.master-tab-pane.active');
        let table = activePane.querySelector('table tbody');
        
        // If table doesn't exist (empty state), create it conceptually or just alert for demo
        if (!table) {
            activePane.innerHTML = `
                <table class="result-table" style="text-align: center;">
                    <thead>
                        <tr>
                            <th style="width: 60px;">ID</th>
                            <th style="text-align: left; padding-left: 16px;">名称</th>
                            <th style="width: 100px;">表示順</th>
                            <th style="width: 100px;">状態</th>
                            <th style="width: 120px;">操作</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `;
            table = activePane.querySelector('table tbody');
        }

        // Create new row
        const newId = table.querySelectorAll('tr').length + 1;
        const statusHtml = statusVal === 'active' 
            ? '<span class="status-badge status-active">有効</span>' 
            : '<span class="status-badge status-inactive">無効</span>';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${newId}</td>
            <td style="text-align: left; padding-left: 16px; font-weight: 500;">${nameVal}</td>
            <td>${orderVal}</td>
            <td>${statusHtml}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-edit-sm">編集</button>
                    <button class="btn-delete-sm">削除</button>
                </div>
            </td>
        `;

        // Prepend logic
        table.appendChild(tr);
        bindActionButtons(tr);

        closeModal();
        alert('データを保存しました。');
    });

    // --- Action Button Logic ---
    function bindActionButtons(container) {
        const delBtns = container.querySelectorAll('.btn-delete-sm');
        delBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('このデータを削除してもよろしいですか？')) {
                    this.closest('tr').remove();
                }
            });
        });

        const editBtns = container.querySelectorAll('.btn-edit-sm');
        editBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tr = this.closest('tr');
                const name = tr.cells[1].textContent.trim();
                const activeTab = document.querySelector('.master-tab.active').textContent;
                
                modalTitle.textContent = activeTab + '編集';
                inputName.value = name;
                inputOrder.value = tr.cells[2].textContent.trim();
                inputStatus.value = tr.cells[3].textContent.includes('有効') ? 'active' : 'inactive';
                
                modalOverlay.classList.add('active');
            });
        });
    }

    // Bind existing
    bindActionButtons(document);

});
