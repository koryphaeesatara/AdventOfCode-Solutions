import Challenge from "../../Challenge";

interface Movement {
    direction: string;
    value: number;
}

export default class Day2 extends Challenge<Movement[]> {
    day: string = "day2";

    prepare(riddle: string): Movement[] {
        return riddle.split("\n")
            .filter(e => e !== "")
            .map(e => e.split(" "))
            .map(e => {
                    return {
                        direction: e[0],
                        value: parseInt(e[1])
                    };
                }
            );
    }

    part1(movements: Movement[]): number {
        let x = 0;
        let y = 0;
        for (const movement of movements) {
            switch (movement.direction) {
                case "forward":
                    x += movement.value;
                    break;
                case "up":
                    y -= movement.value;
                    break;
                case "down":
                    y += movement.value;
                    break;
                default:
                    throw new Error(movement.direction + " unknown");
            }
        }
        return x * y;
    }

    part2(movements: Movement[]): number {
        let x = 0;
        let y = 0;
        let aim = 0;
        for (const movement of movements) {
            switch (movement.direction) {
                case "forward":
                    x += movement.value;
                    y += aim * movement.value;
                    break;
                case "up":
                    aim -= movement.value;
                    break;
                case "down":
                    aim += movement.value;
                    break;
                default:
                    throw new Error(movement.direction + " unknown");
            }
        }
        return x * y;
    }
}
