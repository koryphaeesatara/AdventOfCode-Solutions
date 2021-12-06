import Challenge from "../../Challenge";

interface Line {
    x0: number
    y0: number
    x1: number
    y1: number;
}

class Field {
    private minX: number;
    private minY: number;
    private field: number[][] = [];

    constructor(minX: number, minY: number, maxX: number, maxY: number) {
        this.minX = minX;
        this.minY = minY;
        this.initialize(maxX - minX + 1, maxY - minY + 1);
    }

    draw(line: Line) {
        let dx = line.x1 === line.x0 ? 0 : (line.x1 - line.x0 > 0 ? 1 : -1);
        let dy = line.y1 === line.y0 ? 0 : (line.y1 - line.y0 > 0 ? 1 : -1);
        let x = line.x0 - dx;
        let y = line.y0 - dy;
        do {
            x += dx;
            y += dy;
            this.field[x - this.minX][y - this.minY]++;
        } while (line.x1 !== x || line.y1 !== y);
    }

    private initialize(width: number, height: number) {
        this.field = [];
        for (let x = 0; x < width; x++) {
            const row = [];
            for (let y = 0; y < height; y++) {
                row.push(0);
            }
            this.field.push(row)
        }
    }

    countCrosses() {
        let crosses = 0;
        for (const row of this.field) {
            for (const cell of row) {
                if (cell > 1) {
                    crosses++;
                }
            }
        }
        return crosses;
    }
}

export default class Day5 extends Challenge<Line[]> {
    day: string = "day5";

    prepare(riddle: string): Line[] {
        return riddle.split("\n")
            .map(line => line.match(/(\d+),(\d+) -> (\d+),(\d+)/))
            .filter(l => l?.length === 5)
            .map(line => {
                return {
                    x0: parseInt(line[1]),
                    y0: parseInt(line[2]),
                    x1: parseInt(line[3]),
                    y1: parseInt(line[4])
                }
            })
    }

    part1(lines: Line[]): number {
        let orthogonalLines = lines.filter(line => line.x0 === line.x1 || line.y0 === line.y1);
        let minX = orthogonalLines[0].x0;
        let maxX = orthogonalLines[0].x0;
        let minY = orthogonalLines[0].y0;
        let maxY = orthogonalLines[0].y0;
        orthogonalLines.forEach(line => {
            if (minY > line.y0) {
                minY = line.y0;
            }
            if (minY > line.y1) {
                minY = line.y1;
            }
            if (maxY < line.y0) {
                maxY = line.y0;
            }
            if (maxY < line.y1) {
                maxY = line.y1;
            }
            if (minX > line.x0) {
                minX = line.x0;
            }
            if (minX > line.x1) {
                minX = line.x1;
            }
            if (maxX < line.x0) {
                maxX = line.x0;
            }
            if (maxX < line.x1) {
                maxX = line.x1;
            }
        })
        let field = new Field(minX, minY, maxX, maxY);
        orthogonalLines.forEach(line => field.draw(line));
        return field.countCrosses();
    }

    part2(lines: Line[]): number {

        let orthogonalLines = lines.filter(line => line.x0 === line.x1 || line.y0 === line.y1 || Math.abs(line.y0 - line.y1) === Math.abs(line.x0 - line.x1));
        let minX = orthogonalLines[0].x0;
        let maxX = orthogonalLines[0].x0;
        let minY = orthogonalLines[0].y0;
        let maxY = orthogonalLines[0].y0;
        orthogonalLines.forEach(line => {
            if (minY > line.y0) {
                minY = line.y0;
            }
            if (minY > line.y1) {
                minY = line.y1;
            }
            if (maxY < line.y0) {
                maxY = line.y0;
            }
            if (maxY < line.y1) {
                maxY = line.y1;
            }
            if (minX > line.x0) {
                minX = line.x0;
            }
            if (minX > line.x1) {
                minX = line.x1;
            }
            if (maxX < line.x0) {
                maxX = line.x0;
            }
            if (maxX < line.x1) {
                maxX = line.x1;
            }
        })
        let field = new Field(minX, minY, maxX, maxY);
        orthogonalLines.forEach(line => field.draw(line));
        return field.countCrosses()
    }
}