import {
  conditionalProbability,
  rejectionSampling,
  bayesTheorem,
  expectedValue,
  variance as probVariance,
  entropy,
  combinationProbability,
  poissonProbability,
  geometricProbability
} from '../src/probability/basic';

describe('Probability - Basic Module', () => {
  describe('conditionalProbability', () => {
    test('calculates conditional probability', () => {
      const eventA = () => Math.random() < 0.6;
      const eventB = () => Math.random() < 0.5;
      
      const result = conditionalProbability(eventA, eventB);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });
    
    test('throws error when event B never occurs', () => {
      const eventA = () => true;
      const eventB = () => false;
      
      expect(() => conditionalProbability(eventA, eventB)).toThrow('Event B never occurred');
    });
  });
  
  describe('rejectionSampling', () => {
    test('performs rejection sampling correctly', () => {
      const targetDensity = (x: number) => x < 0.5 ? 1 : 0;
      const proposalDensity = () => 1;
      const proposalSample = () => Math.random();
      
      const result = rejectionSampling(
        targetDensity,
        proposalDensity,
        proposalSample,
        1,
        100
      );
      
      expect(result.samples.length).toBeGreaterThan(0);
      expect(result.iterations).toBeGreaterThanOrEqual(result.samples.length);
    });
    
    test('returns completion status', () => {
      const targetDensity = (x: number) => x < 0.01 ? 1 : 0; // Very restrictive
      const proposalDensity = () => 1;
      const proposalSample = () => Math.random();
      
      const result = rejectionSampling(
        targetDensity,
        proposalDensity,
        proposalSample,
        1,
        1000,
        { maxIterations: 100 }
      );
      
      expect(result.completed).toBe(false);
      expect(result.samples.length).toBeLessThan(1000);
    });
    
    test('throws error on timeout', () => {
      const targetDensity = (x: number) => 0; // Impossible to sample
      const proposalDensity = () => 1;
      const proposalSample = () => Math.random();
      
      expect(() => rejectionSampling(
        targetDensity,
        proposalDensity,
        proposalSample,
        1,
        10,
        { timeoutMs: 1 }
      )).toThrow('timeout');
    });
  });
  
  describe('bayesTheorem', () => {
    test('calculates posterior probability', () => {
      // P(A|B) = P(B|A) * P(A) / P(B)
      const pA = 0.01; // Disease prevalence
      const pBGivenA = 0.9; // Test sensitivity
      const pBGivenNotA = 0.05; // False positive rate
      const pB = pBGivenA * pA + pBGivenNotA * (1 - pA);
      
      const result = bayesTheorem(pA, pBGivenA, pBGivenNotA, pB);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
    });
  });
  
  describe('expectedValue', () => {
    test('calculates expected value', () => {
      const values = [1, 2, 3, 4, 5];
      const probabilities = [0.1, 0.2, 0.3, 0.2, 0.2];
      
      expect(expectedValue(values, probabilities)).toBeCloseTo(3.2, 5);
    });
    
    test('throws error for mismatched lengths', () => {
      expect(() => expectedValue([1, 2], [0.5])).toThrow('must have same length');
    });
  });
  
  describe('variance', () => {
    test('calculates variance', () => {
      const values = [1, 2, 3, 4, 5];
      const probabilities = [0.2, 0.2, 0.2, 0.2, 0.2];
      
      expect(probVariance(values, probabilities)).toBeCloseTo(2, 5);
    });
  });
  
  describe('entropy', () => {
    test('calculates entropy', () => {
      const fairCoin = [0.5, 0.5];
      expect(entropy(fairCoin)).toBe(1);
      
      const biasedCoin = [0.9, 0.1];
      expect(entropy(biasedCoin)).toBeLessThan(1);
    });
    
    test('ignores zero probabilities', () => {
      const dist = [1, 0, 0];
      expect(entropy(dist)).toBe(0);
    });
  });
  
  describe('combinationProbability', () => {
    test('calculates binomial probability', () => {
      // P(X=2) for X ~ Binomial(n=5, p=0.5)
      const result = combinationProbability(2, 5, 0.5);
      expect(result).toBeCloseTo(0.3125, 4);
    });
    
    test('returns 0 for invalid k', () => {
      expect(combinationProbability(-1, 5, 0.5)).toBe(0);
      expect(combinationProbability(6, 5, 0.5)).toBe(0);
    });
    
    test('throws error for invalid probability', () => {
      expect(() => combinationProbability(2, 5, -0.1)).toThrow('Probability must be between 0 and 1');
      expect(() => combinationProbability(2, 5, 1.1)).toThrow('Probability must be between 0 and 1');
    });
  });
  
  describe('poissonProbability', () => {
    test('calculates Poisson probability', () => {
      // P(X=3) for X ~ Poisson(λ=2)
      const result = poissonProbability(3, 2);
      expect(result).toBeCloseTo(0.180, 3);
    });
    
    test('returns 0 for negative k', () => {
      expect(poissonProbability(-1, 2)).toBe(0);
    });
    
    test('throws error for non-positive lambda', () => {
      expect(() => poissonProbability(2, 0)).toThrow('Lambda must be positive');
      expect(() => poissonProbability(2, -1)).toThrow('Lambda must be positive');
    });
  });
  
  describe('geometricProbability', () => {
    test('calculates geometric probability', () => {
      // P(X=3) for X ~ Geometric(p=0.3)
      const result = geometricProbability(3, 0.3);
      expect(result).toBeCloseTo(0.147, 3);
    });
    
    test('returns 0 for invalid k', () => {
      expect(geometricProbability(0, 0.5)).toBe(0);
      expect(geometricProbability(-1, 0.5)).toBe(0);
    });
    
    test('throws error for invalid probability', () => {
      expect(() => geometricProbability(1, 0)).toThrow('Probability must be between 0 and 1');
      expect(() => geometricProbability(1, 1.1)).toThrow('Probability must be between 0 and 1');
    });
  });
});
