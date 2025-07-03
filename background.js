// リロード間隔（ミリ秒単位、例: 5秒ごとにリロード）
let reloadInterval = 5000; // デフォルト5秒
let timerId = null;
let reloadEnabled = true;

function reloadActiveTab() {
  if (!reloadEnabled) return;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs.length > 0) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
}

function startReloadTimer() {
  if (timerId) clearInterval(timerId);
  timerId = setInterval(reloadActiveTab, reloadInterval);
}

// ストレージから間隔と有効状態を取得
chrome.storage.local.get(['reloadInterval', 'reloadEnabled'], function(result) {
  if (result.reloadInterval) {
    reloadInterval = result.reloadInterval * 1000;
  }
  reloadEnabled = result.reloadEnabled !== false;
  startReloadTimer();
});

// ポップアップからのメッセージで間隔・有効状態変更
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'intervalChanged') {
    chrome.storage.local.get(['reloadInterval'], function(result) {
      if (result.reloadInterval) {
        reloadInterval = result.reloadInterval * 1000;
        startReloadTimer();
      }
    });
  } else if (message.type === 'enabledChanged') {
    chrome.storage.local.get(['reloadEnabled'], function(result) {
      reloadEnabled = result.reloadEnabled !== false;
      startReloadTimer();
    });
  }
}); 