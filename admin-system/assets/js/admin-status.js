document.addEventListener('DOMContentLoaded', function () {

    // ===== Button handlers =====

    const paymentCancelBtn = document.getElementById('btn-payment-cancel');
    if (paymentCancelBtn) {
        paymentCancelBtn.addEventListener('click', function () {
            if (confirm('入金取消を実行しますか？')) {
                alert('入金取消を実行しました。（デモ）');
            }
        });
    }

    const photoReregisterBtn = document.getElementById('btn-photo-reregister');
    if (photoReregisterBtn) {
        photoReregisterBtn.addEventListener('click', function () {
            if (confirm('顔写真再登録を開始しますか？')) {
                alert('顔写真再登録を開始しました。（デモ）');
            }
        });
    }

    const fixStartBtn = document.getElementById('btn-fix-start');
    if (fixStartBtn) {
        fixStartBtn.addEventListener('click', function () {
            if (confirm('手続修正開始を実行しますか？')) {
                alert('手続修正開始を実行しました。（デモ）');
            }
        });
    }

    const appCancelBtn = document.getElementById('btn-app-cancel');
    if (appCancelBtn) {
        appCancelBtn.addEventListener('click', function () {
            if (confirm('出願取消を実行しますか？この操作は取り消せません。')) {
                alert('出願取消を実行しました。（デモ）');
            }
        });
    }

    const deleteRecordBtn = document.getElementById('btn-delete-record');
    if (deleteRecordBtn) {
        deleteRecordBtn.addEventListener('click', function () {
            if (confirm('この試験記録を削除しますか？')) {
                alert('削除しました。（デモ）');
            }
        });
    }

    const deficiencyBtn = document.getElementById('btn-deficiency');
    if (deficiencyBtn) {
        deficiencyBtn.addEventListener('click', function () {
            alert('不備登録画面へ移動します。（デモ）');
        });
    }

    const passBtn = document.getElementById('btn-pass');
    if (passBtn) {
        passBtn.addEventListener('click', function () {
            alert('詳遇処理を実行します。（デモ）');
        });
    }
});
