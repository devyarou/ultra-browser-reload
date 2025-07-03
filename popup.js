document.addEventListener('DOMContentLoaded', function() {
  const intervalInput = document.getElementById('interval');
  const status = document.getElementById('status');
  const enabledCheckbox = document.getElementById('enabled');
  // 保存されている値を読み込む
  chrome.storage.local.get(['reloadInterval', 'reloadEnabled'], function(result) {
    if (result.reloadInterval) {
      intervalInput.value = result.reloadInterval;
    }
    enabledCheckbox.checked = result.reloadEnabled !== false; // デフォルトON
  });
  // リロード間隔の即時保存
  intervalInput.addEventListener('input', function() {
    const value = parseInt(intervalInput.value, 10);
    if (isNaN(value) || value < 1) {
      status.textContent = '1秒以上の値を入力してください';
      status.style.color = 'red';
      return;
    }
    chrome.storage.local.set({reloadInterval: value}, function() {
      status.textContent = '保存しました';
      status.style.color = 'green';
      chrome.runtime.sendMessage({type: 'intervalChanged'});
    });
  });
  // オンオフ切り替え
  enabledCheckbox.addEventListener('change', function() {
    chrome.storage.local.set({reloadEnabled: enabledCheckbox.checked}, function() {
      chrome.runtime.sendMessage({type: 'enabledChanged'});
    });
  });
}); 