import Challenge from "../../Challenge";

export default class Day1 extends Challenge<number[]> {
    day: string = "day1";

    prepare(riddle: string): number[]{
        return riddle.split("\n")
            .filter(e => e !== "")
            .map(e => parseInt(e));
    }

    part1(measurements: number[]): number {
        let inc = 0;
        let lastMeas: number = null;
        for (let mess of measurements) {
            if (lastMeas != null && lastMeas < mess) {
                inc++;
            }
            lastMeas = mess;
        }
        return inc;
    }

    part2(measurements: number[]): number {
        let inc = 0;
        let lastMeasurementSum = null;
        let m1 = null;
        let m2 = null;
        for (let m0 of measurements) {
            if (m1 != null && m2 != null) {
                const measurementSum = m1 + m2 + m0;
                if (measurementSum > lastMeasurementSum && lastMeasurementSum != null) {
                    inc++;
                }
                lastMeasurementSum = m1 + m2 + m0;
            }
            m2 = m1;
            m1 = m0;
        }
        return inc;
    }
}
