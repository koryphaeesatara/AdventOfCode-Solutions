import Challenge from "../../Challenge";

type OktopusMap = number[][];

export default class Day11 extends Challenge<OktopusMap> {
    day: string = "day11";

    prepare(riddle: string): OktopusMap {
        return riddle.split("\n")
            .filter(l => l !== "")
            .map(l => l.split("")
                .map(c => parseInt(c)));
    }


    part1(lines: OktopusMap): number {
        let flashes = 0;
        let steps = 100;
        while (steps-- > 0) {
            for (let y = 0; y < lines.length; y++) {
                for (let x = 0; x < lines[y].length; x++) {
                    lines[y][x]++;
                  }
            }
            let isFlashed = true;
            while (isFlashed){
                isFlashed = false;
                for (let y = 0; y < lines.length; y++) {
                    for (let x = 0; x < lines[y].length; x++) {
                        if (lines[y][x] >= 10) {
                            flashes++;
                            isFlashed = true;
                            lines[y][x] = -100;
                            for (const [dy, dx] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) {
                                if (lines[dy + y] !== undefined && lines[dy + y][dx + x] !== undefined) {
                                    lines[dy + y][dx + x]++;
                                }
                            }
                        }
                    }
                }
            }
            for (let y = 0; y < lines.length; y++) {
                for (let x = 0; x < lines[y].length; x++) {
                    if (lines[y][x] > 9 || lines[y][x] < 0) {
                        lines[y][x] = 0;
                    }
                }
            }
        }
        return flashes;
    }

    part2(lines: OktopusMap): number {
        let flashes = 0;
        let step = 0;
        while (true) {
            step++;
            for (let y = 0; y < lines.length; y++) {
                for (let x = 0; x < lines[y].length; x++) {
                    lines[y][x]++;
                }
            }
            let isFlashed = true;
            while (isFlashed){
                isFlashed = false;
                for (let y = 0; y < lines.length; y++) {
                    for (let x = 0; x < lines[y].length; x++) {
                        if (lines[y][x] >= 10) {
                            flashes++;
                            isFlashed = true;
                            lines[y][x] = -1000;
                            for (const [dy, dx] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) {
                                if (lines[dy + y] !== undefined && lines[dy + y][dx + x] !== undefined) {
                                    lines[dy + y][dx + x]++;
                                }
                            }
                        }
                    }
                }
            }
            let flashCount = 0;
            for (let y = 0; y < lines.length; y++) {
                for (let x = 0; x < lines[y].length; x++) {
                    if (lines[y][x] > 9 || lines[y][x] < 0) {
                        lines[y][x] = 0;
                        flashCount++;
                    }
                }
            }
            if(flashCount === 100){
                return step;
            }
        }
    }

}