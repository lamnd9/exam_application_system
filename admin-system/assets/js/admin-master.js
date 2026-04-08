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

    // --- Content Switching Logic ---
    const panes = document.querySelectorAll('.master-tab-pane');
    const titleEl = document.getElementById('current-tab-title');

    const typeMap = {
        'faculty': 'tab-dept',
        'department': 'tab-dept-detail',
        'exam-type': 'tab-exam-type',
        'exam-category': 'tab-exam-cat',
        'exam-subject': 'tab-exam-subject',
        'exam-venue': 'tab-exam-venue',
        'exam-master': 'tab-exam-master',
        'doc': 'tab-doc'
    };

    const typeNames = {
        'tab-dept': '学部マスター',
        'tab-dept-detail': '学科マスター',
        'tab-exam-type': '試験種別マスター',
        'tab-exam-cat': '試験区分マスター',
        'tab-exam-subject': '試験科目マスター',
        'tab-exam-venue': '試験場マスター',
        'tab-exam-master': '入試マスター',
        'tab-doc': '出力書類'
    };

    function switchContent(targetId) {
        panes.forEach(p => p.classList.remove('active'));

        const targetPane = document.getElementById(targetId);
        if (targetPane) {
            targetPane.classList.add('active');
            titleEl.textContent = (typeNames[targetId] || 'マスターデータ') + '一覧';
        }
    }

    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'faculty';
    if (typeMap[type]) {
        switchContent(typeMap[type]);
    } else {
        switchContent('tab-dept'); // Default
    }

    // --- Modal Logic ---
    const modalOverlay = document.getElementById('modal-overlay');
    const btnAddNew = document.getElementById('btn-add-new');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancel = document.getElementById('btn-cancel');
    const btnSave = document.getElementById('btn-save');
    const modalTitle = document.getElementById('modal-title');

    const inputYear = document.getElementById('input-year');
    const inputFacultyName = document.getElementById('input-faculty-name');
    const inputCodeFaculty = document.getElementById('input-code-faculty');
    const inputCodeDept = document.getElementById('input-code-dept');
    const inputName = document.getElementById('input-name');
    const inputAbbr = document.getElementById('input-abbr');
    const inputYears = document.getElementById('input-years');
    const inputLinkCode = document.getElementById('input-link-code');
    const inputOrder = document.getElementById('input-order');
    const inputStatus = document.getElementById('input-status');

    const labelName = document.getElementById('label-name');
    const labelAbbr = document.getElementById('label-abbr');

    function getActiveCategory() {
        return titleEl.textContent.replace('一覧', '');
    }

    function updateModalFields(activeCat) {
        // Toggle visibility
        const facultyFields = document.querySelectorAll('.master-field-faculty');
        const deptFields = document.querySelectorAll('.master-field-dept');

        if (activeCat === '学部マスター') {
            facultyFields.forEach(f => f.style.display = 'block');
            deptFields.forEach(f => f.style.display = 'none');
            if (labelName) labelName.innerHTML = '学部名称 <span style="color:#e60000; font-size:11px;">【必須】</span>';
            if (labelAbbr) labelAbbr.textContent = '学部略称';
        } else if (activeCat === '学科マスター') {
            facultyFields.forEach(f => f.style.display = 'none');
            deptFields.forEach(f => f.style.display = 'block');
            if (labelName) labelName.innerHTML = '学科名称 <span style="color:#e60000; font-size:11px;">【必須】</span>';
            if (labelAbbr) labelAbbr.textContent = '学科略称';
        } else {
            facultyFields.forEach(f => f.style.display = 'none');
            deptFields.forEach(f => f.style.display = 'none');
            if (labelName) labelName.innerHTML = '名称 <span style="color:#e60000; font-size:11px;">【必須】</span>';
            if (labelAbbr) labelAbbr.textContent = '略称';
        }
    }

    function openModal() {
        const activeCat = getActiveCategory();
        modalTitle.textContent = activeCat + '追加';
        
        updateModalFields(activeCat);

        // Reset defaults
        if (inputYear) inputYear.value = '2026';
        if (inputFacultyName) inputFacultyName.value = '';
        if (inputCodeFaculty) inputCodeFaculty.value = '';
        if (inputCodeDept) inputCodeDept.value = '';
        if (inputAbbr) inputAbbr.value = '';
        if (inputName) inputName.value = '';
        if (inputYears) inputYears.value = '4';
        if (inputLinkCode) inputLinkCode.value = '';
        if (inputOrder) inputOrder.value = (activeCat === '学科マスター') ? '10' : '10'; // Unified or specific
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
        const activeCat = getActiveCategory();
        const yearVal = inputYear ? inputYear.value : '2026';
        const facultyNameVal = inputFacultyName ? inputFacultyName.value : '';
        const codeFacultyVal = inputCodeFaculty ? inputCodeFaculty.value : '';
        const codeDeptVal = inputCodeDept ? inputCodeDept.value : '';
        const nameVal = inputName.value.trim();
        const abbrVal = inputAbbr ? inputAbbr.value.trim() : nameVal;
        const yearsVal = inputYears ? inputYears.value : '4';
        const linkCodeVal = inputLinkCode ? inputLinkCode.value : '';
        const orderVal = inputOrder.value;
        const statusVal = inputStatus.value;

        if (!nameVal) {
            alert('名称を入力してください。');
            return;
        }

        const activePane = document.querySelector('.master-tab-pane.active');
        let table = activePane.querySelector('table tbody');
        
        if (!table) {
            alert('テーブルが見つかりません。');
            return;
        }

        const tr = document.createElement('tr');
        if (activeCat === '学部マスター') {
            tr.innerHTML = `
                <td style="font-weight: bold;">${yearVal}</td>
                <td>${codeFacultyVal}</td>
                <td style="text-align: left; padding-left: 16px;">${nameVal}</td>
                <td style="text-align: left; padding-left: 16px;">${abbrVal}</td>
                <td>${orderVal}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-edit-sm">編集</button>
                        <button class="btn-delete-sm">削除</button>
                    </div>
                </td>
            `;
        } else if (activeCat === '学科マスター') {
            tr.innerHTML = `
                <td style="color: #e60000; font-weight: bold;">${yearVal}</td>
                <td>${facultyNameVal}</td>
                <td>${codeDeptVal}</td>
                <td style="text-align: left; padding-left: 16px;">${nameVal}</td>
                <td style="text-align: left; padding-left: 16px;">${abbrVal}</td>
                <td>${yearsVal}</td>
                <td>${linkCodeVal}</td>
                <td>${orderVal}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-edit-sm">編集</button>
                        <button class="btn-delete-sm">削除</button>
                    </div>
                </td>
            `;
        } else {
            const newId = table.querySelectorAll('tr').length + 1;
            const statusHtml = statusVal === 'active' 
                ? '<span class="status-badge status-active">有効</span>' 
                : '<span class="status-badge status-inactive">無効</span>';
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
        }

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
                const activeCat = getActiveCategory();
                modalTitle.textContent = activeCat + '編集';
                
                updateModalFields(activeCat);

                if (activeCat === '学部マスター') {
                    if (inputYear) inputYear.value = tr.cells[0].textContent.trim();
                    if (inputCodeFaculty) inputCodeFaculty.value = tr.cells[1].textContent.trim();
                    inputName.value = tr.cells[2].textContent.trim();
                    if (inputAbbr) inputAbbr.value = tr.cells[3].textContent.trim();
                    inputOrder.value = tr.cells[4].textContent.trim();
                } else if (activeCat === '学科マスター') {
                    if (inputYear) inputYear.value = tr.cells[0].textContent.trim();
                    if (inputFacultyName) inputFacultyName.value = tr.cells[1].textContent.trim();
                    if (inputCodeDept) inputCodeDept.value = tr.cells[2].textContent.trim();
                    inputName.value = tr.cells[3].textContent.trim();
                    if (inputAbbr) inputAbbr.value = tr.cells[4].textContent.trim();
                    if (inputYears) inputYears.value = tr.cells[5].textContent.trim();
                    if (inputLinkCode) inputLinkCode.value = tr.cells[6].textContent.trim();
                    inputOrder.value = tr.cells[7].textContent.trim();
                } else {
                    inputName.value = tr.cells[1].textContent.trim();
                    inputOrder.value = tr.cells[2].textContent.trim();
                    inputStatus.value = tr.cells[3].textContent.includes('有効') ? 'active' : 'inactive';
                }
                modalOverlay.classList.add('active');
            });
        });
    }

    bindActionButtons(document);
});
