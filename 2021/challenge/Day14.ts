import Challenge from "../../Challenge";

type Polymerization = {
    template: string;
    rules: Map<string, string>;
};

export default class Day14 extends Challenge<Polymerization> {
    day: string = "day14";

    prepare(riddle: string): Polymerization {
        const [template, rawRules] = riddle.split("\n\n");
        const rules = new Map<string, string>();
        for (const rule of rawRules.split("\n").filter(rule => rule !== "")) {
            let match = rule.match(/(\w\w)\s+->\s+(\w)/);
            if (match) rules.set(match[1], match[2]);
        }
        return {
            template,
            rules
        }
    }

    part1(polymerization: Polymerization): number {
        return this.polymerization(polymerization, 10);
    }

    part2(polymerization: Polymerization): number {
        return this.polymerization(polymerization, 40);
    }

    polymerization(polymerization: Polymerization, rounds: number) {
        let polyCounts: { [key: string]: number } = {};
        for (let pos = 1; pos < polymerization.template.length; pos++) {
            let char1 = polymerization.template[pos - 1];
            let char3 = polymerization.template[pos];
            polyCounts[char1 + char3] = (polyCounts[char1 + char3] || 0) + 1
        }
        for (let i = 0; i < rounds; i++) {
            let nextPolyCounts: { [key: string]: number } = {};
            for (const [char, counts] of Object.entries(polyCounts)) {
                let nextChar1 = char[0];
                let nextChar2 = char[1];
                let nextChar3 = polymerization.rules.get(char);
                nextPolyCounts[nextChar1 + nextChar3] = (nextPolyCounts[nextChar1 + nextChar3] || 0) + counts;
                nextPolyCounts[nextChar3 + nextChar2] = (nextPolyCounts[nextChar3 + nextChar2] || 0) + counts;
            }
            polyCounts = nextPolyCounts;
        }
        let charCounts: { [key: string]: number } = {};
        for (const [char, counts] of Object.entries(polyCounts)) {
            let char1 = char[0];
            let char3 = char[1];
            charCounts[char1] = (charCounts[char1] || 0) + counts;
            charCounts[char3] = (charCounts[char3] || 0) + counts;
        }

        let min = Object.entries(charCounts)[0];
        let max = Object.entries(charCounts)[0];
        for (const value of Object.entries(charCounts)) {
            if (value[1] > max[1]) max = value;
            if (value[1] < min[1]) min = value;
        }
        let correction = 0;
        if (max[0] === polymerization.template[polymerization.template.length - 1]) {
            correction = 1;
        } else if (min[0] === polymerization.template[polymerization.template.length - 1]) {
            correction = -1;
        }
        return ((max[1] - min[1] + correction) / 2);
    }

}