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

    // Handle File Input Change
    function handleFileInput(inputId, filenameId) {
        const input = document.getElementById(inputId);
        const filenameDiv = document.getElementById(filenameId);
        
        if (input && filenameDiv) {
            input.addEventListener('change', function(e) {
                if (e.target.files && e.target.files.length > 0) {
                    filenameDiv.textContent = e.target.files[0].name;
                    filenameDiv.classList.add('has-file');
                } else {
                    filenameDiv.textContent = '選択されていません';
                    filenameDiv.classList.remove('has-file');
                }
            });
        }
    }

    handleFileInput('credit-csv', 'credit-filename');
    handleFileInput('convenience-csv', 'conv-filename');
    handleFileInput('payeasy-csv', 'payeasy-filename');

    const executeBtn = document.getElementById('btn-execute');
    if (executeBtn) {
        executeBtn.addEventListener('click', function () {
            
            const creditCsv = document.getElementById('credit-csv').value;
            const convCsv = document.getElementById('convenience-csv').value;
            const payeasyCsv = document.getElementById('payeasy-csv').value;

            if (!creditCsv && !convCsv && !payeasyCsv) {
                alert('出力するデータを指定してください。');
                return;
            }

            if (confirm('指定したデータを出力しますか？')) {
                alert('出力処理を開始しました。（デモ）');
                
                // Clear inputs
                document.getElementById('credit-csv').value = '';
                document.getElementById('convenience-csv').value = '';
                document.getElementById('payeasy-csv').value = '';
                
                document.getElementById('credit-filename').textContent = '選択されていません';
                document.getElementById('credit-filename').classList.remove('has-file');
                document.getElementById('conv-filename').textContent = '選択されていません';
                document.getElementById('conv-filename').classList.remove('has-file');
                document.getElementById('payeasy-filename').textContent = '選択されていません';
                document.getElementById('payeasy-filename').classList.remove('has-file');
            }
        });
    }
});
