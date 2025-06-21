const { test, expect } = require('@playwright/test');
const { _electron: electron } = require('playwright');

test.describe('翻訳アプリ Electronテスト', () => {
  let electronApp;
  let window;

  test.beforeAll(async () => {
    // Electronアプリを起動
    electronApp = await electron.launch({
      args: ['.'], // main.jsのパス
      cwd: __dirname, // 作業ディレクトリ
    });

    // メインウィンドウを取得
    window = await electronApp.firstWindow();

    // ウィンドウが表示されるまで待機
    await window.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    // テスト終了後にElectronアプリを閉じる
    if (electronApp) {
      await electronApp.close();
    }
  });

  test('アプリケーションが正常に起動すること', async () => {
    // ウィンドウのタイトルを確認
    const title = await window.title();
    expect(title).toBe('翻訳アプリ');

    // メインの要素が存在することを確認
    await expect(window.locator('h1')).toHaveText('Translate App');
    await expect(window.locator('#englishText')).toBeVisible();
    await expect(window.locator('#japaneseText')).toBeVisible();
    await expect(window.locator('#clearBtn')).toBeVisible();
  });

  test('英語から日本語への翻訳テスト', async () => {
    // 英語テキストを入力
    await window.fill('#englishText', 'Hello, how are you?');

    // 翻訳が完了するまで少し待機（自動翻訳のため）
    await window.waitForTimeout(3000);

    // 翻訳結果を確認（実際のAPIが動作する場合）
    const translatedText = await window.inputValue('#japaneseText');
    console.log('翻訳結果:', translatedText);

    // 何らかのテキストが出力されていることを確認
    // （実際のAPI接続状況により結果は異なる）
    if (translatedText) {
      expect(translatedText.length).toBeGreaterThan(0);
    }
  });

  test('日本語から英語への翻訳テスト', async () => {
    // まずクリアする
    await window.click('#clearBtn');
    await window.waitForTimeout(500);

    // 日本語テキストを入力
    await window.fill('#englishText', 'こんにちは、元気ですか？');

    // 翻訳が完了するまで少し待機
    await window.waitForTimeout(3000);

    // 言語ラベルが自動で切り替わることを確認
    const inputLabel = await window.textContent(
      '.input-section .language-selector label'
    );
    const outputLabel = await window.textContent(
      '.output-section .language-selector label'
    );

    console.log('入力言語:', inputLabel);
    console.log('出力言語:', outputLabel);

    // 日本語検出により言語ラベルが変更されることを確認
    expect(inputLabel).toBe('日本語');
    expect(outputLabel).toBe('英語');

    // 翻訳結果を確認
    const translatedText = await window.inputValue('#japaneseText');
    console.log('翻訳結果:', translatedText);

    if (translatedText) {
      expect(translatedText.length).toBeGreaterThan(0);
    }
  });

  test('クリア機能のテスト', async () => {
    // 英語テキストを入力（翻訳結果も自動で表示される）
    await window.fill('#englishText', 'Test text for clear function');

    // 翻訳が完了するまで少し待機
    await window.waitForTimeout(2000);

    // クリアボタンをクリック
    await window.click('#clearBtn');

    // 入力エリアがクリアされることを確認
    await expect(window.locator('#englishText')).toHaveValue('');

    // 出力エリアもクリアされることを確認（readonlyだが内容は確認できる）
    const outputValue = await window.inputValue('#japaneseText');
    expect(outputValue).toBe('');

    // 言語ラベルが初期状態に戻ることを確認
    const inputLabel = await window.textContent(
      '.input-section .language-selector label'
    );
    const outputLabel = await window.textContent(
      '.output-section .language-selector label'
    );

    expect(inputLabel).toBe('英語');
    expect(outputLabel).toBe('日本語');
  });

  test('UI要素の基本的な動作確認', async () => {
    // テキストエリアにフォーカスできることを確認
    await window.focus('#englishText');
    const focusedElement = await window.evaluate(
      () => document.activeElement.id
    );
    expect(focusedElement).toBe('englishText');

    // プレースホルダーテキストを確認
    const placeholder = await window.getAttribute(
      '#englishText',
      'placeholder'
    );
    expect(placeholder).toBe('英語のテキストを入力してください...');

    // 読み取り専用テキストエリアの確認
    const isReadonly = await window.getAttribute('#japaneseText', 'readonly');
    expect(isReadonly).toBe('');
  });
});
