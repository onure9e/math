export function gradientDescent(
  f: (x: number[]) => number,
  grad: (x: number[]) => number[],
  x0: number[],
  options: {
    learningRate?: number;
    maxIterations?: number;
    tolerance?: number;
    momentum?: number;
  } = {}
): { minimum: number[]; value: number; iterations: number } {
  const {
    learningRate = 0.01,
    maxIterations = 1000,
    tolerance = 1e-10,
    momentum = 0
  } = options;
  
  let x = [...x0];
  let velocity = new Array(x0.length).fill(0);
  let iterations = 0;
  
  for (iterations = 0; iterations < maxIterations; iterations++) {
    const g = grad(x);
    let maxGrad = 0;
    
    for (let i = 0; i < x.length; i++) {
      const gI = g[i];
      const vI = velocity[i];
      if (gI === undefined || vI === undefined) {
        throw new Error('Invalid gradient or velocity array');
      }
      velocity[i] = momentum * vI - learningRate * gI;
      x[i] += velocity[i];
      maxGrad = Math.max(maxGrad, Math.abs(gI));
    }
    
    if (maxGrad < tolerance) break;
  }
  
  return { minimum: x, value: f(x), iterations };
}

export function newtonRaphson(
  f: (x: number) => number,
  fprime: (x: number) => number,
  x0: number,
  options: {
    maxIterations?: number;
    tolerance?: number;
  } = {}
): { root: number; iterations: number; converged: boolean } {
  const { maxIterations = 100, tolerance = 1e-10 } = options;
  
  let x = x0;
  
  for (let i = 0; i < maxIterations; i++) {
    const fx = f(x);
    const fpx = fprime(x);
    
    if (Math.abs(fpx) < tolerance) {
      return { root: x, iterations: i, converged: false };
    }
    
    const xNew = x - fx / fpx;
    
    if (Math.abs(xNew - x) < tolerance) {
      return { root: xNew, iterations: i + 1, converged: true };
    }
    
    x = xNew;
  }
  
  return { root: x, iterations: maxIterations, converged: false };
}

export function newtonRaphsonMulti(
  f: (x: number[]) => number[],
  jacobian: (x: number[]) => number[][],
  x0: number[],
  options: {
    maxIterations?: number;
    tolerance?: number;
  } = {}
): { root: number[]; iterations: number; converged: boolean } {
  const { maxIterations = 100, tolerance = 1e-10 } = options;
  
  let x = [...x0];
  
  for (let i = 0; i < maxIterations; i++) {
    const fx = f(x);
    const J = jacobian(x);
    
    let maxFx = 0;
    for (const val of fx) {
      maxFx = Math.max(maxFx, Math.abs(val));
    }
    
    if (maxFx < tolerance) {
      return { root: x, iterations: i, converged: true };
    }
    
    const dx = solveLinearSystem(J, fx.map(v => -v));
    if (!dx) {
      return { root: x, iterations: i, converged: false };
    }
    
    let maxDx = 0;
    for (let j = 0; j < x.length; j++) {
      const dxJ = dx[j];
      if (dxJ === undefined) {
        throw new Error('Invalid dx array');
      }
      const xJ = x[j];
      if (xJ === undefined) {
        throw new Error('Invalid x array');
      }
      x[j] = xJ + dxJ;
      maxDx = Math.max(maxDx, Math.abs(dxJ));
    }
    
    if (maxDx < tolerance) {
      return { root: x, iterations: i + 1, converged: true };
    }
  }
  
  return { root: x, iterations: maxIterations, converged: false };
}

