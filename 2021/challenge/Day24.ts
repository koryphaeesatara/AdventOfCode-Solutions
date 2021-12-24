import Challenge from "../../Challenge";

type Riddle = string[][];

declare global {
    interface Array<T> {
        chunk(size: number): T[][];
    }
}

Array.prototype.chunk = function <T>(size: number): T[][] {
    let chunks = [];
    for (let i = 0, j = this.length; i < j; i += size) {
        chunks.push(this.slice(i, i + size));
    }
    return chunks;
}
export default class Day24 extends Challenge<Riddle> {
    day: string = "day24";


    prepare(riddle: string): Riddle {
        return riddle.split("\n").filter(l => l !== "").map(l => l.split(" "));
    }

    part1(riddle: Riddle): number | string {
        return this.solve(riddle, (n) => n < 0 ? [9 + n, 9] : [9, 9 - n]);
    }

    part2(riddle: Riddle): number | string {
        return this.solve(riddle, (n) => n < 0 ? [1, 1 - n] : [1 + n, 1]);
    }

    solve(riddle: Riddle, fn: (n: number) => number[]): string {
        const monad = new Array(14).fill(0);
        const parts = riddle.chunk(18);
        const stack = [];

        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            //inp w
            // mul x 0 => x = 0
            // add x z => x = z0*26 + w0 + ?
            // mod x 26 => x = w0 + ?
            // div z 1|26 => z = z0
            const addOnX = parseInt(part[5][2]); //add x ? => x w0 + ? + ?
            // eql x w => x = 0
            // eql x 0 => x = 1
            // mul y 0 => y = 0
            // add y 25 => y = 25
            // mul y x => y = 25
            // add y 1 => y = 26
            // mul z y => z = z0*26
            // mul y 0 => y = 0
            // add y w => y = w
            const addOnY = parseInt(part[15][2]); //add y ? => y = w + ?
            // mul y x => w + ?
            // add z y => z*26 + w + ?

            if (addOnX > 9) {
                stack.push([i, addOnY]);
                continue;
            }
            const value = stack.pop();
            const result = fn(value[1] + addOnX);

            monad[i] = result[0];
            monad[value[0]] = result[1];
        }

        return monad.join("");
    }
}

