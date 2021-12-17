import Challenge from "../../Challenge";

type Area = { x0: number, x1: number, y0: number, y1: number };

export default class Day17 extends Challenge<Area> {
    day: string = "day17";

    prepare(riddle: string): Area {
        let match = riddle.match(/x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/);
        return {
            x0: parseInt(match[1]),
            x1: parseInt(match[2]),
            y0: parseInt(match[3]),
            y1: parseInt(match[4]),
        }
    }


    hitField(vx: number, vy: number, area: Area): boolean {
        let posx = 0;
        let posy = 0;
        while (true) {
            posx += vx;
            posy += vy;
            if (posx >= area.x0 && posx <= area.x1 && posy >= area.y0 && posy <= area.y1) {
                return true;
            }
            if (posx > area.x1 || posy < area.y0) {
                return false;
            }
            if (vx > 0) vx--;
            vy--;
        }
    }

    part1(area: Area): number {
        let max = 0;
        for (let i = 1; i < area.x1 / 2; i++) {
            for (let j = 0; j < -area.y0; j++) {
                if (this.hitField(i, j, area)) {
                    if (max < j * (j + 1) / 2) max = j * (j + 1) / 2;
                }
            }
        }
        return max
    }

    part2(area: Area): number {
        let count = 0;
        for (let x = 1; x <= area.x1 ; x++) {
            for (let y = area.y0; y <= -area.y0; y++) {
                if (this.hitField(x, y, area)) {
                    count++;
                }
            }
        }
        return count;
    }
}

