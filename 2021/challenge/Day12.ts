import Challenge from "../../Challenge";

type Edges = string[][];

declare global {
    interface Array<T> {
        toCountMap(): Map<T, number>
    }
}
Array.prototype.toCountMap = function <T>(this: T[]): Map<T, number> {
    const map = new Map<T, number>();
    for (const t of this) {
        const number = (map.get(t) || 0) + 1;
        map.set(t, number);
    }
    return map;
}

export default class Day12 extends Challenge<Edges> {
    day: string = "day12";

    prepare(riddle: string): Edges {
        return riddle.split("\n")
            .filter(l => l !== "")
            .map(l => l.split("-"));
    }


    part1(edges: Edges): number {
        const cornersMap = this.createCornerMap(edges);
        const routes = this.routes("start", "end", cornersMap, (routeName, next) =>
            next !== "start" && !(routeName.match(new RegExp("," + next, "g")) && next.match(/[a-z]+/))
        );
        return routes.length;
    }

    part2(edges: Edges): number {
        const cornersMap = this.createCornerMap(edges);
        const routes = this.routes("start", "end", cornersMap, ((routeName, next) => {
            let m: { [key: string]: number } = {};
            for (const match of (routeName + "," + next).match(/,[a-z]+/g) || []) {
                m[match] = (m[match] || 0) + 1;
            }
            return !(next === "start" || Object.entries(m).filter(e => e[1] > 2).length !== 0 || Object.entries(m).filter(e => e[1] >= 2).length > 1);

        }));
        return routes.length;
    }

    private createCornerMap(edges: Edges) {
        const cornersMap = new Map<string, string[]>();
        for (const edge of edges) {
            this.addCorner(cornersMap, edge[0], edge[1]);
            this.addCorner(cornersMap, edge[1], edge[0]);
        }
        return cornersMap;
    }

    private addCorner(cornersMap: Map<string, string[]>, corner1: string, corner2: string): void {
        let corners = cornersMap.get(corner1);
        if (corners == undefined) {
            corners = [];
        }
        corners.push(corner2);
        cornersMap.set(corner1, corners);
    }

    private routes(start: string, end: string, cornersMap: Map<string, string[]>, canNext: (routeName: string, next: string) => boolean, routeName: string = ""): string[] {
        let routes = [];
        routeName += "," + start;
        if (end === start) {
            return [routeName];
        }
        for (const next of cornersMap.get(start) || []) {
            if (canNext(routeName, next)) {
                routes.push(...this.routes(next, end, cornersMap, canNext, routeName));
            }
        }
        return routes;
    }
}