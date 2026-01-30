import {
  histogram,
  covarianceMatrix,
  correlationMatrix,
  describe as describeStats,
  mean,
  variance,
  stdDev
} from '../src/statistics/descriptive';

describe('Statistics - Descriptive Module', () => {
  describe('histogram', () => {
    test('creates histogram with correct bins', () => {
      const data = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
      const hist = histogram(data, 4);
      
      expect(hist.length).toBe(4);
      expect(hist[0].frequency).toBe(1); // 1
      expect(hist[1].frequency).toBe(2); // 2, 2
      expect(hist[2].frequency).toBe(3); // 3, 3, 3
      expect(hist[3].frequency).toBe(4); // 4, 4, 4, 4
    });
    
    test('returns empty array for empty input', () => {
      expect(histogram([], 10)).toEqual([]);
    });
    
    test('calculates relative frequencies correctly', () => {
      const data = [1, 2, 3, 4, 5];
      const hist = histogram(data, 5);
      
      expect(hist[0].relativeFrequency).toBe(0.2);
      expect(hist.reduce((sum, bin) => sum + bin.relativeFrequency, 0)).toBeCloseTo(1, 10);
    });
    
    test('calculates cumulative frequencies correctly', () => {
      const data = [1, 2, 3, 4, 5];
      const hist = histogram(data, 5);
      
      expect(hist[hist.length - 1].cumulativeFrequency).toBeCloseTo(1, 10);
    });
    
    test('is optimized for large datasets', () => {
      const data = Array.from({ length: 100000 }, () => Math.random() * 100);
      const start = Date.now();
      const hist = histogram(data, 50);
      const duration = Date.now() - start;
      
      expect(hist.length).toBe(50);
      expect(duration).toBeLessThan(300); // Should complete in under 300ms (with strict type checking)
    });
  });
  
  describe('covarianceMatrix', () => {
    test('calculates covariance matrix correctly', () => {
      const data = [
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5]
      ];
      const matrix = covarianceMatrix(data);
      
      expect(matrix.length).toBe(2);
      expect(matrix[0].length).toBe(2);
      expect(matrix[0][0]).toBeGreaterThan(0); // Variance of first column
      expect(matrix[1][1]).toBeGreaterThan(0); // Variance of second column
      expect(matrix[0][1]).toBe(matrix[1][0]); // Symmetric
    });
    
    test('returns empty array for empty data', () => {
      expect(covarianceMatrix([])).toEqual([]);
    });
    
    test('is optimized with single transpose', () => {
      const data = Array.from({ length: 1000 }, () => [
        Math.random(),
        Math.random(),
        Math.random()
      ]);
      
      const start = Date.now();
      const matrix = covarianceMatrix(data);
      const duration = Date.now() - start;
      
      expect(matrix.length).toBe(3);
      expect(duration).toBeLessThan(500);
    });
  });
  
  describe('correlationMatrix', () => {
    test('calculates correlation matrix correctly', () => {
      const data = [
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5]
      ];
      const matrix = correlationMatrix(data);
      
      expect(matrix.length).toBe(2);
      expect(matrix[0][0]).toBe(1); // Diagonal is 1
      expect(matrix[1][1]).toBe(1); // Diagonal is 1
      expect(matrix[0][1]).toBe(matrix[1][0]); // Symmetric
      expect(matrix[0][1]).toBeCloseTo(1, 5); // Highly correlated
    });
    
    test('handles uncorrelated data', () => {
      const data = [
        [1, 10],
        [2, 5],
        [3, 8],
        [4, 2]
      ];
      const matrix = correlationMatrix(data);
      
      expect(matrix[0][1]).toBeLessThan(0.5); // Low correlation
    });
  });
  
  describe('describeStats', () => {
    test('returns comprehensive statistics', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const stats = describeStats(data);
      
      expect(stats.count).toBe(10);
      expect(stats.mean).toBe(5.5);
      expect(stats.median).toBe(5.5);
      expect(stats.min).toBe(1);
      expect(stats.max).toBe(10);
      expect(stats.stdDev).toBeGreaterThan(0);
    });
  });
});
