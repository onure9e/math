export interface NumberArray extends Array<number> {}
export interface Matrix extends Array<Array<number>> {}
export interface Vector2D { x: number; y: number; }
export interface Vector3D { x: number; y: number; z: number; }
export interface Point2D { x: number; y: number; }
export interface Point3D { x: number; y: number; z: number; }
export interface Complex { re: number; im: number; }
export interface Polynomial extends Array<number> {}
export interface Matrix3x3 { m: [number, number, number, number, number, number, number, number, number]; }
export interface Matrix4x4 { m: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]; }
export interface Quaternion { w: number; x: number; y: number; z: number; }
export interface Interval { start: number; end: number; }
export interface Range { min: number; max: number; }
export interface StatsResult { mean: number; median: number; mode?: number; variance: number; stdDev: number; }
export interface RegressionResult { slope: number; intercept: number; r2: number; equation: string; }
export interface CorrelationResult { pearson: number; spearman: number; }
export interface GraphNode { id: string | number; label?: string; weight?: number; }
export interface GraphEdge { from: string | number; to: string | number; weight?: number; directed?: boolean; }
export interface Graph { nodes: GraphNode[]; edges: GraphEdge[]; }
export interface DateRange { start: Date; end: Date; }
export interface TimeSeriesPoint { timestamp: Date; value: number; }
export interface Seasonality { period: number; amplitude: number; phase: number; }
export interface Color { r: number; g: number; b: number; a?: number; }
export interface RGB extends Color {}
export interface HSV extends Color {}
export interface HSL extends Color {}
