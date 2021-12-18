import Challenge from "../../Challenge";

type SnailNumberString = string;

type SnailNumber = (number | SnailNumber)[];

export default class Day18 extends Challenge<SnailNumberString[]> {
    day: string = "day18";

    prepare(riddle: string): SnailNumberString[] {
        return riddle.split("\n").filter(l => l != "");
    }

    part1(numberStrings: SnailNumberString[]): number {
        let sum = numberStrings.shift();
        while (numberStrings.length) {
            sum = this.reduce("[" + sum + "," + numberStrings.shift() + "]");
        }
        const parsedSum: SnailNumber = JSON.parse(sum);
        return this.magnitude(parsedSum);
    }

    part2(numberStrings: SnailNumberString[]): number {
        let max = 0;
        for (const summand1 of numberStrings) {
            for (const summand2 of numberStrings) {
                const sum = this.reduce("[" + summand1 + "," + summand2 + "]");
                const parsedSum: SnailNumber = JSON.parse(sum);
                const magnitude = this.magnitude(parsedSum);
                if (max < magnitude) {
                    max = magnitude;
                }
            }
        }
        return max;
    }

    reduce(numberString: SnailNumberString) {
        let after = numberString;
        let before;
        do {
            do {
                before = after;
                after = this.explode(after);
            } while (after !== before);
            after = this.split(after);
        } while (after !== before);
        return after;
    }

    explode(numberString: SnailNumberString) {
        const [explodeStart, explodeEnd, explodedLeftNum, explodedRightNum] = this.findDeepest(numberString);
        if (explodeStart < 0) {
            return numberString;
        }
        const [num1Start, num1End] = this.findNumber(numberString, explodeStart, -1);
        const newLeftNum = parseInt(numberString.substring(num1Start, num1End)) + explodedLeftNum;
        const [num2Start, num2End] = this.findNumber(numberString, explodeEnd, 1);
        const newRightNum = parseInt(numberString.substring(num2Start, num2End)) + explodedRightNum;
        const before = num1Start > 0
            ? numberString.substring(0, num1Start) + newLeftNum + numberString.substring(num1End, explodeStart)
            : numberString.substring(0, explodeStart);
        const after = num2Start > 0
            ? numberString.substring(explodeEnd, num2Start) + newRightNum + numberString.substring(num2End)
            : numberString.substring(explodeEnd);
        return before + "0" + after;
    }

    findDeepest(numberString: SnailNumberString): number[] {
        let deep = 0;
        for (let i = 0; i < numberString.length; i++) {
            if (numberString[i] === "[") {
                deep++;
                if (deep >= 5) {
                    const match = numberString.substring(i).match(/^\[(\d+),(\d+)\]/);
                    if (match) {
                        return [i, i + match[0].length, parseInt(match[1]), parseInt(match[2])];
                    }
                }
            } else if (numberString[i] === ']') {
                deep--;
            }
        }
        return [-1, -1, -1, -1];
    }

    split(numberString: SnailNumberString) {
        const match = numberString.match(/\d\d/g);
        if (match) {
            const number = parseInt(match[0]) / 2;
            const replacement = "[" + Math.floor(number) + "," + Math.ceil(number) + "]"
            numberString = numberString.replace(match[0], replacement);
        }
        return numberString;
    }

    isNumeric(char: string): boolean {
        return !isNaN(parseInt(char));
    }

    findNumber(numberString: SnailNumberString, start: number, inc: number): number[] {
        while (start < numberString.length && start >= 0) {
            if (this.isNumeric(numberString[start])) {
                let len = inc;
                while (this.isNumeric(numberString[start + len])) len += inc;
                return inc < 0
                    ? [start + len + 1, start + 1]
                    : [start, start + len];
            }
            start += inc;
        }
        return [-1, -1];
    }

    magnitude(numberStringNumber: SnailNumber): number {
        const left = Array.isArray(numberStringNumber[0]) ? this.magnitude(numberStringNumber[0]) : numberStringNumber[0];
        const right = Array.isArray(numberStringNumber[1]) ? this.magnitude(numberStringNumber[1]) : numberStringNumber[1];
        return 3 * left + 2 * right;
    }
}
