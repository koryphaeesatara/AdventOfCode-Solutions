import Challenge from "../../Challenge";

type Positions = number[];

class Die {
    rolled = 0;
    sides = 100;

    get(): number {
        return (this.rolled++ % 100) + 1;
    }
}

class Player {
    pos: number;
    score = 0;

    constructor(pos: number) {
        this.pos = pos;
    }

    play(die: Die) {
        let moves = (this.pos + die.get() + die.get() + die.get()) % 10;
        if (moves === 0) moves = 10;
        this.score += moves;
        this.pos = moves;
    }

    win() {
        return this.score >= 1000;
    }
}

const DIE_NUMS: { [key: number]: number } = {};
for (let die1 = 1; die1 <= 3; die1++) {
    for (let die2 = 1; die2 <= 3; die2++) {
        for (let die3 = 1; die3 <= 3; die3++) {
            DIE_NUMS[die1 + die2 + die3] = (DIE_NUMS[die1 + die2 + die3] || 0) + 1;
        }
    }
}
export default class Day21 extends Challenge<Positions> {
    day: string = "day21";

    prepare(riddle: string): Positions {
        return riddle.split("\n").filter(l => l !== "").map(l => parseInt(l.match(/position: (\d+)/)[1]));
    }

    part1(positions: Positions): number {
        const die = new Die();
        const players: Player[] = positions.map(p => new Player(p));
        while (true) {
            let player = players.shift();
            player.play(die);
            if (player.win()) {
                break;
            }
            players.push(player);
        }
        return players.shift().score * die.rolled;
    }

    part2(riddle: Positions): number {
        const [p1, p2] = this.recursiveGame(riddle[0], riddle[1], 0, 0, true);
        return p1 > p2 ? p1 : p2;
    }

    static recursiveGameCache = new Map<string, number[]>();

    recursiveGame(pos1: number, pos2: number, score1: number, score2: number, isPlayer1: boolean) {
        const cacheKey = Array.from(arguments).join("-");
        let cache = Day21.recursiveGameCache.get(cacheKey);
        if (cache) return cache;

        let win1 = 0;
        let win2 = 0;
        const pos = isPlayer1 ? pos1 : pos2;
        const score = isPlayer1 ? score1 : score2;
        for (const [die, multiply] of Object.entries(DIE_NUMS)) {
            let moveTo = ((pos + parseInt(die)) % 10);
            if (moveTo === 0) moveTo = 10;
            let nextScore = score + moveTo;
            if (nextScore >= 21) {
                if (isPlayer1) {
                    win1 += multiply
                } else {
                    win2 += multiply;
                }
            } else {
                const [w1, w2] = isPlayer1
                    ? this.recursiveGame(moveTo, pos2, nextScore, score2, !isPlayer1)
                    : this.recursiveGame(pos1, moveTo, score1, nextScore, !isPlayer1);
                win1 += w1 * multiply;
                win2 += w2 * multiply;
            }

        }
        let result = [win1, win2];
        Day21.recursiveGameCache.set(cacheKey, result);
        return result;
    }


}

