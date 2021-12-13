import Challenge from "./Challenge";
import {readFileSync} from "fs";
import Day1 from "./2021/challenge/Day1";
import Day2 from "./2021/challenge/Day2";
import Day3 from "./2021/challenge/Day3";
import Day4 from "./2021/challenge/Day4";
import Day5 from "./2021/challenge/Day5";
import Day6 from "./2021/challenge/Day6";
import Day7 from "./2021/challenge/Day7";
import Day8 from "./2021/challenge/Day8";
import Day9 from "./2021/challenge/Day9";
import Day10 from "./2021/challenge/Day10";
import Day11 from "./2021/challenge/Day11";
import Day12 from "./2021/challenge/Day12";
import Day13 from "./2021/challenge/Day13";

class ChallengeManager {
    static displayDay(year: number, ChallengeClazz: { new(): Challenge<any> }) {
        let challengeClazz = new ChallengeClazz();
        let filePrefix = year + "/resources/" + challengeClazz.day;
        try {
            console.log("Exampe of " + challengeClazz.day + ":")
            challengeClazz.solveDay(readFileSync(filePrefix + ".example.txt").toString());
        } catch (e) {
            console.log("Error: " + e.message);
        }
        try {
            console.log("\nRiddle of " + challengeClazz.day + ":")
            challengeClazz.solveDay(readFileSync(filePrefix + ".riddle.txt").toString());
        } catch (e) {
            console.log("Error: " + e.message);
        }
        console.log("\n");
    }
}
const challengeClasses : { new(): Challenge<any> }[] = [
    Day1,
    Day2,
    Day3,
    Day4,
    Day5,
    Day6,
    Day7,
    Day8,
    Day9,
    Day10,
    Day11,
    Day12,
    Day13
];

let string = process.argv[2];
for (const clazz of challengeClasses) {
    if (clazz.name.toLowerCase() === string.toLowerCase()) {
        ChallengeManager.displayDay(2021, clazz);
        break;
    }
}
