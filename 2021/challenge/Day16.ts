import Challenge from "../../Challenge";

type BitStream = ("1" | "0")[];
type Message = { version: number, type: number, value: Message[] | number };

declare global {
    interface Array<T> {
        multiShift(len: number): T[];
    }
}

Array.prototype.multiShift = function <T>(len: number): T[] {
    const result: T[] = [];
    while (result.length < len) {
        result.push(this.shift());
    }
    return result;
}
export default class Day16 extends Challenge<BitStream> {
    day: string = "day16";

    prepare(riddle: string): BitStream {
        return riddle.split("")
            .filter(hex => hex !== "")
            .map(hex => parseInt(hex, 16).toString(2).padStart(4, '0'))
            .join("")
            .split("") as BitStream;
    }

    decode(bitStream: BitStream): Message {
        if (bitStream.length < 11) {
            console.log()
        }
        let version = parseInt(bitStream.multiShift(3).join(""), 2);
        let type = parseInt(bitStream.multiShift(3).join(""), 2);
        if (type === 4) {
            let packet = "";
            while (true) {
                let isLast = bitStream.shift() === "0";
                packet += (bitStream.multiShift(4).join(""));
                if (isLast) break;
            }
            let value = parseInt(packet, 2);
            return {version, type, value};
        }
        if ("0" === bitStream.shift()) {// Length 15 Bits
            let len = parseInt(bitStream.multiShift(15).join(""), 2);
            let subSequence = bitStream.multiShift(len);
            let subMessages = [];
            while (subSequence.length) {
                subMessages.push(this.decode(subSequence));
            }
            return {version, type, value: subMessages};
        }
        //Length 11 Bits
        let len = parseInt(bitStream.multiShift(11).join(""), 2);
        let subMessages = [];
        for (let i = 0; i < len; i++) {
            subMessages.push(this.decode(bitStream));
        }
        return {version, type, value: subMessages};
    }

    part1(bitStream: BitStream): number {
        let message = this.decode(bitStream);
        return this.recursiveSumofVersion(message);
    }

    part2(bitStream: BitStream): number {
        let message = this.decode(bitStream);
        return this.recursiveCalculation(message);
    }

    private recursiveSumofVersion(message: Message): number {
        let sum = message.version;
        if (typeof message.value !== "number") {
            for (const subMessage of message.value) {
                sum += this.recursiveSumofVersion(subMessage);
            }
        }
        return sum;
    }

    private recursiveCalculation(message: Message): number {
        if (message.type === 4) {
            if (typeof message.value === "number") {
                return message.value;
            }
            throw new Error();
        }
        if (!Array.isArray(message.value)) {
            throw new Error();
        }
        switch (message.type) {
            case 0:
                let sum = 0;
                for (const valueElement of message.value) {
                    sum += this.recursiveCalculation(valueElement);
                }
                return sum;
            case 1:
                let prod = 1;
                for (const valueElement of message.value) {
                    prod *= this.recursiveCalculation(valueElement);
                }
                return prod;
            case 2:
                let min = this.recursiveCalculation(message.value[0]);
                for (const valueElement of message.value) {
                    let val = this.recursiveCalculation(valueElement);
                    if (min > val) min = val;
                }
                return min;
            case 3:
                let max = this.recursiveCalculation(message.value[0]);
                for (const valueElement of message.value) {
                    let val = this.recursiveCalculation(valueElement);
                    if (max < val) max = val;
                }
                return max;
            case 5: {
                let first = this.recursiveCalculation(message.value[0]);
                let second = this.recursiveCalculation(message.value[1]);
                return first > second ? 1 : 0;
            }
            case 6: {
                let first = this.recursiveCalculation(message.value[0]);
                let second = this.recursiveCalculation(message.value[1]);
                return first < second ? 1 : 0;
            }
            case 7: {
                let first = this.recursiveCalculation(message.value[0]);
                let second = this.recursiveCalculation(message.value[1]);
                return first === second ? 1 : 0;
            }

        }
        throw new Error();
    }
}
/*
 6   4
110 100 1 0111 1 1110 0 0101 000
VVV TTT L AAAA L BBBB L CCCC

001 110 0 000000000011011 110 100 0 1010 010 100 1 0001 0 0100 0000000
VVV TTT I LLLLLLLLLLLLLLL AAA AAA A AAAA BBB BBB B BBBB B BBBB

111 011 1 00000000011 01010000001 10010000010 00110000011 00000
VVV TTT I LLLLLLLLLLL AAAAAAAAAAA BBBBBBBBBBB CCCCCCCCCCC

101 000 0 000000001011011 = 5
    001 000 1 00000000001 = 1 6
        011 000 1 00000000101 = 3 9
            111 100 0 0110 = 7 16
            110 100 0 0110 = 6 22
            101 100 0 1100 = 5 27
            010 100 0 1111 = 2 29
            010 100 0 1111 = 2 31
            0000000
VVV TTT I
 */