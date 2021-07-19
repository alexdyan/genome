let coords = [];
let coordsLen = 16;

function setup() {
  createCanvas(600, 600);
  background(255);
  noFill();
  stroke(255, 43, 43);
  strokeWeight(2);
  
  // fill the coordinates array with random data
  for (let i = 0; i < coordsLen; i++) {
    coords.push(new Coordinate(random(100, 500), random(100, 500)));
  }
}

function draw() {
    // cycle through the coordinates to build the curves
    beginShape();
    curveVertex(coords[0].x, coords[0].y);

    for (let i = 0; i < coords.length - 1; i++) {
        curveVertex(coords[i].x, coords[i].y);
        // draw a circle on each data point
        strokeWeight(1)
        circle(coords[i].x, coords[i].y, 20);
        strokeWeight(2);
    }
    curveVertex(coords[coordsLen-1].x, coords[coordsLen-1].y)
    endShape();
}


class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.counter = 0;
  }
  
  // map each coordinate (pair?) to a sin wave to oscillate the wave and make it flowy
//   oscillate() {
//     // amplitude * sin(counter) + offset
//     this.newX = 25 * sin(this.counter) + this.x;
//     this.newY = 25 * sin(this.counter) + this.y;
//     this.counter += 0.01;
//   }
}


