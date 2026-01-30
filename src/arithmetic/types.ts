export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface FractionResult {
  value: number;
  fraction: Fraction;
  mixedNumber?: { whole: number; numerator: number; denominator: number };
}
