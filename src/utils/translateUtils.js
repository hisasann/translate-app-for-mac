/**
 * 翻訳API関連のユーティリティ関数
 */

/**
 * Google Translate APIのURLとパラメータを構築する
 * @param {string} text - 翻訳するテキスト
 * @param {string} sourceLang - 元言語 ('en' または 'ja')
 * @param {string} targetLang - 翻訳先言語 ('en' または 'ja')
 * @returns {string} 完全なAPI URL
 */
function buildTranslateUrl(text, sourceLang, targetLang) {
  const baseUrl = 'https://translate.googleapis.com/translate_a/single';
  const params = new URLSearchParams({
    client: 'gtx',
    sl: sourceLang,
    tl: targetLang,
    dt: 't',
    q: text
  });
  return `${baseUrl}?${params}`;
}

/**
 * Google Translate APIのレスポンスを解析する
 * @param {Array} responseData - APIからのレスポンスデータ
 * @returns {string} 翻訳されたテキスト
 * @throws {Error} レスポンス形式が無効な場合
 */
function parseTranslateResponse(responseData) {
  if (!responseData || !responseData[0] || !Array.isArray(responseData[0])) {
    throw new Error('Invalid response format');
  }
  
  return responseData[0].map(item => item[0]).join('');
}

/**
 * 翻訳方向から言語ペアを取得する
 * @param {string} direction - 翻訳方向 ('en-ja' または 'ja-en')
 * @returns {Array<string>} [sourceLang, targetLang]
 */
function getLanguagePair(direction) {
  return direction.split('-');
}

/**
 * テキストが翻訳可能かどうかをチェックする
 * @param {string} text - チェックするテキスト
 * @returns {boolean} 翻訳可能な場合true
 */
function isTranslatable(text) {
  return !!(text && typeof text === 'string' && text.trim().length > 0);
}

module.exports = {
  buildTranslateUrl,
  parseTranslateResponse,
  getLanguagePair,
  isTranslatable
};