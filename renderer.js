const { ipcRenderer } = require('electron');
const { 
  detectLanguage, 
  getTranslationDirection, 
  getLanguageDisplayName, 
  getPlaceholderText 
} = require('./src/utils/languageUtils.js');
const { 
  buildTranslateUrl, 
  parseTranslateResponse, 
  getLanguagePair, 
  isTranslatable 
} = require('./src/utils/translateUtils.js');

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

  // UIを更新する関数
  updateUI(inputLang, outputLang) {
    this.inputLabel.textContent = getLanguageDisplayName(inputLang);
    this.outputLabel.textContent = getLanguageDisplayName(outputLang);
    this.inputTextarea.placeholder = getPlaceholderText(inputLang);
    this.outputTextarea.placeholder = '翻訳結果が表示されます...';
  }

  handleTextInput() {
    const text = this.inputTextarea.value.trim();

    if (this.translateTimeout) {
      clearTimeout(this.translateTimeout);
    }

    if (isTranslatable(text)) {
      // 言語を検出
      const detectedLang = detectLanguage(text);
      const newDirection = getTranslationDirection(detectedLang);

      // 翻訳方向が変わった場合はUIを更新
      if (newDirection !== this.currentDirection) {
        this.currentDirection = newDirection;
        const [inputLang, outputLang] = getLanguagePair(newDirection);
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

    if (!isTranslatable(text)) {
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
    const [sourceLang, targetLang] = getLanguagePair(this.currentDirection);
    const url = buildTranslateUrl(text, sourceLang, targetLang);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return parseTranslateResponse(data);
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