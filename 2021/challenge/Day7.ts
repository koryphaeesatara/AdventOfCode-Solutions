import Challenge from "../../Challenge";

export default class Day7 extends Challenge<number[]> {
    day: string = "day7";

    prepare(riddle: string): number[] {
        return riddle.split(",")
            .filter(n => n !== "")
            .map(e => parseInt(e));
    }


    part1(crabs: number[]): number {
        let calcFuelTo = function (crabs: number[], pos: number){
            let sum = 0;
            for (const crab of crabs) {
                sum+=Math.abs(pos-crab);
            }
            return sum;
        };
        let pos = 1;
        let min = calcFuelTo(crabs, 0);
        while(true){
            let current = calcFuelTo(crabs, pos);
            if (current < min){
                min = current
            }else {
                return min;
            }
            pos++;
        }
    }

    part2(crabs: number[]): number {
        let calcFuelTo = function (crabs: number[], pos: number){
            let sum = 0;
            for (const crab of crabs) {
                let diff = Math.abs(pos-crab);
                sum+=(diff * (diff+1))/2;
            }
            return sum;
        };
        let pos = 1;
        let min = calcFuelTo(crabs, 0);
        while(true){
            let current = calcFuelTo(crabs, pos);
            if (current < min){
                min = current
            }else {
                return min;
            }
            pos++;
        }
    }
}
/**

 |ai -x|

*/