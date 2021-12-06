import Challenge from "../../Challenge";

export default class Day6 extends Challenge<number[]> {
    day: string = "day6";

    prepare(riddle: string): number[] {
        return riddle.split(",")
            .filter(n => n !== "")
            .map(e => parseInt(e));
    }

    part1(fishCooldowns: number[]): number {
        return Day6.calcFishPopulationAfterDays(fishCooldowns, 80);
    }

    part2(fishCooldowns: number[]): number {
        return Day6.calcFishPopulationAfterDays(fishCooldowns, 256);
    }

    static calcFishPopulationAfterDays(fishCooldowns: number[], days: number) {
        let populationSize = 0;
        let countCooldowns = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (const fishCooldown of fishCooldowns) {
            countCooldowns[fishCooldown]++;
        }
        for (const [cooldown, times] of countCooldowns.entries()) {
            if (times !== 0) {
                populationSize += times * Day6.cachedCalcSingleFishReproduction(days - cooldown);
            }
        }
        return populationSize;
    }

    private static singleFishReproductionCache = new Map<number, number>();

    static cachedCalcSingleFishReproduction(days: number): number {
        let populationSize = this.singleFishReproductionCache.get(days);
        if (typeof populationSize === "number") {
            return populationSize;
        }
        (populationSize = function (_days) {
            if (_days < 0) return 1;
            let _populationSize = 1;
            while (_days > 0) {
                _populationSize += Day6.cachedCalcSingleFishReproduction(_days - 8 - 1);
                _days -= 7;
            }
            return _populationSize;
        }(days));
        this.singleFishReproductionCache.set(days, populationSize);
        return populationSize;
    }


}