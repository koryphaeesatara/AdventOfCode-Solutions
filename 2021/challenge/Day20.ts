import Challenge from "../../Challenge";

type Riddle = {
    algorithm: number[];
    inputImage: number[][];
};
export default class Day20 extends Challenge<Riddle> {
    day: string = "day20";
    flashing = false;

    prepare(riddle: string): Riddle {
        let strings = riddle.split("\n\n");
        return {
            algorithm: strings[0]
                .replace(/#/g, "1")
                .replace(/\./g, "0")
                .split("")
                .map(c => parseInt(c)),
            inputImage: strings[1].split("\n")
                .filter(l => l !== "")
                .map(l => l.split("").map(c => c === "#" ? 1 : 0))
        };
    }

    part1(riddle: Riddle): number {
        return this.loopAlgorithm(riddle, 2);
    }

    part2(riddle: Riddle): number {
        return this.loopAlgorithm(riddle, 50);
    }

    loopAlgorithm(riddle: Riddle, loop: number): number {
        let next = riddle.inputImage;
        this.flashing = false;
        for (let i = 0; i < loop; i++) {
            next = this.nextImage(next, riddle.algorithm);
            this.flashing = riddle.algorithm[0] === 1 && !this.flashing;
        }
        let count = 0;
        for (const row of next) {
            for (const cell of row) {
                if (cell === 1) {
                    count++;
                }
            }
        }
        return count;
    }

    oversizeImage(image: number[][], oversize = 20): number[][] {
        const oversized: number[][] = [];
        const around = this.flashing ? 1 : 0;

        for (let i = 0; i < oversize; i++) {
            oversized.push(new Array(image[0].length + oversize * 2).fill(around));
        }
        for (const imageRow of image) {
            const row = new Array(oversize).fill(around);
            row.push(...imageRow);
            row.push(...new Array(oversize).fill(around))
            oversized.push(row)
        }
        for (let i = 0; i < oversize; i++) {
            oversized.push(new Array(image[0].length + oversize * 2).fill(around));
        }
        return oversized;
    }

    nextImage(image: number[][], alg: number[]) {
        const oversize = 1;
        let next = this.oversizeImage(image, oversize);
        for (let y = -oversize; y < next.length - oversize; y++) {
            for (let x = -oversize; x < next[y + oversize].length - oversize; x++) {
                const posIndex = this.posIndex(image, y, x);
                next[y + oversize][x + oversize] = alg[posIndex];
            }
        }
        return next;
    }

    posIndex(image: number[][], y: number, x: number): number {
        let index = ""
        for (let _y = y - 1; _y <= y + 1; _y++) {
            for (let _x = x - 1; _x <= x + 1; _x++) {
                index += this.val(image, _y, _x);
            }
        }
        return parseInt(index, 2);
    }

    val(image: number[][], y: number, x: number): string {
        return image[y] == undefined || image[y][x] == undefined
            ? (this.flashing ? "1" : "0")
            : (image[y][x] ? "1" : "0");
    }
}

