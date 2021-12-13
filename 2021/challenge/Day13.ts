import Challenge from "../../Challenge";

type Origami = {
    coordinates: { x: number, y: number }[]
    folds: string[]
};

export default class Day13 extends Challenge<Origami> {
    day: string = "day13";

    prepare(riddle: string): Origami {
        const [rawCoords, rawFolds] = riddle.split("\n\n");
        return {
            coordinates: rawCoords.split("\n")
                .filter(l => l !== "")
                .map(l => l.split(","))
                .map(l => {
                    return {
                        x: parseInt(l[0]),
                        y: parseInt(l[1])
                    }
                }),
            folds: rawFolds.split("\n")
        }
    }

    part1(origami: Origami): number {
        const paper = this.createPaper(origami);
        this.fold(paper,origami.folds[0]);
        let count = 0;
        for (const row of paper) {
            for (const cell of row) {
                if (cell) count++;
            }
        }
        return count;
    }

    part2(origami: Origami): string {
        const paper = this.createPaper(origami);
        for (const fold of origami.folds) {
            this.fold(paper, fold);
        }
        for (const row of paper) {
            let msg = "";
            for (const cell of row) {
                msg += cell ? "##" : "  ";
            }
            console.log(msg);
        }
        return "Read the letters.";
    }

    createPaper(origami: Origami) {
        let xMax = 0;
        let yMax = 0;
        for (const coordinate of origami.coordinates) {
            if (coordinate.x > xMax) xMax = coordinate.x;
            if (coordinate.y > yMax) yMax = coordinate.y;
        }
        const paper: boolean[][] = [];
        for (let y = 0; y <= yMax; y++) {
            const row = [];
            for (let x = 0; x <= xMax; x++) {
                row.push(false);
            }
            paper.push(row);
        }
        for (const {x, y} of origami.coordinates) {
            paper[y][x] = true;
        }
        return paper;
    }

    private fold(paper: boolean[][], fold: string) {
        if (fold.match(/fold along y=\d+/g)) {
            this.foldY(paper, parseInt(fold.match(/\d+/g)[0]));
        } else if (fold.match(/fold along x=\d+/g)) {
            this.foldX(paper, parseInt(fold.match(/\d+/g)[0]));
        }
    }

    private foldY(paper: boolean[][], number: number) {
        for (let y = number; y < paper.length; y++) {
            for (let x = 0; x < paper[y].length; x++) {
                paper[number * 2 - y][x] = paper[number * 2 - y][x] || paper[y][x];
            }
        }
        while (paper.length > number) {
            paper.pop();
        }
    }

    private foldX(paper: boolean[][], number: number) {
        for (let y = 0; y < paper.length; y++) {
            for (let x = 0; x < paper[y].length; x++) {
                paper[y][number * 2 - x] = paper[y][number * 2 - x] || paper[y][x];
            }
            while (paper[y].length > number) {
                paper[y].pop();
            }
        }

    }
}