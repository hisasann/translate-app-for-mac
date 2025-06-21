/**
 * 言語検出ユーティリティ関数
 */

/**
 * テキストに含まれる言語を検出する
 * @param {string} text - 検出対象のテキスト
 * @returns {string} 'ja' または 'en'
 */
function detectLanguage(text) {
  // 日本語の文字（ひらがな、カタカナ、漢字）を含むかチェック
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  return japaneseRegex.test(text) ? 'ja' : 'en';
}

/**
 * 翻訳方向を決定する
 * @param {string} detectedLang - 検出された言語
 * @returns {string} 'en-ja' または 'ja-en'
 */
function getTranslationDirection(detectedLang) {
  return detectedLang === 'ja' ? 'ja-en' : 'en-ja';
}

/**
 * 言語コードを日本語表示名に変換する
 * @param {string} langCode - 言語コード ('en' または 'ja')
 * @returns {string} 日本語での言語名
 */
function getLanguageDisplayName(langCode) {
  const labels = {
    'en': '英語',
    'ja': '日本語'
  };
  return labels[langCode] || langCode;
}

/**
 * 言語に応じたプレースホルダーテキストを取得する
 * @param {string} langCode - 言語コード ('en' または 'ja')
 * @returns {string} プレースホルダーテキスト
 */
function getPlaceholderText(langCode) {
  const placeholders = {
    'en': '英語のテキストを入力してください...',
    'ja': '日本語のテキストを入力してください...'
  };
  return placeholders[langCode] || 'テキストを入力してください...';
}

module.exports = {
  detectLanguage,
  getTranslationDirection,
  getLanguageDisplayName,
  getPlaceholderText
};