// Global variable to share data between canvases
let infectionRate = 25;
let humans = [];
// --- DASHBOARD SKETCH ---
const guiSketch = (p) => {
    let history = [];

    p.setup = () => {
        let canvas = p.createCanvas(300, 300);
        canvas.parent('canvas-gui');

        // Label and Slider 1
        let label1 = p.createP('Speed');
        label1.parent('controls');
        label1.addClass('slider-label');
        let slider1 = p.createSlider(0, 100, infectionRate);
        slider1.parent('controls');
        slider1.input(() => { infectionRate = slider1.value(); });

        // Label and Slider 2
        let label2 = p.createP('Movement Speed');
        label2.parent('controls');
        label2.addClass('slider-label');
        let slider2 = p.createSlider(1, 10, 3);
        slider2.parent('controls');
    };

    p.draw = () => {
        p.background(17, 34, 64);

        // Draw a simple "SIR" Style Graph
        p.stroke(100, 255, 218);
        p.noFill();
        p.beginShape();
        for(let i = 0; i < p.width; i++) {
            let val = p.noise(i * 0.02, p.frameCount * 0.01) * 100;
            p.vertex(i, p.height - 50 - val);
        }
        p.endShape();

        p.fill(255);
        p.noStroke();
        p.text("Live Infection Trend", 10, 20);
    };
};

let simWidth = 600;
let simHeight = 400;
let numHumans = 50;
// --- SIMULATION SKETCH ---
const simSketch = (p) => {
    p.setup = () => {

        let canvas = p.createCanvas(simWidth, simHeight);
        canvas.parent('canvas-sim');

        for (let i = 0; i < numHumans; i++) {
            humans.push( new simulatedHuman(p));
        };
    };

    p.draw = () => {
        p.background(10, 25, 47);
        p.textAlign(p.CENTER);

        for( let human of humans ){
            console.log(human.x, human.y);
            human.update();
            human.display(p);
        };

    };
};

new p5(guiSketch);
new p5(simSketch);

class simulatedHuman {
    constructor(p) {
        this.x = p.random(simWidth);
        this.y = p.random(simHeight);
        this.vx = p.random(-3,3);
        this.vy = p.random(-3,3);

        this.healthy = true;
    }

    update(){
        this.x += this.vx;
        this.y += this.vy;

        if (this.x > simWidth || this.x < 0) this.vx *= -1;
        if(this.y > simHeight || this.y < 0) this.vy *= -1;

    }

    display(p) {
        p.noStroke();
        if (this.healthy) p.fill(0, 255, 255 ); // Blue
        else p.fill(255, 0, 0); // Red

        p.ellipse(this.x, this.y, 10 * 2);
    }

}