/**
 * @Inspired by Jonathan Paulson
 * @OriginalScript in Python https://github.com/jonathanpaulson/AdventOfCode/commit/8fac4b200e1786e8e69dccabf3df8dbdb5d86d74
 *
 * First Challenge that I couldn't solve myself :(
 */

import Challenge from "../../Challenge";

type Amphipoda = 'A' | 'B' | 'C' | 'D' | '.';

interface Caves {
    [key: string]: Amphipoda[];
}

const COSTS = {
    A: 1,
    B: 10,
    C: 100,
    D: 1000
};

function jsonClone<V>(t: V): V {
    return JSON.parse(JSON.stringify(t));
}

export default class Day23 extends Challenge<Caves> {
    day: string = "day23";
    rows: number;

    prepare(riddle: string): Caves {
        const cave = {A: [], B: [], C: [], D: []};
        for (const line of riddle.split("\n")) {
            const matches = line.match(/[A-D]/g);
            if (matches) {
                cave['A'].push(matches[0] as Amphipoda);
                cave['B'].push(matches[1] as Amphipoda);
                cave['C'].push(matches[2] as Amphipoda);
                cave['D'].push(matches[3] as Amphipoda);
            }
        }
        return cave;
    }

    part1(caves: Caves): number {
        this.rows = Object.values(caves)[0].length;
        return this.solve(caves, new Array(11).fill('.'));
    }

    part2(caves: Caves): number {
        this.solveCache = new Map<string, number>();
        const additions = {
            A: ['D', 'D'],
            B: ['C', 'B'],
            C: ['B', 'A'],
            D: ['A', 'C'],
        };
        for (const [k, cave] of Object.entries(caves)) {
            caves[k] = [cave[0], ...additions[k], cave[1]];
        }
        this.rows = Object.values(caves)[0].length;
        return this.solve(caves, new Array(11).fill('.'));
    }

    solveCache = new Map<string, number>();

    solve(caves: Caves, top: Amphipoda[]): number {
        this.show(caves, top);
        if (this.done(caves)) {
            return 0;
        }
        const key = JSON.stringify([...arguments]);
        if (this.solveCache.has(key)) {
            return this.solveCache.get(key);
        }
        for (let topIdx = 0; topIdx < top.length; topIdx++) {
            const currentAmp = top[topIdx];
            if (caves[currentAmp] && this.canMoveTo(currentAmp, caves[currentAmp])) {
                if (this.clearPath(currentAmp, topIdx, top)) {
                    const destIdx = this.destIdx(caves[currentAmp]);
                    const distance = destIdx + 1 + Math.abs(this.caveIdx(currentAmp) - topIdx);
                    const cost = COSTS[currentAmp] * distance;
                    const nextTop = [...top];
                    nextTop[topIdx] = '.';
                    top[topIdx] = '.';
                    const nextCaves = jsonClone(caves);
                    nextCaves[currentAmp][destIdx] = currentAmp;
                    return cost + this.solve(nextCaves, nextTop);
                }
            }
        }

        let result = 1e9;
        for (const [caveIdx, cave] of Object.entries(caves) as [Amphipoda, Amphipoda[]][]) {
            const topIdx = this.topIdx(cave);
            if (!this.canMoveFrom(caveIdx, cave) || topIdx === undefined) {
                continue;
            }
            const current = cave[topIdx];
            for (let topIdx2 = 0; topIdx2 < top.length; topIdx2++) {
                if ([2, 4, 6, 8].includes(topIdx2) || top[topIdx2] !== '.') {
                    continue;
                }
                if (this.clearPath(caveIdx, topIdx2, top)) {
                    const distance = topIdx + 1 + Math.abs(topIdx2 - this.caveIdx(caveIdx));
                    const nextTop = [...top];
                    nextTop[topIdx2] = current;
                    const nextCaves = jsonClone(caves);
                    nextCaves[caveIdx][topIdx] = '.';
                    result = this.min(result, COSTS[current] * distance + this.solve(nextCaves, nextTop));
                }
            }
        }
        this.solveCache.set(key, result);
        return result;
    }

    done(caves: Caves): boolean {
        for (const [caveIdx, cave] of Object.entries(caves) as [Amphipoda, Amphipoda[]][]) {
            for (const element of cave) {
                if (element !== caveIdx) {
                    return false;
                }
            }
        }
        return true;
    }

    canMoveFrom(key: Amphipoda, cave: Amphipoda[]): boolean {
        for (const element of cave) {
            if (element != key && element != '.') {
                return true;
            }
        }
        return false;
    }

    canMoveTo(key: Amphipoda, cave: Amphipoda[]): boolean {
        for (const element of cave) {
            if (element !== key && element !== '.') {
                return false;
            }
        }
        return true;
    }

    caveIdx(amp: Amphipoda): number | undefined {
        return {'A': 2, 'B': 4, 'C': 6, 'D': 8}[amp];
    }

    topIdx(cave: Amphipoda[]): number | undefined {
        for (let elementIdx = 0; elementIdx < cave.length; elementIdx++) {
            if (cave[elementIdx] !== '.') {
                return elementIdx;
            }
        }
        return undefined;
    }

    destIdx(cave: Amphipoda[]): number | -1 {
        return cave.lastIndexOf('.');
    }

    between(topIdx: number, caves: Amphipoda, topIdx2: number): boolean {
        return (this.caveIdx(caves) < topIdx && topIdx < topIdx2) || (topIdx2 < topIdx && topIdx < this.caveIdx(caves));
    }

    clearPath(amp: Amphipoda, topIdx: number, top: Amphipoda[]): boolean {
        for (let topIdx2 = 0; topIdx2 < top.length; topIdx2++) {
            if (this.between(topIdx2, amp, topIdx) && top[topIdx2] !== '.') {
                return false;
            }
        }
        return true;
    }

    min(...min: number[]) {
        return min.reduce((p, c) => p < c ? p : c);
    }

    show(caves: Caves, top: Amphipoda[]): void {
        const C: { [key: string]: number } = {};
        for (const topElement of top) {
            C[topElement] = (C[topElement] || 0) + 1;
        }
        for (const [, cave] of Object.entries(caves)) {
            for (const caveElement of cave) {
                C[caveElement] = (C[caveElement] || 0) + 1
            }
        }

        if (C['A'] !== this.rows) throw "Counting A Fields: Expected: " + this.rows + " Actual: " + C['A'];
        if (C['B'] !== this.rows) throw "Counting B Fields: Expected: " + this.rows + " Actual: " + C['B'];
        if (C['C'] !== this.rows) throw "Counting C Fields: Expected: " + this.rows + " Actual: " + C['C'];
        if (C['D'] !== this.rows) throw "Counting D Fields: Expected: " + this.rows + " Actual: " + C['D'];
        if (C['.'] !== 11) throw "Counting free Fields: Expected: 11 Actual: " + C['.'];

        if (top[2] !== '.') throw "Top 2 is not free";
        if (top[4] !== '.') throw "Top 4 is not free";
        if (top[6] !== '.') throw "Top 6 is not free";
        if (top[8] !== '.') throw "Top 8 is not free";
    }

}