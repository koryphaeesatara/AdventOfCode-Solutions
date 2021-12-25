import Challenge from "../../Challenge";

type SeaCucumberMap = string[][];

export default class Day25 extends Challenge<SeaCucumberMap> {
    day: string = "day25";

    prepare(riddle: string): SeaCucumberMap {
        return riddle.split("\n")
            .filter(l => l !== "")
            .map(l => l.split(""));
    }

    part1(map: SeaCucumberMap): number {
        const clone = (map) => JSON.parse(JSON.stringify(map));
        let step = 0;
        let change = true;
        let nextMap: SeaCucumberMap = clone(map);
        while (change) {
            change = false
            step++;
            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    let next = (x + 1) % map[y].length;
                    if (map[y][x] === ">" && map[y][next] === ".") {
                        nextMap[y][next] = ">";
                        nextMap[y][x] = ".";
                        change = true;
                    }
                }
            }
            map = clone(nextMap);
            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    let next = (y + 1) % map.length;
                    if (map[y][x] === "v" && map[next][x] === ".") {
                        nextMap[y][x] = ".";
                        nextMap[next][x] = "v";
                        change = true;
                    }
                }
            }
            map = clone(nextMap);
        }
        return step;
    }

    part2(riddle: SeaCucumberMap): string {
        return "Click on 'Remotely Start The Sleigh'";
    }
}

