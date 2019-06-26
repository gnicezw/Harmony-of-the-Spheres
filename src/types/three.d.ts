declare module 'three' {
  export class PerspectiveCamera {
    constructor(fov: Number, aspect: Number, near: Number, far: Number);
  }

  export class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    set(x: number, y: number, z: number): this;
    sub(v: Vector3): this;
    add(v: Vector3): this;
    normalize(): this;
    multiplyScalar(s: number): this;
    applyAxisAngle(v: Vector3, rad: number): this;
    project(camera: PerspectiveCamera): this;
  }
  export class Color {
    constructor(color?: any);
    setHSL(h: number, s: number, l: number): this;
    toArray(array: Float32Array, offset: number): [number, number, number];
  }
  export class Object3D {
    name: string;
    frustumCulled: boolean;
    geometry: any;
    rotation: { x: number; y: number; z: number };
    add(obj: Object3D): this;
    getObjectByName(name: string): Object3D;
  }
  export class Geometry {
    constructor();
  }
  export class BufferGeometry {
    addAttribute(name: string, attribute: BufferAttribute): BufferGeometry;
    setFromPoints(
      points: { x: number; y: number; z: number }[]
    ): BufferGeometry;
  }
  export class BufferAttribute {
    constructor(array: Float32Array, size: number, normalized?: boolean);
  }
  export class Float32BufferAttribute {
    constructor(array: Float32Array, size: number, normalized?: boolean);
  }
  export class LineBasicMaterial {
    constructor(parameters: {
      color?: string;
      isLineBasicMaterial?: boolean;
      lights?: boolean;
      lineWidth?: number;
      linecap?: string;
      linejoin?: string;
    });
    onBeforeCompile(shader: any): void;
  }
  export class Line extends Object3D {
    constructor(
      geometry: BufferGeometry | Geometry,
      material: LineBasicMaterial
    );
  }
  export class ShaderMaterial {
    constructor(parameters: {
      vertexShader: string;
      fragmentShader: string;
      uniforms: Object;
      depthTest?: boolean;
      transparent?: boolean;
      blending?: number;
      side?: number;
    });
  }
  export class Points extends Object3D {
    constructor(geometry: BufferGeometry, material: ShaderMaterial);
  }
}