function solveLinearSystem(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  const aug = A.map((row, i) => [...row, b[i]]);
  
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      const augK = aug[k];
      const augMaxRow = aug[maxRow];
      if (augK === undefined || augMaxRow === undefined) {
        throw new Error('Invalid matrix');
      }
      const augKI = augK[i];
      const augMaxRowI = augMaxRow[i];
      if (augKI === undefined || augMaxRowI === undefined) {
        throw new Error('Invalid matrix');
      }
      if (Math.abs(augKI) > Math.abs(augMaxRowI)) {
        maxRow = k;
      }
    }
    
    const augRowI = aug[i];
    const augRowMaxRow = aug[maxRow];
    if (augRowI === undefined || augRowMaxRow === undefined) {
      throw new Error('Invalid matrix');
    }
    [aug[i], aug[maxRow]] = [augRowMaxRow, augRowI];
    
    const augI = aug[i];
    if (augI === undefined) {
      throw new Error('Invalid matrix');
    }
    const augII = augI[i];
    if (augII === undefined) {
      throw new Error('Invalid matrix');
    }
    if (Math.abs(augII) < 1e-15) return null;
    
    for (let k = i + 1; k < n; k++) {
      const augK = aug[k];
      if (augK === undefined) {
        throw new Error('Invalid matrix');
      }
      const augKI = augK[i];
      if (augKI === undefined) {
        throw new Error('Invalid matrix');
      }
      const factor = augKI / augII;
      for (let j = i; j <= n; j++) {
        const augKJ = augK[j];
        const augIJ = augI[j];
        if (augKJ === undefined || augIJ === undefined) {
          throw new Error('Invalid matrix');
        }
        augK[j] = augKJ - factor * augIJ;
      }
    }
  }
  
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const augI = aug[i];
    if (augI === undefined) {
      throw new Error('Invalid matrix');
    }
    let sum = augI[n];
    if (sum === undefined) {
      throw new Error('Invalid matrix');
    }
    for (let j = i + 1; j < n; j++) {
      const xJ = x[j];
      const augIJ = augI[j];
      if (augIJ === undefined) {
        throw new Error('Invalid matrix');
      }
      sum -= augIJ * xJ;
    }
    const augII = augI[i];
    if (augII === undefined) {
      throw new Error('Invalid matrix');
    }
    x[i] = sum / augII;
  }
  
  return x;
}

export function bisectionMethod(
  f: (x: number) => number,
  a: number,
  b: number,
  options: {
    maxIterations?: number;
    tolerance?: number;
  } = {}
): { root: number; iterations: number; converged: boolean } {
  const { maxIterations = 100, tolerance = 1e-10 } = options;
  
  let fa = f(a);
  let fb = f(b);
  
  if (fa * fb > 0) {
    throw new Error('Function values at endpoints must have opposite signs');
  }
  
  for (let i = 0; i < maxIterations; i++) {
    const c = (a + b) / 2;
    const fc = f(c);
    
    if (Math.abs(fc) < tolerance || (b - a) / 2 < tolerance) {
      return { root: c, iterations: i + 1, converged: true };
    }
    
    if (fa * fc < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }
  }
  
  return { root: (a + b) / 2, iterations: maxIterations, converged: false };
}

export function secantMethod(
  f: (x: number) => number,
  x0: number,
  x1: number,
  options: {
    maxIterations?: number;
    tolerance?: number;
  } = {}
): { root: number; iterations: number; converged: boolean } {
  const { maxIterations = 100, tolerance = 1e-10 } = options;
  
  let xPrev = x0;
  let xCurr = x1;
  
  for (let i = 0; i < maxIterations; i++) {
    const fPrev = f(xPrev);
    const fCurr = f(xCurr);
    
    if (Math.abs(fCurr - fPrev) < tolerance) {
      return { root: xCurr, iterations: i, converged: false };
    }
    
    const xNew = xCurr - fCurr * (xCurr - xPrev) / (fCurr - fPrev);
    
    if (Math.abs(xNew - xCurr) < tolerance) {
      return { root: xNew, iterations: i + 1, converged: true };
    }
    
    xPrev = xCurr;
    xCurr = xNew;
  }
  
  return { root: xCurr, iterations: maxIterations, converged: false };
}

