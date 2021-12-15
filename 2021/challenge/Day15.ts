import Challenge from "../../Challenge";

type ChitonMap = number[][];

export default class Day15 extends Challenge<ChitonMap> {
    day: string = "day15";

    prepare(riddle: string): ChitonMap {
        return riddle.split("\n")
            .filter(l => l !== "")
            .map(l => l.split("")
                .map(c => parseInt(c)));
    }

    part1(chitonMap: ChitonMap): number {
        return this.routeToLast(chitonMap);
    }

    part2(chitonMap: ChitonMap): number {
        for (const chitonRow of chitonMap) {
            let oriLength = chitonRow.length;
            for (let i = 1; i < 5; i++) {
                for (let x = 0; x < oriLength; x++) {
                    let next = chitonRow[x] + i;
                    while (next > 9) next -= 9;
                    chitonRow.push(next);
                }
            }
        }
        let oriLength = chitonMap.length;
        for (let i = 1; i < 5; i++) {
            for (let y = 0; y < oriLength; y++) {
                let nextRow = [];
                for (const chitonRow of chitonMap[y]) {
                    let next = chitonRow + i;
                    while (next > 9) next -= 9;
                    nextRow.push(next);
                }
                chitonMap.push(nextRow);
            }
        }

        return this.routeToLast(chitonMap);
    }

    private routeToLast(chitonMap: ChitonMap) {
        let distanceMap = this.dijkstra(chitonMap);
        let lastRow = distanceMap[distanceMap.length - 1];
        return lastRow[lastRow.length - 1];
    }

    createDistanceMap(chitonMap: ChitonMap): number[][] {
        const distanceMap: number[][] = [];
        for (const chitonRow of chitonMap) {
            const row: number[] = [];
            for (const chiton of chitonRow) {
                row.push(undefined)
            }
            distanceMap.push(row)
        }
        return distanceMap;
    }

    dijkstra(chitonMap: ChitonMap) : number[][]{
        let Q = [];
        const distanceMap = this.createDistanceMap(chitonMap);
        distanceMap[0][0] = 0;
        Q.push([0, 0])
        const notQ = new Set<string>();
        while (Q.length) {
            Q = Q.sort((a, b) => distanceMap[a[0]][a[1]] - distanceMap[b[0]][b[1]]);
            const [currentY, currentX] = Q.shift();
            notQ.add(currentY + "-" + currentX);
            let neighbors = [[currentY, currentX + 1], [currentY, currentX - 1], [currentY + 1, currentX], [currentY - 1, currentX]];
            for (const [neighborY, neighborX] of neighbors) {
                if (chitonMap[neighborY] !== undefined && chitonMap[neighborY][neighborX] !== undefined)
                    if (!notQ.has(neighborY + "-" + neighborX)) {
                        const distanceWithCurrent = distanceMap[currentY][currentX] + chitonMap[neighborY][neighborX];
                        const actualNeighborDistance = distanceMap[neighborY][neighborX];
                        if (actualNeighborDistance === undefined) {
                            Q.push([neighborY, neighborX]);
                        }
                        if (actualNeighborDistance === undefined || distanceWithCurrent < actualNeighborDistance) {
                            distanceMap[neighborY][neighborX] = distanceWithCurrent;
                        }
                    }
            }
        }
        return distanceMap;
    }

}