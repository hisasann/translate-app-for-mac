import { describe, it, expect } from 'vitest';
import { 
  detectLanguage, 
  getTranslationDirection, 
  getLanguageDisplayName, 
  getPlaceholderText 
} from './languageUtils.js';

describe('languageUtils', () => {
  describe('detectLanguage', () => {
    it('日本語のテキストを正しく検出する', () => {
      expect(detectLanguage('こんにちは')).toBe('ja');
      expect(detectLanguage('カタカナ')).toBe('ja');
      expect(detectLanguage('漢字')).toBe('ja');
      expect(detectLanguage('ひらがなとカタカナと漢字')).toBe('ja');
    });

    it('英語のテキストを正しく検出する', () => {
      expect(detectLanguage('Hello')).toBe('en');
      expect(detectLanguage('Hello World')).toBe('en');
      expect(detectLanguage('123 English text')).toBe('en');
    });

    it('混在テキストでは日本語として検出する', () => {
      expect(detectLanguage('Hello こんにちは')).toBe('ja');
      expect(detectLanguage('英語 English')).toBe('ja');
    });

    it('数字のみのテキストは英語として検出する', () => {
      expect(detectLanguage('123')).toBe('en');
      expect(detectLanguage('12.34')).toBe('en');
    });

    it('記号のみのテキストは英語として検出する', () => {
      expect(detectLanguage('!@#$%')).toBe('en');
      expect(detectLanguage('[]{}()')).toBe('en');
    });

    it('空文字や空白は英語として検出する', () => {
      expect(detectLanguage('')).toBe('en');
      expect(detectLanguage('   ')).toBe('en');
    });
  });

  describe('getTranslationDirection', () => {
    it('日本語の場合は ja-en を返す', () => {
      expect(getTranslationDirection('ja')).toBe('ja-en');
    });

    it('英語の場合は en-ja を返す', () => {
      expect(getTranslationDirection('en')).toBe('en-ja');
    });
  });

  describe('getLanguageDisplayName', () => {
    it('正しい言語表示名を返す', () => {
      expect(getLanguageDisplayName('en')).toBe('英語');
      expect(getLanguageDisplayName('ja')).toBe('日本語');
    });

    it('未知の言語コードはそのまま返す', () => {
      expect(getLanguageDisplayName('unknown')).toBe('unknown');
      expect(getLanguageDisplayName('fr')).toBe('fr');
    });
  });

  describe('getPlaceholderText', () => {
    it('正しいプレースホルダーテキストを返す', () => {
      expect(getPlaceholderText('en')).toBe('英語のテキストを入力してください...');
      expect(getPlaceholderText('ja')).toBe('日本語のテキストを入力してください...');
    });

    it('未知の言語コードにはデフォルトを返す', () => {
      expect(getPlaceholderText('unknown')).toBe('テキストを入力してください...');
    });
  });
});