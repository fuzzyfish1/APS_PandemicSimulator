// Global variable to share data between canvases
let infectionRate = 30;
let timeToDeath = 100;
let graphData;
let humans = [];
let simInstance;

const humanStatus = Object.freeze({
    DEATH: 'DEATH',
    HEALTHY: 'HEALTHY',
    SICK: 'SICK'
});
// --- DASHBOARD SKETCH ---
const guiSketch = (p) => {
    let history = [];

    /**create the sliders and graph elements*/
    p.setup = () => {
        let canvas = p.createCanvas(300, 300);
        canvas.parent('canvas-gui');

        // Label and Slider 1
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
    };

    /** graphing loop*/
    p.draw = () => {
        p.background(17, 34, 64);
        p.frameRate(infectionRate);
        // Draw a simple "SIR" Style Graph
        p.stroke(100, 255, 218);
        p.noFill();
        p.beginShape();
        for (frame in graphData) {
            let val = graphData[frame][humanStatus.SICK] * 100;
            p.vertex(frame, p.height - 50 - val);
        }
        // for (let i = 0; i < p.width; i++) {
        //     let val = p.noise(i * 0.02, p.frameCount * 0.01) * 100;
        //     p.vertex(i, p.height - 50 - val);
        // }
        p.endShape();
        p.fill(255);
        p.noStroke();
        p.text("Live Infection Trend", 10, 20);
    };
};
let simWidth = 600;
let simHeight = 400;
let numHumans = 50;
let frame = 0;
// --- SIMULATION SKETCH ---
const simSketch = (p) => {
    p.setup = () => {
        let canvas = p.createCanvas(simWidth, simHeight);
        canvas.parent('canvas-sim');
        resetSim(p);
    };

    /** is basically loop() from arduino for each frame*/
    p.draw = () => {
        frame++;
        p.frameRate(infectionRate);
        p.background(10, 25, 47);
        p.textAlign(p.CENTER);
        // graphData[frame][humanStatus.DEATH] = 0;
        // graphData[frame][humanStatus.SICK] = 0;
        // graphData[frame][humanStatus.HEALTHY] = 0;
        // for (human in humans) {
        //     graphData[frame][human.status]++;
        // }
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

new p5(guiSketch);
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

    // graphData[0][humanStatus.DEATH] = 0;
    // graphData[0][humanStatus.SICK] = 1;
    // graphData[0][humanStatus.HEALTHY] = numHumans - 1;
};