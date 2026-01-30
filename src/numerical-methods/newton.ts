export function newton(
  f: (x: number) => number,
  fprime: (x: number) => number,
  x0: number,
  maxIterations: number = 100,
  tolerance: number = 1e-10
): { root: number; iterations: number; converged: boolean } {
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

export function halley(
  f: (x: number) => number,
  fprime: (x: number) => number,
  fdoubleprime: (x: number) => number,
  x0: number,
  maxIterations: number = 100,
  tolerance: number = 1e-10
): { root: number; iterations: number; converged: boolean } {
  let x = x0;
  
  for (let i = 0; i < maxIterations; i++) {
    const fx = f(x);
    const fpx = fprime(x);
    const fppx = fdoubleprime(x);
    
    if (Math.abs(fpx) < tolerance) {
      return { root: x, iterations: i, converged: false };
    }
    
    const denominator = 2 * fpx * fpx - fx * fppx;
    if (Math.abs(denominator) < tolerance) {
      return { root: x, iterations: i, converged: false };
    }
    
    const xNew = x - 2 * fx * fpx / denominator;
    
    if (Math.abs(xNew - x) < tolerance) {
      return { root: xNew, iterations: i + 1, converged: true };
    }
    
    x = xNew;
  }
  
  return { root: x, iterations: maxIterations, converged: false };
}

export function schroder(
  f: (x: number) => number,
  fprime: (x: number) => number,
  fprimeprime: (x: number) => number,
  x0: number,
  maxIterations: number = 100,
  tolerance: number = 1e-10
): { root: number; iterations: number; converged: boolean } {
  let x = x0;
  
  for (let i = 0; i < maxIterations; i++) {
    const fx = f(x);
    const fpx = fprime(x);
    const fppx = fprimeprime(x);
    
    if (Math.abs(fpx) < tolerance) {
      return { root: x, iterations: i, converged: false };
    }
    
    const xNew = x - fx / fpx + (fx * fx * fppx) / (2 * fpx * fpx);
    
    if (Math.abs(xNew - x) < tolerance) {
      return { root: xNew, iterations: i + 1, converged: true };
    }
    
    x = xNew;
  }
  
  return { root: x, iterations: maxIterations, converged: false };
}

export function chebyshev(
  f: (x: number) => number,
  fprime: (x: number) => number,
  fprimeprime: (x: number) => number,
  x0: number,
  maxIterations: number = 100,
  tolerance: number = 1e-10
): { root: number; iterations: number; converged: boolean } {
  let x = x0;
  
  for (let i = 0; i < maxIterations; i++) {
    const fx = f(x);
    const fpx = fprime(x);
    const fppx = fprimeprime(x);
    
    if (Math.abs(fpx) < tolerance) {
      return { root: x, iterations: i, converged: false };
    }
    
    const xNew = x - fx / fpx - (fx * fx * fppx) / (2 * fpx * fpx * fpx);
    
    if (Math.abs(xNew - x) < tolerance) {
      return { root: xNew, iterations: i + 1, converged: true };
    }
    
    x = xNew;
  }
  
  return { root: x, iterations: maxIterations, converged: false };
}

export function muller(
  f: (x: number) => number,
  x0: number,
  x1: number,
  x2: number,
  maxIterations: number = 100,
  tolerance: number = 1e-10
): { root: number; iterations: number; converged: boolean } {
  let xPrev2 = x0;
  let xPrev1 = x1;
  let x = x2;
  
  for (let i = 0; i < maxIterations; i++) {
    const f0 = f(xPrev2);
    const f1 = f(xPrev1);
    const f2 = f(x);
    
    const d1 = (f1 - f0) / (xPrev1 - xPrev2);
    const d2 = (f2 - f1) / (x - xPrev1);
    const d = (d2 - d1) / (x - xPrev2);
    
    const sqrtDiscriminant = Math.sqrt(Math.max(0, d * (x - xPrev2) + d2 - d1));
    
    let denom = d2 + d1 + 2 * sqrtDiscriminant;
    if (Math.abs(d2 - d1) > Math.abs(denom)) {
      denom = d2 + d1 - 2 * sqrtDiscriminant;
    }
    
    if (Math.abs(denom) < tolerance) {
      return { root: x, iterations: i, converged: false };
    }
    
    const xNew = x - 2 * f2 / denom;
    
    if (Math.abs(xNew - x) < tolerance) {
      return { root: xNew, iterations: i + 1, converged: true };
    }
    
    xPrev2 = xPrev1;
    xPrev1 = x;
    x = xNew;
  }
  
  return { root: x, iterations: maxIterations, converged: false };
}

export function traub(
  f: (x: number) => number,
  fprime: (x: number) => number,
  x0: number,
  maxIterations: number = 100,
  tolerance: number = 1e-10
): { root: number; iterations: number; converged: boolean } {
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

export function steffensen(
  f: (x: number) => number,
  x0: number,
  maxIterations: number = 100,
  tolerance: number = 1e-10
): { root: number; iterations: number; converged: boolean } {
  let x = x0;
  
  for (let i = 0; i < maxIterations; i++) {
    const x1 = f(x);
    const x2 = f(x1);
    
    if (Math.abs(x2 - 2 * x1 + x) < tolerance) {
      return { root: x, iterations: i, converged: false };
    }
    
    const xNew = x - (x1 - x) * (x1 - x) / (x2 - 2 * x1 + x);
    
    if (Math.abs(xNew - x) < tolerance) {
      return { root: xNew, iterations: i + 1, converged: true };
    }
    
    x = xNew;
  }
  
  return { root: x, iterations: maxIterations, converged: false };
}
