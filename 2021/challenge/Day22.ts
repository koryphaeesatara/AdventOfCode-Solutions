import Challenge from "../../Challenge";

declare global {
    interface Array<T> {
        min(): T;

        max(): T;

        unique(): Array<T>;
    }
}

Array.prototype.min = function <T>(fn: (min: T, current: T) => T = (min, c) => min < c ? min : c) {
    return this.reduce(fn);
}

Array.prototype.max = function <T>(fn: (min: T, current: T) => T = (max, c) => max > c ? max : c) {
    return this.reduce(fn);
}

Array.prototype.unique = function <T>(): T[] {
    const set = new Set<string>();
    for (const x of this) {
        set.add(JSON.stringify(x));
    }
    return Array.from(set).map(x => JSON.parse(x));
}

type Tuple = number[];

interface CuboidDescriptor {
    mode: "on" | "off"
    x: Tuple;
    y: Tuple;
    z: Tuple;
}

function SORT_NUMERIC(a: number, b: number) {
    return a - b;
}

export default class Day22 extends Challenge<CuboidDescriptor[]> {
    day: string = "day22";

    prepare(riddle: string): CuboidDescriptor[] {
        return riddle.split("\n").filter(l => l !== "")
            .map(l => l.match(/(\w+) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/))
            .map(match => ({
                mode: match[1] as "on" | "off",
                x: [parseInt(match[2]), parseInt(match[3])].sort(SORT_NUMERIC),
                y: [parseInt(match[4]), parseInt(match[5])].sort(SORT_NUMERIC),
                z: [parseInt(match[6]), parseInt(match[7])].sort(SORT_NUMERIC),
            }));
    }

    part1(descriptors: CuboidDescriptor[]): number {
        descriptors = descriptors.filter(cuboid => [cuboid.x[0], cuboid.y[0], cuboid.z[0]].min() >= -50 && [cuboid.x[1], cuboid.y[1], cuboid.z[1]].max() <= 50);
        return this.solve(descriptors);
    }

    part2(descriptors: CuboidDescriptor[]): number {
        return this.solve(descriptors);
    }

    solve(descriptors: CuboidDescriptor[]): number {
        const min = descriptors.map(c => [c.x[0], c.y[0], c.z[0]]).flat(2).min();
        const max = descriptors.map(c => [c.x[1], c.y[1], c.z[1]]).flat(2).max() + 1;

        const spaceCuboid = new CuboidNode([[min, max], [min, max], [min, max]], false);

        for (const cuboid of descriptors) {
            cuboid.x[1]++;
            cuboid.y[1]++;
            cuboid.z[1]++;
            spaceCuboid.unionOrDifference(new CuboidNode([cuboid.x, cuboid.y, cuboid.z], cuboid.mode === "on"));
        }
        return spaceCuboid.volumeOfUnion()
    }
}

function zip<T>(...arrays: T[][]): T[][] {
    return arrays[0].map((_, c) => arrays.map(row => row[c]));
}

function* product<T>(...pools: T[][]): IterableIterator<T[]> {
    let i = 0;
    const indexes: number[] = new Array(pools.length).fill(0)
    const result = indexes.map((x, i) => pools[i][x]);
    indexes[0] = -1;
    while (i < indexes.length) {
        if (indexes[i] < pools[i].length - 1) {
            indexes[i]++;
            result[i] = pools[i][indexes[i]];
            i = 0;

            yield result.slice();
        } else {
            indexes[i] = 0;
            result[i] = pools[i][0];
            i++;
        }
    }
}

class CuboidNode {
    readonly dimensions: Tuple[];
    isUnion: boolean;
    children: CuboidNode[] = [];

    constructor(dimensions: Tuple[], isUnion: boolean) {
        this.dimensions = dimensions;
        this.isUnion = isUnion;
    }

    unionOrDifference(node: CuboidNode): void {
        const zippedDimensions = zip(this.dimensions, node.dimensions);
        if (this.isOutside(zippedDimensions)) return;
        if (this.isInside(zippedDimensions)) {
            this.isUnion = node.isUnion;
            this.children = [];
            return;
        }
        if (this.children.length === 0) {
            this.createChildren(zippedDimensions);
        }
        for (const child of this.children) {
            child.unionOrDifference(node);
        }
    }

    isInside(zippedDimensions: Tuple[][]): boolean {
        return zippedDimensions
            .map(dim => dim[1][0] <= dim[0][0] && dim[0][0] < dim[0][1] && dim[0][1] <= dim[1][1])
            .reduce((p, c) => p && c);
    }

    isOutside(zippedDimensions: Tuple[][]): boolean {
        return zippedDimensions
            .map(dim => dim[1][0] >= dim[0][1] || dim[0][0] >= dim[1][1])
            .reduce((p, c) => p || c)
    }

    createChildren(zippedDimensions: Tuple[][]): void {
        const sub: Tuple[][] = [];
        for (const [[start, end], [start2, end2]] of zippedDimensions) {
            const parts = [start, end, start2, end2]
                .filter(x => start <= x && x <= end)
                .unique()
                .sort((a, b) => a - b);
            sub.push(zip(parts.slice(0, -1), parts.slice(1)));
        }
        for (const childDimensions of product(...sub)) {
            this.children.push(new CuboidNode(childDimensions, this.isUnion))
        }
    }

    volumeOfUnion(): number {
        if (this.children.length !== 0) {
            return this.children.map(c => c.volumeOfUnion())
                .reduce((p, c) => p + c);
        }
        if (!this.isUnion) {
            return 0;
        }
        return this.dimensions.map(([start, end]) => Math.abs(end - start))
            .reduce((p, c) => p * c);
    }
}

