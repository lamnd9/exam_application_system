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

    // Handle Import Button Click
    const importBtn = document.getElementById('btn-import');
    const docLinkInput = document.getElementById('doc-link');
    const importTbody = document.getElementById('import-tbody');

    if (importBtn) {
        importBtn.addEventListener('click', function () {
            const link = docLinkInput.value.trim();
            if (!link) {
                alert('書類データリンクを入力してください。');
                return;
            }

            if (!link.startsWith('http://') && !link.startsWith('https://')) {
                alert('有効なURL（http:// 又は https:// で始まる）を入力してください。');
                return;
            }

            if (confirm('入力されたリンクで書類データを取込ますか？')) {
                // Add dummy row to table
                const newRow = document.createElement('tr');
                const now = new Date();
                const dateTimeStr = now.getFullYear() + '/' + 
                                    String(now.getMonth() + 1).padStart(2, '0') + '/' + 
                                    String(now.getDate()).padStart(2, '0') + ' ' + 
                                    String(now.getHours()).padStart(2, '0') + ':' + 
                                    String(now.getMinutes()).padStart(2, '0');

                newRow.innerHTML = `
                    <td style="text-align: left; font-weight: 600;">入学手続要項</td>
                    <td style="text-align: left;">
                        <div style="color: var(--admin-link-blue);">総合型選抜 AO入試（専願型）</div>
                        <div style="color: #666; font-size: 10px;">なし</div>
                    </td>
                    <td style="text-align: left;">
                        <div>心理学部</div>
                        <div style="color: #666; font-size: 10px;">心理学科</div>
                    </td>
                    <td>合格</td>
                    <td>${dateTimeStr}</td>
                    <td><button type="button" class="btn-preview" onclick="window.open('${link}', '_blank')">プレビュー</button></td>
                    <td><button type="button" class="btn-delete" onclick="if(confirm('削除しますか？')) this.closest('tr').remove();">削除</button></td>
                `;

                importTbody.insertBefore(newRow, importTbody.firstChild);
                
                // Clear input
                docLinkInput.value = '';
                alert('書類データを正常に取込ました。');
            }
        });
    }

    // Attach events to existing dummy rows
    const deleteBtns = document.querySelectorAll('.btn-delete');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if(confirm('削除しますか？')) {
                this.closest('tr').remove();
            }
        });
    });
});
