import Challenge from "../../Challenge";

type Crabs = number[];

function sum(nums: number[]): number {
    return nums.reduce((p, c) => p + c);
}

function min(...nums: number[]): number {
    return nums.reduce((p, c) => p < c ? p : c);
}

export default class Day7 extends Challenge<number[]> {
    day: string = "day7";

    prepare(riddle: string): number[] {
        return riddle.split(",")
            .filter(n => n !== "")
            .map(e => parseInt(e));
    }

    part1(crabs: Crabs): number {
        crabs = crabs.sort((a, b) => a - b);
        const median = crabs[Math.ceil(crabs.length / 2)];
        return sum(crabs.map(n => Math.abs(median - n)));
    }

    part2(crabs: Crabs): number {
        crabs = crabs.sort((a, b) => a - b);
        const avg = (crabs.reduce((p, c) => p + c) / crabs.length);
        const calcFuel = (line) => sum(crabs.map(n => Math.abs(line - n) * (Math.abs(line - n) + 1) / 2));
        return min(calcFuel(Math.ceil(avg)), calcFuel(Math.floor(avg)));
    }

}