export function fixedPointIteration(
  g: (x: number) => number,
  x0: number,
  options: {
    maxIterations?: number;
    tolerance?: number;
  } = {}
): { root: number; iterations: number; converged: boolean } {
  const { maxIterations = 100, tolerance = 1e-10 } = options;
  
  let x = x0;
  
  for (let i = 0; i < maxIterations; i++) {
    const xNew = g(x);
    
    if (Math.abs(xNew - x) < tolerance) {
      return { root: xNew, iterations: i + 1, converged: true };
    }
    
    x = xNew;
  }
  
  return { root: x, iterations: maxIterations, converged: false };
}

export function goldenSectionSearch(
  f: (x: number) => number,
  a: number,
  b: number,
  options: {
    maxIterations?: number;
    tolerance?: number;
  } = {}
): { minimum: number; iterations: number } {
  const { maxIterations = 100, tolerance = 1e-10 } = options;
  
  const phi = (1 + Math.sqrt(5)) / 2;
  const resphi = 2 - phi;
  
  let x1 = a + resphi * (b - a);
  let x2 = b - resphi * (b - a);
  let f1 = f(x1);
  let f2 = f(x2);
  
  for (let i = 0; i < maxIterations; i++) {
    if (f1 > f2) {
      a = x1;
      x1 = x2;
      f1 = f2;
      x2 = b - resphi * (b - a);
      f2 = f(x2);
    } else {
      b = x2;
      x2 = x1;
      f2 = f1;
      x1 = a + resphi * (b - a);
      f1 = f(x1);
    }
    
    if (Math.abs(b - a) < tolerance) break;
  }
  
  return { minimum: (a + b) / 2, iterations: maxIterations };
}

export function simulatedAnnealing(
  f: (x: number[]) => number,
  x0: number[],
  options: {
    initialTemp?: number;
    coolingRate?: number;
    maxIterations?: number;
    neighborhood?: number;
  } = {}
): { minimum: number[]; value: number } {
  const {
    initialTemp = 100,
    coolingRate = 0.99,
    maxIterations = 10000,
    neighborhood = 0.1
  } = options;
  
  let x = [...x0];
  let bestX = [...x0];
  let bestValue = f(x);
  let temperature = initialTemp;
  
  for (let i = 0; i < maxIterations; i++) {
    const neighbor = x.map(v => v + (Math.random() - 0.5) * neighborhood);
    const neighborValue = f(neighbor);
    
    const delta = neighborValue - f(x);
    
    if (delta < 0 || Math.random() < Math.exp(-delta / temperature)) {
      x = neighbor;
      if (neighborValue < bestValue) {
        bestValue = neighborValue;
        bestX = [...neighbor];
      }
    }
    
    temperature *= coolingRate;
    
    if (temperature < 1e-10) break;
  }
  
  return { minimum: bestX, value: bestValue };
}

export function particleSwarmOptimization(
  f: (x: number[]) => number,
  n: number,
  dimension: number,
  options: {
    maxIterations?: number;
    w?: number;
    c1?: number;
    c2?: number;
  } = {}
): { minimum: number[]; value: number } {
  const {
    maxIterations = 100,
    w = 0.7,
    c1 = 1.5,
    c2 = 1.5
  } = options;
  
  const particles: { position: number[]; velocity: number[]; best: number[]; bestValue: number }[] = [];
  
  for (let i = 0; i < n; i++) {
    const position = Array.from({ length: dimension }, () => Math.random() * 10 - 5);
    const value = f(position);
    particles.push({
      position,
      velocity: new Array(dimension).fill(0),
      best: [...position],
      bestValue: value
    });
  }
  
  const firstParticle = particles[0];
  if (firstParticle === undefined) {
    throw new Error('No particles available');
  }
  let globalBest = firstParticle.best;
  let globalBestValue = firstParticle.bestValue;
  
  for (let iter = 0; iter < maxIterations; iter++) {
    for (const p of particles) {
      for (let d = 0; d < dimension; d++) {
        const r1 = Math.random();
        const r2 = Math.random();
        
        const pVelD = p.velocity[d];
        const pBestD = p.best[d];
        const pPosD = p.position[d];
        const gBestD = globalBest[d];
        if (pVelD === undefined || pBestD === undefined || pPosD === undefined || gBestD === undefined) {
          throw new Error('Invalid particle data');
        }
        
        p.velocity[d] = w * pVelD +
          c1 * r1 * (pBestD - pPosD) +
          c2 * r2 * (gBestD - pPosD);
        
        const newVelD = p.velocity[d];
        if (newVelD === undefined) {
          throw new Error('Invalid particle data');
        }
        p.position[d] = pPosD + newVelD;
      }
      
      const value = f(p.position);
      
      if (value < p.bestValue) {
        p.best = [...p.position];
        p.bestValue = value;
      }
      
      if (value < globalBestValue) {
        globalBest = [...p.position];
        globalBestValue = value;
      }
    }
  }
  
  return { minimum: globalBest, value: globalBestValue };
}

