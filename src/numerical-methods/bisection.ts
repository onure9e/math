export function bisection(
  f: (x: number) => number,
  a: number,
  b: number,
  maxIterations: number = 100,
  tolerance: number = 1e-10
): { root: number; iterations: number; error: number } {
  let fa = f(a);
  let fb = f(b);
  
  if (fa * fb > 0) {
    throw new Error('Function values at endpoints must have opposite signs');
  }
  
  let root = a;
  let iterations = 0;
  
  for (iterations = 0; iterations < maxIterations; iterations++) {
    root = (a + b) / 2;
    const fr = f(root);
    const error = (b - a) / 2;
    
    if (error < tolerance || Math.abs(fr) < tolerance) {
      return { root, iterations, error };
    }
    
    if (fa * fr < 0) {
      b = root;
      fb = fr;
    } else {
      a = root;
      fa = fr;
    }
  }
  
  return { root, iterations, error: Math.abs(f(root)) };
}

export function falsePosition(
  f: (x: number) => number,
  a: number,
  b: number,
  maxIterations: number = 100,
  tolerance: number = 1e-10
): { root: number; iterations: number; error: number } {
  let fa = f(a);
  let fb = f(b);
  
  if (fa * fb > 0) {
    throw new Error('Function values at endpoints must have opposite signs');
  }
  
  let root = a;
  
  for (let i = 0; i < maxIterations; i++) {
    root = (a * fb - b * fa) / (fb - fa);
    const fr = f(root);
    
    if (Math.abs(fr) < tolerance) {
      return { root, iterations: i + 1, error: Math.abs(fr) };
    }
    
    if (fa * fr < 0) {
      b = root;
      fb = fr;
    } else {
      a = root;
      fa = fr;
    }
  }
  
  return { root, iterations: maxIterations, error: Math.abs(f(root)) };
}

export function illinois(
  f: (x: number) => number,
  a: number,
  b: number,
  maxIterations: number = 100,
  tolerance: number = 1e-10
): { root: number; iterations: number; error: number } {
  let fa = f(a);
  let fb = f(b);
  
  if (fa * fb > 0) {
    throw new Error('Function values at endpoints must have opposite signs');
  }
  
  let root = a;
  
  for (let i = 0; i < maxIterations; i++) {
    root = (a * fb - b * fa) / (fb - fa);
    const fr = f(root);
    
    if (Math.abs(fr) < tolerance) {
      return { root, iterations: i + 1, error: Math.abs(fr) };
    }
    
    if (fa * fr < 0) {
      b = root;
      fb = fr;
    } else {
      a = root;
      fa = fr / 2;
    }
  }
  
  return { root, iterations: maxIterations, error: Math.abs(f(root)) };
}

export function andersonBjoerk(
  f: (x: number) => number,
  a: number,
  b: number,
  maxIterations: number = 100,
  tolerance: number = 1e-10
): { root: number; iterations: number; error: number } {
  let fa = f(a);
  let fb = f(b);
  
  if (fa * fb > 0) {
    throw new Error('Function values at endpoints must have opposite signs');
  }
  
  let root = a;
  let prevRoot = a;
  let prevF = fa;
  
  for (let i = 0; i < maxIterations; i++) {
    root = (a * fb - b * fa) / (fb - fa);
    const fr = f(root);
    
    if (Math.abs(fr) < tolerance) {
      return { root, iterations: i + 1, error: Math.abs(fr) };
    }
    
    const lambda = (fr - prevF) / (root - prevRoot);
    const c = fa - fb - lambda * (a - b);
    const discriminant = c * c + 4 * lambda * (fa - fr);
    
    if (discriminant >= 0) {
      const denom1 = lambda + Math.sqrt(discriminant);
      const denom2 = lambda - Math.sqrt(discriminant);
      const newB = Math.abs(denom1) > Math.abs(denom2) ? b - 2 * fr / denom1 : b - 2 * fr / denom2;
      
      if (newB > a && newB < b) {
        b = newB;
        fb = f(b);
      } else if (fa * fr < 0) {
        b = root;
        fb = fr;
      } else {
        a = root;
        fa = fr;
      }
    } else {
      if (fa * fr < 0) {
        b = root;
        fb = fr;
      } else {
        a = root;
        fa = fr;
      }
    }
    
    prevRoot = root;
    prevF = fr;
  }
  
  return { root, iterations: maxIterations, error: Math.abs(f(root)) };
}
