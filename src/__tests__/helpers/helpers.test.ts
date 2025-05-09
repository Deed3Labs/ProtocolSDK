// Add BigInt serialization support
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

import { expect } from '@jest/globals';
import {
  formatAmount,
  parseAmount,
  formatAddress,
  ipfsToHttp,
  httpToIpfs,
  formatTimestamp,
  calculateGasPrice,
  formatTxHash,
  bytesToHex,
  hexToBytes,
  formatErrorMessage,
  retryWithBackoff,
  isInRange,
  formatNumber,
  truncateString,
  toPercentage,
  sleep,
  isValidJSON,
  deepClone,
  deepMerge
} from '../../utils/helpers';
import { ValidationError } from '../../types/errors';

describe('Helper Utilities', () => {
  describe('formatAmount', () => {
    it('should format amount with decimals', () => {
      expect(formatAmount(BigInt('1000000000000000000'), 18)).toBe('1.0');
      expect(formatAmount(BigInt('1234567890000000000'), 18)).toBe('1.23456789');
      expect(formatAmount(BigInt('0'), 18)).toBe('0.0');
      expect(formatAmount(BigInt('1000000'), 6)).toBe('1.0');
    });

    it('should handle negative amounts', () => {
      expect(formatAmount(BigInt('-1000000000000000000'), 18)).toBe('-1.0');
      expect(formatAmount(BigInt('-1234567890000000000'), 18)).toBe('-1.23456789');
    });
  });

  describe('parseAmount', () => {
    it('should parse string amount to bigint', () => {
      expect(parseAmount('1.0', 18)).toBe(BigInt('1000000000000000000'));
      expect(parseAmount('1.23456789', 18)).toBe(BigInt('1234567890000000000'));
      expect(parseAmount('0.0', 18)).toBe(BigInt('0'));
      expect(parseAmount('0.001', 6)).toBe(BigInt('1000'));
    });

    it('should handle negative amounts', () => {
      expect(parseAmount('-1.0', 18)).toBe(BigInt('-1000000000000000000'));
      expect(parseAmount('-1.23456789', 18)).toBe(BigInt('-1234567890000000000'));
    });

    it('should throw error for invalid input', () => {
      expect(() => parseAmount('invalid', 18)).toThrow();
      expect(() => parseAmount('1.2.3', 18)).toThrow();
    });
  });

  describe('formatAddress', () => {
    it('should format address correctly', () => {
      expect(formatAddress('0x1234567890123456789012345678901234567890'))
        .toBe('0x1234...7890');
    });

    it('should throw error for invalid address', () => {
      expect(() => formatAddress('invalid')).toThrow(ValidationError);
      expect(() => formatAddress('0x123')).toThrow(ValidationError);
      expect(() => formatAddress('0x12345678901234567890123456789012345678901')).toThrow(ValidationError);
    });
  });

  describe('ipfsToHttp', () => {
    it('should convert IPFS hash to HTTP URL', () => {
      expect(ipfsToHttp('ipfs://QmTest'))
        .toBe('https://ipfs.io/ipfs/QmTest');
    });

    it('should throw error for invalid IPFS hash', () => {
      expect(() => ipfsToHttp('invalid')).toThrow(ValidationError);
      expect(() => ipfsToHttp('http://invalid')).toThrow(ValidationError);
    });
  });

  describe('httpToIpfs', () => {
    it('should convert HTTP URL to IPFS hash', () => {
      expect(httpToIpfs('https://ipfs.io/ipfs/QmTest'))
        .toBe('ipfs://QmTest');
    });

    it('should throw error for invalid URL', () => {
      expect(() => httpToIpfs('invalid')).toThrow(ValidationError);
      expect(() => httpToIpfs('ipfs://invalid')).toThrow(ValidationError);
    });
  });

  describe('formatTimestamp', () => {
    it('should format timestamp correctly', () => {
      const timestamp = BigInt(Math.floor(Date.now() / 1000));
      const formatted = formatTimestamp(timestamp);
      expect(new Date(formatted).getTime()).toBe(Number(timestamp) * 1000);
    });

    it('should handle zero timestamp', () => {
      expect(formatTimestamp(BigInt(0))).toBe('1970-01-01T00:00:00.000Z');
    });
  });

  describe('calculateGasPrice', () => {
    it('should calculate gas price with buffer', () => {
      const basePrice = BigInt('1000000000');
      expect(calculateGasPrice(basePrice, 1.1))
        .toBe(BigInt('1100000000'));
      expect(calculateGasPrice(basePrice, 1.5))
        .toBe(BigInt('1500000000'));
    });

    it('should handle zero base price', () => {
      expect(calculateGasPrice(BigInt(0), 1.1)).toBe(BigInt(0));
    });
  });

  describe('formatTxHash', () => {
    it('should format transaction hash correctly', () => {
      const hash = '0x1234567890123456789012345678901234567890123456789012345678901234';
      expect(formatTxHash(hash)).toBe('0x123456...901234');
    });

    it('should throw error for invalid hash', () => {
      expect(() => formatTxHash('invalid')).toThrow(ValidationError);
      expect(() => formatTxHash('0x123')).toThrow(ValidationError);
    });
  });

  describe('bytesToHex and hexToBytes', () => {
    it('should convert between bytes and hex', () => {
      const bytes = new Uint8Array([1, 2, 3, 4]);
      const hex = bytesToHex(bytes);
      expect(hexToBytes(hex)).toEqual(bytes);
    });

    it('should handle empty arrays', () => {
      const bytes = new Uint8Array([]);
      const hex = bytesToHex(bytes);
      expect(hexToBytes(hex)).toEqual(bytes);
    });

    it('should throw error for invalid hex', () => {
      expect(() => hexToBytes('invalid')).toThrow();
      expect(() => hexToBytes('0x123')).toThrow();
    });
  });

  describe('formatErrorMessage', () => {
    it('should format error message with context', () => {
      const error = new Error('Test error');
      expect(formatErrorMessage(error, 'Context')).toBe('Context: Test error');
      expect(formatErrorMessage(error)).toBe('Test error');
    });

    it('should handle errors without message', () => {
      const error = new Error('');
      expect(formatErrorMessage(error, 'Context')).toBe('Context: ');
      expect(formatErrorMessage(error)).toBe('');
    });
  });

  describe('retryWithBackoff', () => {
    it('should retry function with exponential backoff', async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        if (attempts < 3) throw new Error('Test error');
        return 'success';
      };

      const result = await retryWithBackoff(fn, 3, 100);
      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should throw error after max retries', async () => {
      const fn = async () => {
        throw new Error('Test error');
      };

      await expect(retryWithBackoff(fn, 3, 100))
        .rejects.toThrow('Test error');
    });

    it('should handle successful first attempt', async () => {
      const fn = async () => 'success';
      const result = await retryWithBackoff(fn, 3, 100);
      expect(result).toBe('success');
    });
  });

  describe('isInRange', () => {
    it('should check if value is within range', () => {
      expect(isInRange(5, 1, 10)).toBe(true);
      expect(isInRange(0, 1, 10)).toBe(false);
      expect(isInRange(BigInt(5), BigInt(1), BigInt(10))).toBe(true);
      expect(isInRange(5, 10, 1)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isInRange(1, 1, 10)).toBe(true);
      expect(isInRange(10, 1, 10)).toBe(true);
      expect(isInRange(0, 0, 0)).toBe(true);
    });
  });

  describe('formatNumber', () => {
    it('should format number with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(BigInt(1000000))).toBe('1,000,000');
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(-1000)).toBe('-1,000');
    });
  });

  describe('truncateString', () => {
    it('should truncate string to specified length', () => {
      expect(truncateString('test string', 4)).toBe('test...');
      expect(truncateString('test', 4)).toBe('test');
      expect(truncateString('test string', 0)).toBe('...');
    });

    it('should handle empty string', () => {
      expect(truncateString('', 4)).toBe('');
    });
  });

  describe('toPercentage', () => {
    it('should convert number to percentage string', () => {
      expect(toPercentage(0.1234)).toBe('12.34%');
      expect(toPercentage(0.1234, 1)).toBe('12.3%');
      expect(toPercentage(0)).toBe('0.00%');
      expect(toPercentage(1)).toBe('100.00%');
    });

    it('should handle negative numbers', () => {
      expect(toPercentage(-0.1234)).toBe('-12.34%');
      expect(toPercentage(-0.1234, 1)).toBe('-12.3%');
    });
  });

  describe('sleep', () => {
    it('should sleep for specified milliseconds', async () => {
      const start = Date.now();
      await sleep(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(100);
    });

    it('should handle zero delay', async () => {
      const start = Date.now();
      await sleep(0);
      const end = Date.now();
      expect(end - start).toBeLessThan(10);
    });
  });

  describe('isValidJSON', () => {
    it('should check if string is valid JSON', () => {
      expect(isValidJSON('{"test": "value"}')).toBe(true);
      expect(isValidJSON('invalid')).toBe(false);
      expect(isValidJSON('')).toBe(false);
      expect(isValidJSON('null')).toBe(true);
      expect(isValidJSON('123')).toBe(true);
    });
  });

  describe('deepClone', () => {
    it('should deep clone object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const clone = deepClone(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
      expect(clone.b).not.toBe(obj.b);
    });

    it('should handle arrays', () => {
      const arr = [1, { a: 2 }, [3, 4]];
      const clone = deepClone(arr);
      expect(clone).toEqual(arr);
      expect(clone).not.toBe(arr);
      expect(clone[1]).not.toBe(arr[1]);
      expect(clone[2]).not.toBe(arr[2]);
    });

    it('should handle null', () => {
      expect(deepClone(null)).toBe(null);
    });
  });

  describe('deepMerge', () => {
    it('should merge objects deeply', () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { c: 3 }, d: 4 } as Partial<typeof target>;
      const result = deepMerge(target, source);
      expect(result).toEqual({ a: 1, b: { c: 3 }, d: 4 });
    });

    it('should handle nested objects', () => {
      const target = { a: 1, b: { c: 2, d: 3 } };
      const source = { b: { c: 2, d: 4 }, e: 5 } as Partial<typeof target>;
      const result = deepMerge(target, source);
      expect(result).toEqual({ a: 1, b: { c: 2, d: 4 }, e: 5 });
    });

    it('should handle arrays', () => {
      const target = { a: [1, 2], b: { c: [3, 4] } };
      const source = { a: [5, 6], b: { c: [7, 8] } } as Partial<typeof target>;
      const result = deepMerge(target, source);
      expect(result).toEqual({ a: [5, 6], b: { c: [7, 8] } });
    });

    it('should handle null', () => {
      const target = { a: 1, b: null };
      const source = { b: { c: 2 } } as unknown as Partial<typeof target>;
      const result = deepMerge(target, source);
      expect(result).toEqual({ a: 1, b: { c: 2 } });
    });
  });
}); 