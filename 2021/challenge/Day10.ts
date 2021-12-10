import Challenge from "../../Challenge";

type Lines = string[];

export default class Day10 extends Challenge<Lines> {
    day: string = "day10";

    prepare(riddle: string): Lines {
        return riddle.split("\n")
            .filter(l => l !== "");
    }

    cleanLine(line: string): string {
        while (line.match(/{}|\[]|\(\)|<>/g)) {
            line = line.replace(/{}|\[]|\(\)|<>/g, "")
        }
        return line;
    }

    part1(lines: Lines): number {
        const map = {")": 3, "]": 57, "}": 1197, ">": 25137}
        let sum = 0;
        for (const line of lines) {
            let cleanedLine = this.cleanLine(line);
            let matches = cleanedLine.match(/[}\])>]/g);
            if (matches !== null) {
                sum += map[matches[0]] || 0;
            }
        }
        return sum;
    }

    part2(lines: Lines): number {
        const map = {"(": 1, "[": 2, "{": 3, "<": 4};
        let sums = [];
        for (const line of lines) {
            let cleanedLine = this.cleanLine(line);
            if (cleanedLine.match(/[}\])>]/g) === null) {
                let lineSum = 0;
                for (const char of cleanedLine.split("").reverse()) {
                    lineSum = lineSum * 5 + map[char];
                }
                sums.push(lineSum);
            }
        }
        sums = sums.sort((a, b) => a - b);
        return sums[Math.floor(sums.length / 2)];
    }
}