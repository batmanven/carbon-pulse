import { calculateEmissions } from '../emissions';

describe('calculateEmissions', () => {
  it('calculates transportation correctly', () => {
    const result = calculateEmissions('transport', 'car', 10);
    expect(result).toBe(10 * 0.17);
  });

  it('calculates food accurately', () => {
    const result = calculateEmissions('food', 'beef', 1);
    expect(result).toBe(1 * 27);
  });

  it('calculates energy correctly', () => {
    const result = calculateEmissions('energy', 'grid_avg', 50);
    expect(result).toBe(50 * 0.4);
  });

  it('returns reasonable defaults for unknown categories', () => {
    const result = calculateEmissions('unknown', 'category', 10);
    expect(result).toBe(0);
  });
});
