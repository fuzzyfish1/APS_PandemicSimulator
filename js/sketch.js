let infectionRate = 30;
let timeToDeath = 100;
let humans = [];

const humanStatus = Object.freeze({
    DEATH: 'DEATH',
    HEALTHY: 'HEALTHY',
    SICK: 'SICK'
});

let simWidth = 600;
let simHeight = 400;
let numHumans = 50;
let frame = 0;

const simSketch = (p) => {
    p.setup = () => {

        let canvas = p.createCanvas(300, 300);
        canvas.parent('canvas-gui');

        let label1 = p.createP('Speed');
        label1.parent('controls');
        label1.addClass('slider-label');
        let slider1 = p.createSlider(0, 120, infectionRate);
        slider1.parent('controls');
        slider1.input(() => {
            infectionRate = slider1.value();
        });

        // Label and Slider 2 let
        label2 = p.createP('FRAMES TO DEATH');
        label2.parent('controls');
        label2.addClass('slider-label');
        let slider2 = p.createSlider(0, 300, timeToDeath);
        slider2.parent('controls');
        slider2.input(() => {
            timeToDeath = slider2.value();
        });

        // restart sim button
        let btn = p.createButton('Restart Simulation');
        btn.parent('controls');
        btn.addClass('reset-button');
        btn.mousePressed(() => {
            resetSim(simInstance);
        });

        let canvasSim = p.createCanvas(simWidth, simHeight);
        canvasSim.parent('canvas-sim');
        resetSim(p);
    };

    /** is basically loop() from arduino for each frame*/
    p.draw = () => {
        frame++;
        if (infectionRate === 0) return; // pause simulation
        p.frameRate(infectionRate);
        p.background(10, 25, 47);
        p.textAlign(p.CENTER);

        for (let i = 0; i < numHumans; i++) {
            for (let j = i + 1; j < numHumans; j++) {
                let distX = humans[i].x - humans[j].x;
                let distY = humans[i].y - humans[j].y;
                let dist = p.sqrt(distX * distX + distY * distY);
                if (dist <= 2 * humans[i].radius) {
                    processHumansTouchingEachOther(humans[i], humans[j]);
                }
            }
            humans[i].update();
            humans[i].display(p);
        }
        ;
    };
};

simInstance = new p5(simSketch);

class simulatedHuman {
    /** create a new hooman*/
    constructor(p) {
        this.x = p.random(simWidth);
        this.y = p.random(simHeight);
        this.vx = p.random(-3, 3);
        this.vy = p.random(-3, 3);
        this.radius = 10
        this.status = humanStatus.HEALTHY;
        this.infectionTime = 0;
    }

    /** move this one frame*/
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x > simWidth || this.x < 0) this.vx *= -1;
        if (this.y > simHeight || this.y < 0) this.vy *= -1;
        if (this.status == humanStatus.SICK) {
            this.infectionTime++;
        }
        if (this.status == humanStatus.SICK && this.infectionTime > timeToDeath) {
            this.status = humanStatus.DEATH;
            this.vx = 0;
            this.vy = 0;

        }
    }

    display(p) {
        p.noStroke();
        if (this.status == humanStatus.HEALTHY) {
            p.fill(0, 255, 255);
        } else if (this.status == humanStatus.SICK) {
            p.fill(255, 0, 0);
        } else if (this.status == humanStatus.DEATH) {
            p.fill(100, 100, 100);
        }
        p.ellipse(this.x, this.y, this.radius * 2);
    }
}

let processHumansTouchingEachOther = (personA, personB) => {
    if ((personA.status == humanStatus.SICK && personB.status == humanStatus.HEALTHY) ||
        (personB.status == humanStatus.SICK && personA.status == humanStatus.HEALTHY)) {
        personA.status = humanStatus.SICK;
        personB.status = humanStatus.SICK;
    }
};

let resetSim = (p) => {
    humans = [];
    frame = 0;

    for (let i = 0; i < numHumans; i++) {
        humans.push(new simulatedHuman(p));
    }

    humans[0].status = humanStatus.SICK;

};