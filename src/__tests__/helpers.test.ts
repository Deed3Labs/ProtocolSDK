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
} from '../utils/helpers';
import { ValidationError } from '../types/errors';

describe('Helper Utilities', () => {
  describe('formatAmount', () => {
    it('should format amount with decimals', () => {
      expect(formatAmount(BigInt('1000000000000000000'), 18)).toBe('1.0');
      expect(formatAmount(BigInt('1234567890000000000'), 18)).toBe('1.23456789');
    });
  });

  describe('parseAmount', () => {
    it('should parse string amount to bigint', () => {
      expect(parseAmount('1.0', 18)).toBe(BigInt('1000000000000000000'));
      expect(parseAmount('1.23456789', 18)).toBe(BigInt('1234567890000000000'));
    });
  });

  describe('formatAddress', () => {
    it('should format address correctly', () => {
      expect(formatAddress('0x1234567890123456789012345678901234567890'))
        .toBe('0x1234...7890');
    });

    it('should throw error for invalid address', () => {
      expect(() => formatAddress('invalid')).toThrow(ValidationError);
    });
  });

  describe('ipfsToHttp', () => {
    it('should convert IPFS hash to HTTP URL', () => {
      expect(ipfsToHttp('ipfs://QmTest'))
        .toBe('https://ipfs.io/ipfs/QmTest');
    });

    it('should throw error for invalid IPFS hash', () => {
      expect(() => ipfsToHttp('invalid')).toThrow(ValidationError);
    });
  });

  describe('httpToIpfs', () => {
    it('should convert HTTP URL to IPFS hash', () => {
      expect(httpToIpfs('https://ipfs.io/ipfs/QmTest'))
        .toBe('ipfs://QmTest');
    });

    it('should throw error for invalid URL', () => {
      expect(() => httpToIpfs('invalid')).toThrow(ValidationError);
    });
  });

  describe('formatTimestamp', () => {
    it('should format timestamp correctly', () => {
      const timestamp = BigInt(Math.floor(Date.now() / 1000));
      const formatted = formatTimestamp(timestamp);
      expect(new Date(formatted).getTime()).toBe(Number(timestamp) * 1000);
    });
  });

  describe('calculateGasPrice', () => {
    it('should calculate gas price with buffer', () => {
      const basePrice = BigInt('1000000000');
      const buffer = 1.1;
      expect(calculateGasPrice(basePrice, buffer))
        .toBe(BigInt('1100000000'));
    });
  });

  describe('formatTxHash', () => {
    it('should format transaction hash correctly', () => {
      const hash = '0x1234567890123456789012345678901234567890123456789012345678901234';
      expect(formatTxHash(hash)).toBe('0x123456...789012');
    });

    it('should throw error for invalid hash', () => {
      expect(() => formatTxHash('invalid')).toThrow(ValidationError);
    });
  });

  describe('bytesToHex and hexToBytes', () => {
    it('should convert between bytes and hex', () => {
      const bytes = new Uint8Array([1, 2, 3, 4]);
      const hex = bytesToHex(bytes);
      expect(hexToBytes(hex)).toEqual(bytes);
    });
  });

  describe('formatErrorMessage', () => {
    it('should format error message with context', () => {
      const error = new Error('Test error');
      expect(formatErrorMessage(error, 'Context')).toBe('Context: Test error');
      expect(formatErrorMessage(error)).toBe('Test error');
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
  });

  describe('isInRange', () => {
    it('should check if value is within range', () => {
      expect(isInRange(5, 1, 10)).toBe(true);
      expect(isInRange(0, 1, 10)).toBe(false);
      expect(isInRange(BigInt(5), BigInt(1), BigInt(10))).toBe(true);
    });
  });

  describe('formatNumber', () => {
    it('should format number with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(BigInt(1000000))).toBe('1,000,000');
    });
  });

  describe('truncateString', () => {
    it('should truncate string to specified length', () => {
      expect(truncateString('test string', 4)).toBe('test...');
      expect(truncateString('test', 4)).toBe('test');
    });
  });

  describe('toPercentage', () => {
    it('should convert number to percentage string', () => {
      expect(toPercentage(0.1234)).toBe('12.34%');
      expect(toPercentage(0.1234, 1)).toBe('12.3%');
    });
  });

  describe('sleep', () => {
    it('should sleep for specified milliseconds', async () => {
      const start = Date.now();
      await sleep(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(100);
    });
  });

  describe('isValidJSON', () => {
    it('should check if string is valid JSON', () => {
      expect(isValidJSON('{"test": "value"}')).toBe(true);
      expect(isValidJSON('invalid')).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('should deep clone object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const clone = deepClone(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
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
  });
}); 