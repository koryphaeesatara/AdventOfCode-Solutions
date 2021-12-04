import Challenge from "../../Challenge";

type Bingo = {
    numbers: number[],
    bingo: number[][][]
};

export default class Day4 extends Challenge<Bingo> {
    day: string = "day4";

    prepare(riddle: string): Bingo {
        let strings = riddle.split("\n\n");
        return {
            numbers: strings.shift().split(",").map(n => parseInt(n)),
            bingo: strings.map(b => b.split("\n")
                .filter(r => r !== "")
                .map(r => r.trim().split(" ").filter(c => c !== "")
                    .map(c => parseInt(c))
                ))
        }

    }

    part1(game: Bingo): number {
        BingoField.reset();
        const fields: BingoField[] = [];
        for (const bingo of game.bingo) {
            fields.push(new BingoField(bingo));
        }
        for (const number of game.numbers) {
            BingoField.chooseNumber(number);
            let bingoFields = fields.filter(field => field.isWin());
            if (bingoFields.length !== 0) {
                let winner: BingoField = bingoFields.shift();
                return winner.sumUnchosen() * number;
            }
        }
        return null;
    }

    part2(game: Bingo): number {
        BingoField.reset();
        let fields: BingoField[] = [];
        for (const bingo of game.bingo) {
            fields.push(new BingoField(bingo));
        }
        for (let i = 0; i < game.numbers.length; i++) {
            let number = game.numbers[i];
            fields = fields.filter(field => !field.isWin());
            if (fields.length === 1) {
                let winner: BingoField = fields.pop();
                while (true) {
                    BingoField.chooseNumber(number);
                    if (winner.isWin()) return winner.sumUnchosen() * number;
                    number = game.numbers[++i];
                }
            }
            BingoField.chooseNumber(number);
        }
        return null;
    }
}

interface BingoNumber {
    num: number;
    choosen: boolean;
}

class BingoField {
    private static numberMap = new Map<number, BingoNumber>()

    private field: BingoNumber[][] = [];

    constructor(field: number[][]) {
        for (const row of field) {
            const bingoRow = [];
            for (const cell of row) {
                bingoRow.push(BingoField.getNumber(cell));
            }
            this.field.push(bingoRow)
        }
    }

    isWin() {
        for (const rows of this.field) {
            if (rows.length === rows.filter(c => c.choosen).length) {
                return true;
            }
        }
        colLoop:
            for (let y = 0; y < this.field[0].length; y++) {
                for (let x = 0; x < this.field.length; x++) {
                    if (!this.field[x][y].choosen) {
                        continue colLoop;
                    }
                }
                return true;
            }
        return false;
    }

    sumUnchosen() {
        let sum = 0;
        for (const row of this.field) {
            for (const cell of row) {
                if (!cell.choosen) {
                    sum += cell.num;
                }
            }
        }
        return sum;
    }

    static getNumber(num: number): BingoNumber {
        if (this.numberMap.get(num) === undefined) {
            this.numberMap.set(num, {num, choosen: false})
        }
        return this.numberMap.get(num);
    }

    static chooseNumber(number: number) {
        this.getNumber(number).choosen = true;
    }

    static reset() {
        for (const value of this.numberMap.values()) {
            value.choosen = false;
        }
    }
}