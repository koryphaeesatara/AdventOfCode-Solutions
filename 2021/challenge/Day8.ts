import Challenge from "../../Challenge";


interface Line {
    befores: string[];
    afters: string[];
}

declare global {
    interface String {
        sort(): string;
    }

    interface Array<T> {
        intersect(other: Array<T>): Array<T>;

        removeAll(other: Array<T>): Array<T>;
        includesAll(other: Array<T>): boolean;
    }
}
String.prototype.sort = function (): string {
    return this.split("").sort().join("");
}
Array.prototype.intersect = function <T>(this: Array<T>, other: Array<T>): Array<T> {
    return this.filter(e => other.includes(e));
}
Array.prototype.removeAll = function <T>(this: Array<T>, other: Array<T>): Array<T> {
    return this.filter(e => !other.includes(e));
}
Array.prototype.includesAll = function <T>(this: Array<T>, other: Array<T>): boolean{
    return other.intersect(this).length === other.length;
}

interface Figur {
    form: SegmentField<number>;
    symbol: string;
}

interface SegmentField<T> {
    [key: number]: T;
}

//                               a  b  c  d  e  f  g
const SEGMENT_0: Figur = {form: [1, 1, 1, 0, 1, 1, 1], symbol: "0"};
const SEGMENT_1: Figur = {form: [0, 0, 1, 0, 0, 1, 0], symbol: "1"};
const SEGMENT_2: Figur = {form: [1, 0, 1, 1, 1, 0, 1], symbol: "2"};
const SEGMENT_3: Figur = {form: [1, 0, 1, 1, 0, 1, 1], symbol: "3"};
const SEGMENT_4: Figur = {form: [0, 1, 1, 1, 0, 1, 0], symbol: "4"};
const SEGMENT_5: Figur = {form: [1, 1, 0, 1, 0, 1, 1], symbol: "5"};
const SEGMENT_6: Figur = {form: [1, 1, 0, 1, 1, 1, 1], symbol: "6"};
const SEGMENT_7: Figur = {form: [1, 0, 1, 0, 0, 1, 0], symbol: "7"};
const SEGMENT_8: Figur = {form: [1, 1, 1, 1, 1, 1, 1], symbol: "8"};
const SEGMENT_9: Figur = {form: [1, 1, 1, 1, 0, 1, 1], symbol: "9"};

const FIGURES: Figur[] = [
    SEGMENT_0, SEGMENT_1, SEGMENT_2, SEGMENT_3, SEGMENT_4,
    SEGMENT_5, SEGMENT_6, SEGMENT_7, SEGMENT_8, SEGMENT_9
];


export default class Day8 extends Challenge<Line[]> {
    day: string = "day8";

    prepare(riddle: string): Line[] {
        return riddle.split("\n")
            .filter(n => n !== "")
            .map(line => line.split("|"))
            .map(line => {
                return {
                    befores: line[0].split(" ").filter(num => num !== ""),
                    afters: line[1].split(" ").filter(num => num !== "")
                }
            });
    }

    part1(lines: Line[]): number {
        let counts = 0;
        for (const line of lines) {
            for (const after of line.afters) {
                if ([2, 3, 4, 7].includes(after.length)) {
                    counts++;
                }
            }
        }
        return counts;
    }

    part2(lines: Line[]): number {
        let sumOfAlgorithm = 0;
        for (const line of lines) {
            sumOfAlgorithm += Day8.numOfLineByAlgorithm(line);
        }
        console.log("Sum of Algorithm: " + sumOfAlgorithm);
        let sumOfSetTheory1 = 0;
        for (const line of lines) {
            sumOfSetTheory1 += Day8.numOfLineBySetTheoryBySegments(line);
        }
        console.log("Sum of Set Theory by Segments: " + sumOfSetTheory1);
        let sumOfSetTheory2 = 0;
        for (const line of lines) {
            sumOfSetTheory2 += Day8.numOfLineBySetTheoryByNumbers(line);
        }
        console.log("Sum of Set Theory by Numbers: " + sumOfSetTheory2);
        return sumOfSetTheory2;
    }

    private static numOfLineBySetTheoryBySegments(segSignals: Line): number {
        const segCF = segSignals.befores.filter(signals => signals.length === 2)[0].split("");
        const segACF = segSignals.befores.filter(signals => signals.length === 3)[0].split("");
        const segBCDF = segSignals.befores.filter(signals => signals.length === 4)[0].split("");
        const segABCDEFG = segSignals.befores.filter(signals => signals.length === 7)[0].split("");

        const nums235 = segSignals.befores.filter(signals => signals.length === 5).map(num => num.split(""));
        const nums069 = segSignals.befores.filter(signals => signals.length === 6).map(num => num.split(""));

        const segA = segACF.removeAll(segCF)[0];
        const segADG = nums235[0].intersect(nums235[1]).intersect(nums235[2]);
        const segD = segADG.intersect(segBCDF)[0];
        const segG = segADG.removeAll([segA]).removeAll([segD])[0];
        const segE = segABCDEFG.removeAll(segACF).removeAll(segBCDF).removeAll([segG])[0];
        const segABFG = nums069[0].intersect(nums069[1]).intersect(nums069[2]);
        const segB = segABFG.removeAll(segACF).removeAll([segG])[0];
        const segF = segABFG.removeAll([segA]).removeAll([segB]).removeAll([segG])[0];
        const segC = segCF.removeAll([segF])[0];

        const segMap = {
            [(segC + segF).sort()]: "1",
            [(segA + segC + segD + segE + segG).sort()]: "2",
            [(segA + segC + segD + segF + segG).sort()]: "3",
            [(segB + segC + segD + segF).sort()]: "4",
            [(segA + segB + segD + segF + segG).sort()]: "5",
            [(segA + segB + segD + segE + segF + segG).sort()]: "6",
            [(segA + segC + segF).sort()]: "7",
            [(segA + segB + segC + segD + segE + segF + segG).sort()]: "8",
            [(segA + segB + segC + segD + segF + segG).sort()]: "9",
            [(segA + segB + segC + segE + segF + segG).sort()]: "0",
        }
        let num = "";
        for (const after of segSignals.afters) {
            num += segMap[after.sort()];
        }

        return parseInt(num);
    }

