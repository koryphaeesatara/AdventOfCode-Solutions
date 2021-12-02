import Day2 from "./2021/challenge/Day2";
import Challenge from "./Challenge";
import {readFileSync} from "fs";

class ChallengeManager{
    static displayDay(year: number, ChallengeClazz : {new(): Challenge<any>}){
        let challengeClazz = new ChallengeClazz();
        let filePrefix = year+"/resources/"+challengeClazz.day;
        console.log("Exampe of "+challengeClazz.day + ":")
        challengeClazz.solveDay(readFileSync(filePrefix+".example.txt").toString());
        console.log("\nRiddle of "+challengeClazz.day + ":")
        challengeClazz.solveDay(readFileSync(filePrefix+".riddle.txt").toString());
    }
}
ChallengeManager.displayDay(2021, Day2);