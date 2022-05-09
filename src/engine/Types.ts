export type Vec3d = {
    x: number;
    y: number;
    z: number;
}
  
export type Triangle = FixedLengthArray<[Vec3d, Vec3d, Vec3d]>

export const newTriangle = (): Triangle =>
    [{ x: 0.0, y: 0.0, z: 0.0 }, { x: 0.0, y: 0.0, z: 0.0 }, { x: 0.0, y: 0.0, z: 0.0 }]

export type Mesh = Triangle[];

type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number
type ArrayItems<T extends Array<any>> = T extends Array<infer TItems> ? TItems : never
export type FixedLengthArray<T extends any[]> =
    Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>>
    & { [Symbol.iterator]: () => IterableIterator< ArrayItems<T> > }