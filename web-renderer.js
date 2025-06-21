// Web版用のレンダラー（Electron APIを使わない版）
import { 
  detectLanguage, 
  getTranslationDirection, 
  getLanguageDisplayName, 
  getPlaceholderText 
} from './src/utils/languageUtils.mjs';
import { 
  buildTranslateUrl, 
  parseTranslateResponse, 
  getLanguagePair, 
  isTranslatable 
} from './src/utils/translateUtils.mjs';

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
        
        // Web版では IPC 機能は使用しない
        console.log('Web版翻訳アプリが初期化されました');
    }
    
    initializeEventListeners() {
        this.clearBtn.addEventListener('click', () => this.clearText());
        
        this.inputTextarea.addEventListener('input', () => {
            this.handleTextInput();
        });
        
        this.inputTextarea.focus();
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
        
        // Web版では直接Google Translate APIを呼び出す
        // CORS制限を回避するため、プロキシサーバーまたはサーバーサイド実装が必要
        // ここでは簡易的な実装を示す
        try {
            const url = buildTranslateUrl(text, sourceLang, targetLang);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return parseTranslateResponse(data);
        } catch (error) {
            // フォールバック: 簡易的な翻訳（デモ用）
            console.warn('Google Translate API失敗、デモ翻訳を使用:', error);
            return this.getDemoTranslation(text, sourceLang, targetLang);
        }
    }
    
    // デモ用の簡易翻訳（本格的な翻訳APIが使えない場合のフォールバック）
    getDemoTranslation(text, sourceLang, targetLang) {
        const demoTranslations = {
            'en-ja': {
                'hello': 'こんにちは',
                'hello, how are you?': 'こんにちは、元気ですか？',
                'good morning': 'おはようございます',
                'thank you': 'ありがとうございます',
                'goodbye': 'さようなら'
            },
            'ja-en': {
                'こんにちは': 'Hello',
                'こんにちは、元気ですか？': 'Hello, how are you?',
                'おはようございます': 'Good morning',
                'ありがとうございます': 'Thank you',
                'さようなら': 'Goodbye'
            }
        };
        
        const direction = `${sourceLang}-${targetLang}`;
        const translations = demoTranslations[direction] || {};
        const lowerText = text.toLowerCase();
        
        return translations[lowerText] || translations[text] || `[翻訳結果: ${text}]`;
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

// Web版では DOMContentLoaded で初期化
document.addEventListener('DOMContentLoaded', () => {
    new TranslateApp();
});