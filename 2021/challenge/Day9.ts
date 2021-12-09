import Challenge from "../../Challenge";

type HeightMap = number[][];

interface Point {
    x: number;
    y: number;
}

export default class Day9 extends Challenge<HeightMap> {
    day: string = "day9";

    prepare(riddle: string): HeightMap {
        return riddle.split("\n")
            .filter(l => l !== "")
            .map(l => l.split("")
                .map(c => parseInt(c)));
    }

    part1(heightMap: HeightMap): number {
        let points = this.getLowest(heightMap);
        let sumOfLowRisk = points.length;
        for (const point of points) {
            sumOfLowRisk += heightMap[point.y][point.x];
        }
        return sumOfLowRisk;
    }

    getLowest(heightMap: HeightMap) {
        let points: Point[] = [];
        for (let y = 0; y < heightMap.length; y++) {
            for (let x = 0; x < heightMap[y].length; x++) {
                let lowest = true;
                for (const [dy, dx] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) {
                    if (!(heightMap[y + dy] === undefined || heightMap[y + dy][x + dx] === undefined) && heightMap[y][x] >= heightMap[y + dy][x + dx]) {
                        lowest = false;
                        break;
                    }
                }
                if (lowest) {
                    points.push({x, y})
                }
            }
        }
        return points;
    }

    part2(heightMap: HeightMap): number {
        let points = this.getLowest(heightMap);
        let basins = this.getBasins(heightMap, points);
        basins.sort((a, b) => a - b);
        return basins.pop() * basins.pop() * basins.pop();
    }

    private getBasins(heightMap: HeightMap, points: Point[]): number[] {
        let basinFields = [];
        for (const point of points) {
            basinFields.push(this.countBasinFields(heightMap, point));
        }
        return basinFields;
    }

    private countBasinFields(heightMap: HeightMap, point: Point, counted: string[] = []): number {
        const {x, y} = point;
        counted.push(x + "-" + y);
        let size = 1;
        for (const [dy, dx] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) {
            let y2 = y + dy;
            let x2 = x + dx;
            if (!(heightMap[y2] === undefined || heightMap[y2][x2] === undefined || heightMap[y2][x2] === 9 || counted.includes(x2 + "-" + y2))
                && (heightMap[y][x] <= heightMap[y2][x2])) {
                size += this.countBasinFields(heightMap, {y: y2, x: x2}, counted);
            }
        }
        return size;
    }
}