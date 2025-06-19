const { ipcRenderer } = require('electron');

class TranslateApp {
  constructor() {
    this.inputTextarea = document.getElementById('englishText');
    this.outputTextarea = document.getElementById('japaneseText');
    this.inputLabel = document.querySelector('.input-section .language-selector label');
    this.outputLabel = document.querySelector('.output-section .language-selector label');
    this.clearBtn = document.getElementById('clearBtn');
    this.loading = document.getElementById('loading');
    this.translateTimeout = null;

    // 翻訳方向の状態
    this.currentDirection = 'en-ja'; // 'en-ja' または 'ja-en'

    this.initializeEventListeners();
    this.setupIPC();
  }

  initializeEventListeners() {
    this.clearBtn.addEventListener('click', () => this.clearText());

    this.inputTextarea.addEventListener('input', () => {
      this.handleTextInput();
    });

    this.inputTextarea.focus();
  }

  setupIPC() {
    // メインプロセスからのテキスト設定要求を受信
    ipcRenderer.on('set-input-text', (_, text) => {
      this.setInputText(text);
    });
  }

  setInputText(text) {
    // 左側のペイン（入力エリア）にテキストを設定
    this.inputTextarea.value = text;
    this.inputTextarea.focus();

    // テキスト入力処理をトリガー（翻訳を開始）
    this.handleTextInput();
  }

  // 言語を検出する関数
  detectLanguage(text) {
    // 日本語の文字（ひらがな、カタカナ、漢字）を含むかチェック
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
    return japaneseRegex.test(text) ? 'ja' : 'en';
  }

  // UIを更新する関数
  updateUI(inputLang, outputLang) {
    const labels = {
      'en': '英語',
      'ja': '日本語'
    };

    const placeholders = {
      'en': '英語のテキストを入力してください...',
      'ja': '日本語のテキストを入力してください...'
    };

    this.inputLabel.textContent = labels[inputLang];
    this.outputLabel.textContent = labels[outputLang];
    this.inputTextarea.placeholder = placeholders[inputLang];
    this.outputTextarea.placeholder = '翻訳結果が表示されます...';
  }

  handleTextInput() {
    const text = this.inputTextarea.value.trim();

    if (this.translateTimeout) {
      clearTimeout(this.translateTimeout);
    }

    if (text.length > 0) {
      // 言語を検出
      const detectedLang = this.detectLanguage(text);
      const newDirection = detectedLang === 'ja' ? 'ja-en' : 'en-ja';

      // 翻訳方向が変わった場合はUIを更新
      if (newDirection !== this.currentDirection) {
        this.currentDirection = newDirection;
        const [inputLang, outputLang] = newDirection.split('-');
        this.updateUI(inputLang, outputLang);
      }

      this.translateTimeout = setTimeout(() => {
        this.translateText();
      }, 1000);
    } else {
      this.outputTextarea.value = '';
    }
  }

  async translateText() {
    const text = this.inputTextarea.value.trim();

    if (!text) {
      return;
    }

    this.showLoading(true);

    try {
      const translatedText = await this.callGoogleTranslate(text);
      this.outputTextarea.value = translatedText;
      this.outputTextarea.style.color = '#475569';
    } catch (error) {
      console.error('Translation error:', error);
      this.showError('翻訳に失敗しました。インターネット接続を確認してください。');
    } finally {
      this.showLoading(false);
    }
  }

  async callGoogleTranslate(text) {
    const [sourceLang, targetLang] = this.currentDirection.split('-');

    const url = 'https://translate.googleapis.com/translate_a/single';
    const params = new URLSearchParams({
      client: 'gtx',
      sl: sourceLang,
      tl: targetLang,
      dt: 't',
      q: text
    });

    const response = await fetch(`${url}?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data[0] || !Array.isArray(data[0])) {
      throw new Error('Invalid response format');
    }

    return data[0].map(item => item[0]).join('');
  }

  clearText() {
    this.inputTextarea.value = '';
    this.outputTextarea.value = '';
    this.outputTextarea.style.color = '#475569';

    // 初期状態（英語→日本語）に戻す
    this.currentDirection = 'en-ja';
    this.updateUI('en', 'ja');

    this.inputTextarea.focus();

    if (this.translateTimeout) {
      clearTimeout(this.translateTimeout);
    }
  }

  showLoading(show) {
    if (show) {
      this.loading.classList.remove('hidden');
    } else {
      this.loading.classList.add('hidden');
    }
  }

  showError(message) {
    this.outputTextarea.value = `エラー: ${message}`;
    this.outputTextarea.style.color = '#f44336';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TranslateApp();
});