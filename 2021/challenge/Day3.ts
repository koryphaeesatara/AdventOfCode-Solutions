import Challenge from "../../Challenge";

type BitMap = ("1" | "0")[][];

export default class Day3 extends Challenge<BitMap> {
    day: string = "day3";

    prepare(riddle: string): BitMap {
        return riddle.split("\n")
            .filter(e => e !== "")
            .map(e => e.split("") as ("0" | "1")[]
            );
    }

    countColumn(bitMap: BitMap, col: number): { zeros: number, ones: number } {
        let zeros = 0;
        let ones = 0;
        for (let y = 0; y < bitMap.length; y++) {
            if (bitMap[y][col] === "0") {
                zeros++;
            } else {
                ones++;
            }
        }
        return {
            zeros: zeros,
            ones: ones
        }
    }

    part1(bitMap: BitMap): number {
        let gamma = "";
        let epsilon = "";
        for (let x = 0; x < bitMap[0].length; x++) {
            const {zeros, ones} = this.countColumn(bitMap, x);
            gamma += (zeros > ones ? "0" : "1");
            epsilon += (zeros < ones ? "0" : "1");
        }
        return parseInt(gamma, 2) * parseInt(epsilon, 2);
    }

    part2(bitMap: BitMap): number {
        let rows = bitMap;
        for (let x = 0; x < rows[0].length; x++) {
            const {zeros, ones} = this.countColumn(rows, x);
            const most = zeros > ones ? "0" : "1";
            rows = rows.filter(c => c[x] === most);
        }
        const oxygen = rows[0].join("");

        rows = bitMap;
        for (let x = 0; x < rows[0].length; x++) {
            const {zeros, ones} = this.countColumn(rows, x);
            const fewest = zeros <= ones ? "0" : "1";
            rows = rows.filter(c => c[x] === fewest);
            if (rows.length === 1) {
                break;
            }
        }
        const co2 = rows[0].join("");
        return parseInt(oxygen, 2) * parseInt(co2, 2);
    }
}
