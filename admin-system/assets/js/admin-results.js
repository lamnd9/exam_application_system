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

    // File Input Change
    const fileInput = document.getElementById('result-csv');
    const filenameDiv = document.getElementById('result-filename');
    
    // Track selected file globally for this script
    let selectedFile = null;

    if (fileInput && filenameDiv) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files.length > 0) {
                selectedFile = e.target.files[0];
                filenameDiv.textContent = selectedFile.name;
                filenameDiv.classList.add('has-file');
            } else {
                selectedFile = null;
                filenameDiv.textContent = '選択されていません';
                filenameDiv.classList.remove('has-file');
            }
        });
    }

    // Import Action
    const importBtn = document.getElementById('btn-import');
    const resultDateInput = document.getElementById('result-date');
    const importResultTbody = document.getElementById('import-result-tbody');
    const emptyResultMsg = document.getElementById('empty-result-msg');
    const historyTbody = document.getElementById('history-tbody');

    if (importBtn) {
        importBtn.addEventListener('click', function () {
            
            if (!resultDateInput.value) {
                alert('合否発表日を指定してください。');
                return;
            }

            if (!selectedFile) {
                alert('取込するCSVファイルを指定してください。');
                return;
            }

            if (confirm(`【${selectedFile.name}】を取込ますか？\nすでに登録済の受験番号データは上書きされます。`)) {
                
                // --- Dummy Logic for Results ---

                // Clear empty message if it exists
                if (emptyResultMsg) {
                    emptyResultMsg.style.display = 'none';
                }

                // Add lines to import results
                importResultTbody.innerHTML = `
                    <tr>
                        <td>1</td>
                        <td style="text-align: left; padding-left: 20px;">正常に取込ました。(受験番号: 2610A001)</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td style="text-align: left; padding-left: 20px;">正常に取込ました。(受験番号: 2610A002)</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td style="text-align: left; padding-left: 20px; color: #cc0000; font-weight: 600;">エラー：受験番号が存在しません。(受験番号: 9999X999)</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td style="text-align: left; padding-left: 20px;">正常に取込ました。(受験番号: 2610A003)</td>
                    </tr>
                `;

                // Add to history
                const now = new Date();
                const dateTimeStr = now.getFullYear() + '/' + 
                                    String(now.getMonth() + 1).padStart(2, '0') + '/' + 
                                    String(now.getDate()).padStart(2, '0') + ' ' + 
                                    String(now.getHours()).padStart(2, '0') + ':' + 
                                    String(now.getMinutes()).padStart(2, '0');
                
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${dateTimeStr}</td>
                    <td style="text-align: left; padding-left: 12px;"><a href="#" style="color: var(--admin-link-blue); text-decoration: underline;">${selectedFile.name}</a></td>
                    <td>3</td>
                `;
                
                historyTbody.insertBefore(newRow, historyTbody.firstChild);
                
                alert('取込処理が完了しました。取込結果を確認してください。');

                // Clear input
                fileInput.value = '';
                selectedFile = null;
                filenameDiv.textContent = '選択されていません';
                filenameDiv.classList.remove('has-file');
            }
        });
    }
});
