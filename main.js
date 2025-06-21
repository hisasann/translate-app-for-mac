const {
  app,
  BrowserWindow,
  globalShortcut,
  clipboard,
  ipcMain,
} = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: 'default',
    title: 'Translate App',
  });

  mainWindow.loadFile('index.html');

  // グローバルホットキーの設定
  setupGlobalShortcuts();
}

function setupGlobalShortcuts() {
  // Command + Shift + C のグローバルショートカットを登録（翻訳用）
  globalShortcut.register('Cmd+Shift+C', () => {
    handleTranslateSelection();
  });
}

async function handleTranslateSelection() {
  try {
    console.log('翻訳ショートカットが押されました');

    // 現在のクリップボード内容を取得
    const currentClipboard = clipboard.readText();
    console.log('現在のクリップボード:', currentClipboard);

    // クリップボードの内容があれば、それを翻訳アプリに送る
    if (currentClipboard && currentClipboard.trim()) {
      console.log(
        'クリップボードのテキストを翻訳アプリに送信:',
        currentClipboard
      );

      // アプリをフォアグラウンドに持ってくる
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();

        // テキストを左側のペインに設定
        setTimeout(() => {
          mainWindow.webContents.send('set-input-text', currentClipboard);
        }, 100);
      }
    } else {
      console.log(
        'クリップボードが空です。事前にテキストをコピーしてください。'
      );
    }
  } catch (error) {
    console.error('Error in handleTranslateSelection:', error);
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  // グローバルショートカットを全て解除
  globalShortcut.unregisterAll();
});
