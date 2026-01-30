import {
  roundTo,
  roundToNearest,
  floorTo,
  ceilTo,
  truncate,
  roundHalfUp,
  roundHalfDown,
  roundHalfEven,
  bankersRound,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatScientific,
  formatCompact
} from '../src/core/rounding';

describe('Core Rounding Module', () => {
  describe('roundTo', () => {
    test('rounds to specified decimal places', () => {
      expect(roundTo(3.14159, 2)).toBe(3.14);
      expect(roundTo(3.14159, 3)).toBe(3.142);
      expect(roundTo(3.14159, 0)).toBe(3);
    });
    
    test('handles negative numbers', () => {
      expect(roundTo(-3.14159, 2)).toBe(-3.14);
    });
    
    test('rounds half up', () => {
      expect(roundTo(3.5, 0)).toBe(4);
      expect(roundTo(2.5, 0)).toBe(3);
    });
  });

  describe('roundToNearest', () => {
    test('rounds to nearest multiple', () => {
      expect(roundToNearest(23, 10)).toBe(20);
      expect(roundToNearest(27, 10)).toBe(30);
      expect(roundToNearest(25, 10)).toBe(30);
    });
    
    test('handles negative numbers', () => {
      expect(roundToNearest(-23, 10)).toBe(-20);
    });
    
    test('handles decimal multiples', () => {
      expect(roundToNearest(3.14159, 0.01)).toBe(3.14);
    });
  });

  describe('floorTo', () => {
    test('floors to specified decimal places', () => {
      expect(floorTo(3.14159, 2)).toBe(3.14);
      expect(floorTo(3.999, 2)).toBe(3.99);
    });
    
    test('handles negative numbers', () => {
      expect(floorTo(-3.14159, 2)).toBe(-3.15);
    });
  });

  describe('ceilTo', () => {
    test('ceils to specified decimal places', () => {
      expect(ceilTo(3.14159, 2)).toBe(3.15);
      expect(ceilTo(3.001, 2)).toBe(3.01);
    });
    
    test('handles negative numbers', () => {
      expect(ceilTo(-3.14159, 2)).toBe(-3.14);
    });
  });

  describe('truncate', () => {
    test('truncates to specified decimal places', () => {
      expect(truncate(3.14159, 2)).toBe(3.14);
      expect(truncate(3.999, 2)).toBe(3.99);
    });
    
    test('handles negative numbers', () => {
      expect(truncate(-3.14159, 2)).toBe(-3.14);
    });
  });

  describe('roundHalfUp', () => {
    test('rounds 0.5 and above up', () => {
      expect(roundHalfUp(3.5)).toBe(4);
      expect(roundHalfUp(3.51)).toBe(4);
      expect(roundHalfUp(3.49)).toBe(3);
    });
    
    test('rounds with decimal places', () => {
      expect(roundHalfUp(3.145, 2)).toBe(3.15);
      expect(roundHalfUp(3.144, 2)).toBe(3.14);
    });
  });

  describe('roundHalfDown', () => {
    test('rounds above 0.5 up, 0.5 down', () => {
      expect(roundHalfDown(3.5)).toBe(3);
      expect(roundHalfDown(3.51)).toBe(4);
      expect(roundHalfDown(3.49)).toBe(3);
    });
  });

  describe('roundHalfEven', () => {
    test('rounds to nearest even number on tie', () => {
      expect(roundHalfEven(3.5)).toBe(4); // 4 is even
      expect(roundHalfEven(2.5)).toBe(2); // 2 is even
    });
    
    test('rounds normally when not tie', () => {
      expect(roundHalfEven(3.51)).toBe(4);
      expect(roundHalfEven(3.49)).toBe(3);
    });
  });

  describe('bankersRound', () => {
    test('is alias for roundHalfEven', () => {
      expect(bankersRound(3.5)).toBe(4);
      expect(bankersRound(2.5)).toBe(2);
    });
  });

  describe('formatNumber', () => {
    test('formats with decimal places', () => {
      expect(formatNumber(1234.567, 2)).toBe('1,234.57');
      expect(formatNumber(1234.567, 1)).toBe('1,234.6');
    });
    
    test('formats without thousand separator', () => {
      expect(formatNumber(1234.567, 2, false)).toBe('1234.57');
    });
    
    test('handles negative numbers', () => {
      expect(formatNumber(-1234.567, 2)).toBe('-1,234.57');
    });
  });

  describe('formatCurrency', () => {
    test('formats as currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1234.56, '€')).toBe('€1,234.56');
    });
    
    test('respects decimal places', () => {
      expect(formatCurrency(1234.5, '$', 2)).toBe('$1,234.50');
    });
  });

  describe('formatPercent', () => {
    test('formats as percentage', () => {
      expect(formatPercent(0.1234)).toBe('12.34%');
      expect(formatPercent(0.5)).toBe('50.00%');
    });
    
    test('respects decimal places', () => {
      expect(formatPercent(0.1234, 1)).toBe('12.3%');
    });
  });

  describe('formatScientific', () => {
    test('formats in scientific notation', () => {
      expect(formatScientific(1234.567)).toBe('1.23e+3');
      expect(formatScientific(0.001234)).toBe('1.23e-3');
    });
    
    test('respects decimal places', () => {
      expect(formatScientific(1234.567, 3)).toBe('1.235e+3');
    });
  });

  describe('formatCompact', () => {
    test('formats with K suffix', () => {
      expect(formatCompact(1234)).toBe('1.2K');
      expect(formatCompact(999)).toBe('999');
    });
    
    test('formats with M suffix', () => {
      expect(formatCompact(1234567)).toBe('1.2M');
    });
    
    test('formats with B suffix', () => {
      expect(formatCompact(1234567890)).toBe('1.2B');
    });
    
    test('formats with T suffix', () => {
      expect(formatCompact(1234567890123)).toBe('1.2T');
    });
    
    test('handles negative numbers', () => {
      expect(formatCompact(-1234)).toBe('-1.2K');
    });
    
    test('respects decimal places', () => {
      expect(formatCompact(1234, 2)).toBe('1.23K');
    });
  });
});