export function geneticAlgorithm(
  f: (x: number[]) => number,
  populationSize: number,
  dimension: number,
  options: {
    maxIterations?: number;
    mutationRate?: number;
    crossoverRate?: number;
    eliteCount?: number;
  } = {}
): { minimum: number[]; value: number } {
  const {
    maxIterations = 100,
    mutationRate = 0.1,
    crossoverRate = 0.8,
    eliteCount = 2
  } = options;
  
  let population: number[][] = [];
  
  for (let i = 0; i < populationSize; i++) {
    population.push(Array.from({ length: dimension }, () => Math.random() * 10 - 5));
  }
  
  for (let iter = 0; iter < maxIterations; iter++) {
    const fitness = population.map(ind => f(ind));
    const sorted = fitness.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
    
    const elite = sorted.slice(0, eliteCount).map(s => {
      const pop = population[s.i];
      if (pop === undefined) {
        throw new Error('Invalid population index');
      }
      return pop;
    });
    
    const newPopulation: number[][] = [...elite];
    
    while (newPopulation.length < populationSize) {
      if (Math.random() < crossoverRate) {
        const parent1 = tournamentSelection(population, fitness);
        const parent2 = tournamentSelection(population, fitness);
        const children = crossover(parent1, parent2);
        const child0 = children[0];
        const child1 = children[1];
        if (child0 === undefined || child1 === undefined) {
          throw new Error('Invalid children from crossover');
        }
        newPopulation.push(mutate(child0, mutationRate));
        if (newPopulation.length < populationSize) {
          newPopulation.push(mutate(child1, mutationRate));
        }
      } else {
        const parent = tournamentSelection(population, fitness);
        newPopulation.push(mutate(parent, mutationRate));
      }
    }
    
    population = newPopulation;
  }
  
  const finalFitness = population.map(ind => f(ind));
  const bestIdx = finalFitness.indexOf(Math.min(...finalFitness));
  const bestIndividual = population[bestIdx];
  if (bestIndividual === undefined) {
    throw new Error('Invalid best individual');
  }
  
  return { minimum: bestIndividual, value: f(bestIndividual) };
}

function tournamentSelection(
  population: number[][],
  fitness: number[],
  tournamentSize: number = 3
): number[] {
  let bestIdx = Math.floor(Math.random() * population.length);
  
  for (let i = 1; i < tournamentSize; i++) {
    const idx = Math.floor(Math.random() * population.length);
    const fitnessIdx = fitness[idx];
    const fitnessBestIdx = fitness[bestIdx];
    if (fitnessIdx === undefined || fitnessBestIdx === undefined) {
      throw new Error('Invalid fitness array');
    }
    if (fitnessIdx < fitnessBestIdx) {
      bestIdx = idx;
    }
  }
  
  const result = population[bestIdx];
  if (result === undefined) {
    throw new Error('Invalid population index');
  }
  return result;
}

function crossover(parent1: number[], parent2: number[]): number[][] {
  const point = Math.floor(Math.random() * parent1.length);
  return [
    [...parent1.slice(0, point), ...parent2.slice(point)],
    [...parent2.slice(0, point), ...parent1.slice(point)]
  ];
}

function mutate(individual: number[], rate: number): number[] {
  return individual.map(gene =>
    Math.random() < rate ? gene + (Math.random() - 0.5) : gene
  );
}
