import { describe, it, expect } from 'vitest';
import { 
  buildTranslateUrl, 
  parseTranslateResponse, 
  getLanguagePair, 
  isTranslatable 
} from './translateUtils.js';

describe('translateUtils', () => {
  describe('buildTranslateUrl', () => {
    it('正しいGoogle Translate URLを構築する', () => {
      const url = buildTranslateUrl('Hello', 'en', 'ja');
      expect(url).toContain('https://translate.googleapis.com/translate_a/single');
      expect(url).toContain('client=gtx');
      expect(url).toContain('sl=en');
      expect(url).toContain('tl=ja');
      expect(url).toContain('dt=t');
      expect(url).toContain('q=Hello');
    });

    it('日本語テキストのURLを正しく構築する', () => {
      const url = buildTranslateUrl('こんにちは', 'ja', 'en');
      expect(url).toContain('sl=ja');
      expect(url).toContain('tl=en');
      expect(url).toContain('q=%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF'); // URLエンコードされた「こんにちは」
    });

    it('特殊文字を含むテキストを正しく処理する', () => {
      const url = buildTranslateUrl('Hello & World!', 'en', 'ja');
      expect(url).toContain('q=Hello+%26+World%21');
    });
  });

  describe('parseTranslateResponse', () => {
    it('正常なレスポンスを正しく解析する', () => {
      const mockResponse = [
        [
          ['こんにちは', 'Hello', null, null, 0],
          ['世界', 'World', null, null, 0]
        ]
      ];
      
      const result = parseTranslateResponse(mockResponse);
      expect(result).toBe('こんにちは世界');
    });

    it('単一の翻訳結果を正しく解析する', () => {
      const mockResponse = [
        [
          ['Hello', 'こんにちは', null, null, 0]
        ]
      ];
      
      const result = parseTranslateResponse(mockResponse);
      expect(result).toBe('Hello');
    });

    it('無効なレスポンス形式でエラーを投げる', () => {
      expect(() => parseTranslateResponse(null)).toThrow('Invalid response format');
      expect(() => parseTranslateResponse([])).toThrow('Invalid response format');
      expect(() => parseTranslateResponse([null])).toThrow('Invalid response format');
      expect(() => parseTranslateResponse([{}])).toThrow('Invalid response format');
    });

    it('空のレスポンス配列を処理する', () => {
      const mockResponse = [[]];
      const result = parseTranslateResponse(mockResponse);
      expect(result).toBe('');
    });
  });

  describe('getLanguagePair', () => {
    it('正しく言語ペアを分割する', () => {
      expect(getLanguagePair('en-ja')).toEqual(['en', 'ja']);
      expect(getLanguagePair('ja-en')).toEqual(['ja', 'en']);
    });

    it('異なる言語ペアを処理する', () => {
      expect(getLanguagePair('fr-de')).toEqual(['fr', 'de']);
      expect(getLanguagePair('zh-ko')).toEqual(['zh', 'ko']);
    });
  });

  describe('isTranslatable', () => {
    it('翻訳可能なテキストでtrueを返す', () => {
      expect(isTranslatable('Hello')).toBe(true);
      expect(isTranslatable('こんにちは')).toBe(true);
      expect(isTranslatable('123')).toBe(true);
      expect(isTranslatable('Hello World')).toBe(true);
    });

    it('翻訳不可能なテキストでfalseを返す', () => {
      expect(isTranslatable('')).toBe(false);
      expect(isTranslatable('   ')).toBe(false);
      expect(isTranslatable(null)).toBe(false);
      expect(isTranslatable(undefined)).toBe(false);
    });

    it('非文字列の値でfalseを返す', () => {
      expect(isTranslatable(123)).toBe(false);
      expect(isTranslatable([])).toBe(false);
      expect(isTranslatable({})).toBe(false);
      expect(isTranslatable(true)).toBe(false);
    });

    it('空白のみのテキストでfalseを返す', () => {
      expect(isTranslatable('  \n  \t  ')).toBe(false);
      expect(isTranslatable('\n\r\t')).toBe(false);
    });
  });
});