    private static numOfLineBySetTheoryByNumbers(segSignals: Line): number {
        const num1 = segSignals.befores.filter(signals => signals.length === 2)[0].split("");
        const num7 = segSignals.befores.filter(signals => signals.length === 3)[0].split("");
        const num4 = segSignals.befores.filter(signals => signals.length === 4)[0].split("");
        const num8 = segSignals.befores.filter(signals => signals.length === 7)[0].split("");

        const nums235 = segSignals.befores.filter(signals => signals.length === 5).map(num => num.split(""));
        const nums069 = segSignals.befores.filter(signals => signals.length === 6).map(num => num.split(""));

        const num3 = nums235.filter(sym => sym.includesAll(num1))[0];
        const num9 = nums069.filter(sym => sym.includesAll(num3))[0];
        const num2 = nums235.filter(sym => sym.includesAll(num8.removeAll(num9)))[0];
        const num5 = nums235.removeAll([num2, num3])[0];
        const num6 = nums069.removeAll([num9]).filter(sym => sym.includesAll(num5))[0];
        const num0 = nums069.removeAll([num6, num9])[0];

        const numMap = {
            [num1.sort().join("")]: "1",
            [num2.sort().join("")]: "2",
            [num3.sort().join("")]: "3",
            [num4.sort().join("")]: "4",
            [num5.sort().join("")]: "5",
            [num6.sort().join("")]: "6",
            [num7.sort().join("")]: "7",
            [num8.sort().join("")]: "8",
            [num9.sort().join("")]: "9",
            [num0.sort().join("")]: "0",
        }
        let num = "";
        for (const after of segSignals.afters) {
            num += numMap[after.sort()];
        }
        return parseInt(num);
    }

    private static numOfLineByAlgorithm(segSignals: Line): number {
        const segmentField: SegmentField<string[]> = {
            0: "abcdefg".split(""),
            1: "abcdefg".split(""),
            2: "abcdefg".split(""),
            3: "abcdefg".split(""),
            4: "abcdefg".split(""),
            5: "abcdefg".split(""),
            6: "abcdefg".split(""),
        };
        const nums: { num?: string, signals: string[], after: boolean }[] = [];
        for (const rawSignals of segSignals.befores) {
            nums.push({
                signals: rawSignals.split(""),
                after: false
            })
        }
        for (const rawSignals of segSignals.afters) {
            nums.push({
                signals: rawSignals.split(""),
                after: true
            })
        }
        let unresolvedNums = nums;
        do {
            for (const unresolvedNum of unresolvedNums) {
                const figure = Day8.findFigure(segmentField, unresolvedNum.signals);
                if (figure !== null) {
                    unresolvedNum.num = figure.symbol;
                    Day8.intersectSegmentField(segmentField, unresolvedNum.signals, figure);
                }
            }
            unresolvedNums = unresolvedNums.filter(n => n.num === undefined);
        } while (unresolvedNums.length > 0);

        let num = nums.filter(n => n.after).map(n => n.num).join("");
        return parseInt(num);
    }

    private static findFigure(segmentField: SegmentField<string[]>, signals: string[]): Figur {
        const availableFiguresFromLength = FIGURES.filter(f => Object.values(f.form).filter(n => n == 1).length === signals.length);
        const availableFigures = [];
        mainLoop:
            for (const availableFigure of availableFiguresFromLength) {
                for (const [field, value] of Object.entries(availableFigure.form)) {
                    if ((value === 1 && segmentField[field].intersect(signals).length === 0) || (value === 0 && segmentField[field].removeAll(signals).length === 0)) {
                        continue mainLoop;
                    }
                }
                availableFigures.push(availableFigure);
            }
        if (availableFigures.length == 1) {
            return availableFigures.pop();
        }
        return null;
    }

    private static intersectSegmentField(segmentField: SegmentField<string[]>, signals: string[], figure: Figur) {
        for (const [field, value] of Object.entries(figure.form)) {
            if (value === 1) {
                segmentField[field] = segmentField[field].intersect(signals);
            } else {
                segmentField[field] = segmentField[field].removeAll(signals);
            }
        }
    }
}
