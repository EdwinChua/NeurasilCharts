import { Utils } from './utils';

describe('Utils', () => {

  describe('hexToRgba', () => {
    it('should convert a 6-digit hex colour to rgba with default alpha 1', () => {
      expect(Utils.hexToRgba('#ff0000')).toBe('rgba(255, 0, 0, 1)');
    });

    it('should convert a 3-digit hex colour to rgba', () => {
      expect(Utils.hexToRgba('#f00')).toBe('rgba(255, 0, 0, 1)');
    });

    it('should apply a custom alpha value', () => {
      expect(Utils.hexToRgba('#0000ff', 0.5)).toBe('rgba(0, 0, 255, 0.5)');
    });

    it('should handle #000000 (black)', () => {
      expect(Utils.hexToRgba('#000000')).toBe('rgba(0, 0, 0, 1)');
    });

    it('should handle #ffffff (white)', () => {
      expect(Utils.hexToRgba('#ffffff')).toBe('rgba(255, 255, 255, 1)');
    });

    it('should handle a mixed-case hex string', () => {
      expect(Utils.hexToRgba('#aAbBcC')).toBe('rgba(170, 187, 204, 1)');
    });

    it('should handle alpha of 0', () => {
      expect(Utils.hexToRgba('#ff0000', 0)).toBe('rgba(255, 0, 0, 0)');
    });
  });

  describe('rgbToRgba', () => {
    it('should convert an rgb string to rgba with default opacity 1', () => {
      expect(Utils.rgbToRgba('rgb(255, 0, 0)')).toBe('rgba(255, 0, 0, 1)');
    });

    it('should convert an rgb string to rgba with a custom opacity', () => {
      expect(Utils.rgbToRgba('rgb(0, 128, 255)', 0.5)).toBe('rgba(0, 128, 255, 0.5)');
    });

    it('should override the existing alpha when given an rgba string', () => {
      expect(Utils.rgbToRgba('rgba(100, 200, 50, 0.9)', 0.3)).toBe('rgba(100, 200, 50, 0.3)');
    });

    it('should handle opacity 0', () => {
      expect(Utils.rgbToRgba('rgb(255, 255, 255)', 0)).toBe('rgba(255, 255, 255, 0)');
    });
  });

  describe('colorIsHex', () => {
    it('should return truthy for a valid 6-digit hex', () => {
      expect(Utils.colorIsHex('#1a2b3c')).toBeTruthy();
    });

    it('should return truthy for a valid 3-digit hex', () => {
      expect(Utils.colorIsHex('#abc')).toBeTruthy();
    });

    it('should return truthy for an uppercase 6-digit hex', () => {
      expect(Utils.colorIsHex('#AABBCC')).toBeTruthy();
    });

    it('should return falsy for an rgb string', () => {
      expect(Utils.colorIsHex('rgb(255,0,0)')).toBeFalsy();
    });

    it('should return falsy for a plain colour name', () => {
      expect(Utils.colorIsHex('red')).toBeFalsy();
    });

    it('should return falsy for a hex without a leading #', () => {
      expect(Utils.colorIsHex('ff0000')).toBeFalsy();
    });

    it('should return falsy for an invalid hex character', () => {
      expect(Utils.colorIsHex('#gg0000')).toBeFalsy();
    });

    it('should return falsy for a hex that is too short (2 digits)', () => {
      expect(Utils.colorIsHex('#ff')).toBeFalsy();
    });
  });

});
