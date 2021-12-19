import Challenge from "../../Challenge";

interface Position {
    x: number,
    y: number,
    z: number
}

interface Scanner {
    name: string;
    beacons: Position[];
}

interface Matrix extends Position {
    rx: 1 | -1;
    ry: 1 | -1;
    rz: 1 | -1;
    orient: Orient
}

type Orient = (x, y, z) => Position;

const XYZ: Orient = (x, y, z) => ({x: x, y: y, z: z});
const XZY: Orient = (x, y, z) => ({x: x, y: z, z: y});
const YXZ: Orient = (x, y, z) => ({x: y, y: x, z: z});
const YZX: Orient = (x, y, z) => ({x: y, y: z, z: x});
const ZXY: Orient = (x, y, z) => ({x: z, y: x, z: y});
const ZYX: Orient = (x, y, z) => ({x: z, y: y, z: x});

const Orients: Orient[] = [XYZ, XZY, YXZ, YZX, ZXY, ZYX,];

const rotationPerm: (-1 | 1)[][] = [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]];

class Cluster {
    beacons: Map<string, Position> = new Map<string, Position>();

    findMostEquality(beacons: Position[]): { max: number, matrix: Matrix } {
        const maxMatrix: Matrix = {x: 0, y: 0, z: 0, rx: 1, ry: 1, rz: 1, orient: XYZ};
        let max = 0;
        for (const beacon1 of beacons) {
            for (const beacon2 of this.beacons.values()) {
                for (const [rx, ry, rz] of rotationPerm) {
                    for (const orient of Orients) {
                        const shift = orient(beacon1.x * rx, beacon1.y * ry, beacon1.z * rz,);
                        const currentMatrix: Matrix = {
                            x: beacon2.x - shift.x,
                            y: beacon2.y - shift.y,
                            z: beacon2.z - shift.z,
                            rx: rx,
                            ry: ry,
                            rz: rz,
                            orient: orient
                        };
                        let countEquals = this.countEquals(beacons, currentMatrix);
                        if (max < countEquals) {
                            max = countEquals;
                            maxMatrix.x = currentMatrix.x;
                            maxMatrix.y = currentMatrix.y;
                            maxMatrix.z = currentMatrix.z;
                            maxMatrix.rx = currentMatrix.rx;
                            maxMatrix.ry = currentMatrix.ry;
                            maxMatrix.rz = currentMatrix.rz;
                            maxMatrix.orient = currentMatrix.orient;
                        }
                    }
                }
            }
        }
        return {max, matrix: maxMatrix};
    }

    add(beacons: Position[], matrix: Matrix) {
        for (const beacon of beacons) {
            let pos = this.move(beacon, matrix);
            this.beacons.set(pos.x + "-" + pos.y + "-" + pos.z, pos);
        }
    }


    move(pos: Position, matrix: Matrix): Position {
        let position = matrix.orient(
            (pos.x * matrix.rx),
            (pos.y * matrix.ry),
            (pos.z * matrix.rz)
        );
        return {
            x: position.x + matrix.x,
            y: position.y + matrix.y,
            z: position.z + matrix.z,
        };
    }

    countEquals(beacons: Position[], matrix: Matrix) {
        let count = 0;
        for (const beacon of beacons) {
            let pos = this.move(beacon, matrix);
            if (this.beacons.get(pos.x + "-" + pos.y + "-" + pos.z) !== undefined) {
                count++;
            }
        }
        return count;
    }
}

export default class Day19 extends Challenge<Scanner[]> {
    day: string = "day19";

    prepare(riddle: string): Scanner[] {
        return riddle.split("\n\n")
            .map(s => s.split("\n"))
            .map(s => {
                return {
                    name: s.shift(),
                    beacons: s.filter(b => b !== "")
                        .map(b => b.split(","))
                        .map(b => {
                            return {
                                x: parseInt(b[0]),
                                y: parseInt(b[1]),
                                z: parseInt(b[2])
                            }
                        })
                }
            });
    }

    static _cachedCalc: { [key: string]: { cluster: Cluster, includes: Matrix[] } } = {};

    // Quick and Dirty, not performant but it works. Cached for seconds Part
    static cachedCalc(scanners: Scanner[]): { cluster: Cluster, includes: Matrix[] } {
        let s = JSON.stringify(scanners);
        let cachedCalcElement = Day19._cachedCalc[s];
        if (cachedCalcElement !== undefined) {
            return cachedCalcElement;
        }
        let cluster = new Cluster();
        let includes: Matrix[] = [];
        cluster.add(scanners.shift().beacons, {x: 0, y: 0, z: 0, rx: 1, ry: 1, rz: 1, orient: XYZ});
        while (scanners.length) {
            let scanner = scanners.shift();
            const {max, matrix} = cluster.findMostEquality(scanner.beacons);
            if (max >= 3) {
                cluster.add(scanner.beacons, matrix);
                includes.push(matrix);
            } else {
                scanners.push(scanner);
            }
            console.log(scanners.length);
        }
        return this._cachedCalc[s] = {cluster, includes};
    }

    part1(scanners: Scanner[]): number {
        let {cluster} = Day19.cachedCalc(scanners);
        return cluster.beacons.size;
    }

    part2(scanners: Scanner[]): number {
        let {includes} = Day19.cachedCalc(scanners);
        let max = 0;
        for (const include1 of includes) {
            for (const include2 of includes) {
                let distance = Math.abs(include1.x - include2.x)
                    + Math.abs(include1.y - include2.y)
                    + Math.abs(include1.z - include2.z);
                if (max < distance) max = distance;
            }
        }
        return max;
    }
}

