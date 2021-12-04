import Day1 from "./2021/challenge/Day1";
import Day2 from "./2021/challenge/Day2";
import Day3 from "./2021/challenge/Day3";
import Challenge from "./Challenge";
import {readFileSync} from "fs";
import Day4 from "./2021/challenge/Day4";

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

let string = process.argv[2];
for (const clazz of [Day1, Day2, Day3, Day4]) {
    if (clazz.name.toLowerCase() === string.toLowerCase()) {
        ChallengeManager.displayDay(2021, clazz);
        break;
    }
}