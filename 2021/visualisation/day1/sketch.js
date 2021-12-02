let boot;
let imgShips = [];
let ground;

function preload() {
    // imgShips.push(loadImage('ship1.png'));
    imgShips.push(loadImage('ship2.png'));
    imgShips.push(loadImage('ship3.png'));
}

function setup() {
    createCanvas(400, 300);
    boot = new Boot(width / 2, height / 4)
    ground = new Ground();
    setTimeout(update, 200)
}

function draw() {
    background(220);
    fill(0, 0, 200);
    rectMode(CORNER)
    rect(0, height / 4, width, height)
    boot.draw();
    ground.draw();
}

function update() {
    setTimeout(update, 200)
}

class Boot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.idx = 0;
        this.inc = 0;
        this.last = null;
        this.current = null;
    }

    draw() {
        this.idx = ++this.idx % imgShips.length;
        imageMode(CENTER)
        image(imgShips[this.idx], boot.x - ground.width/3*2, boot.y - 20, 80, 80);
        text("t0: " + this.current, 10, 15)
        text("t1: " + this.last, 10, 30)
        text("inc: " + this.inc, 10, 45)

        if (ground.time === 0) {
            this.last = this.current;
            const messIdx=Math.floor((width/2-ground.width)/ground.width)+1;
            this.current = height / 4 * 3 - ground.messaurments[messIdx];
            if (this.last != null && this.current > this.last) {
                this.inc++;
            }
        }
        if ((ground.time) <= ground.width / 2) {
            fill(120, 120, 0);
            rect(width / 2 - ground.width/3*2, height / 4, 4, height)
        }


    }
}

class Ground {
    constructor() {
        this.messaurments = Array.from({length: 40}, () => Math.floor(Math.random() * 40));
        this.time = 0;
        this.width = 40;
    }

    draw() {
        let x = -this.width;
        rectMode(CORNER)
        let before = this.messaurments[0];
        for (const messaurment of this.messaurments) {
            fill(0, 0, 0)
            rect(-this.time + x, height / 4 * 3 - messaurment, this.width, height + messaurment)
            if (width / 2 > x) {
                if (before != null && before > messaurment) {
                    fill(255, 255, 0)
                    stroke(255, 255, 0)
                    line(-this.time + x - this.width / 2, height / 3 * 2 - before, -this.time + x + this.width / 2, height / 3 * 2 - messaurment)
                    stroke(120)
                } else {
                    fill(255)
                }
                text(height / 4 * 3 - messaurment, -this.time + x, height - 40)
            }
            before = messaurment
            x += this.width;
        }
        this.time++;
        if (this.time % this.width === 0) {
            this.messaurments.shift();
            this.time = 0;
            this.messaurments.push(Math.floor(Math.random() * 40))
        }
    }
}
