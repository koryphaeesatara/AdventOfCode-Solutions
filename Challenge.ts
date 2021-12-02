export default abstract class Challenge<RiddleType> {

    abstract day: string;

    abstract prepare(string: string): RiddleType;

    abstract part1(preparedRiddle: RiddleType): string | number;

    abstract part2(preparedRiddle: RiddleType): string | number;

    solveDay(rawRiddle: string) {
        let riddle = this.prepare(rawRiddle);
        console.log("Solution Part 1: " + this.part1(riddle));
        console.log("Solution Part 2: " + this.part2(riddle));
    }
}