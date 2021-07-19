let coords = [];
let coordsLen = 16;

function setup() {
  createCanvas(600, 600);
  noFill();
  stroke(255, 43, 43);
  strokeWeight(2);

  noiseDetail(24);
  
  // fill the coordinates array with random data
  for (let i = 0; i < coordsLen; i++) {
    coords.push(new Coordinate(random(100, 500), random(100, 500)));
  }
}

function draw() {
    background(245, 240, 240);
    // cycle through the coordinates to build the curves
    beginShape();
    curveVertex(coords[0].x, coords[0].y);

    for (let i = 0; i < coords.length - 1; i++) {
        coords[i].float();
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
    this.interval = 0.01;
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
  }
  
  float() {
      let moveX = map( noise(this.noiseOffsetX), 0, 1, -1, 1 );
      let moveY = map( noise(this.noiseOffsetY), 0, 1, -1, 1 );
      this.x += moveX;
      this.y += moveY;
      this.noiseOffsetX += this.interval;
      this.noiseOffsetY += this.interval;

      // bounce off the edges
      if (this.x < 0) {
        this.moveX = 100;
      }
      if (this.x > width) {
        this.moveX = -100;
      }
      if (this.y < 0) {
          this.moveY = 100;
      }
      if (this.y > height) {
        this.moveY = -100;
      }
  }
}


