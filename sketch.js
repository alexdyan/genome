let coords = [];
let coordsLen = 16;

function setup() {
  createCanvas(600, 600);
  noFill();
  noiseDetail(24);
  colorMode(HSB, 360, 100, 100);

  // fill the coordinates array with random data
  for (let i = 0; i < coordsLen; i++) {
    let hasFeathers = false;
    if ( Math.ceil(random(2)) % 2 == 0 ) // test for an even number to determine feathers or not
      hasFeathers = true;
    coords.push(new Coordinate(random(100, 500), random(100, 500), hasFeathers));
  }

}


function draw() {
    background(0, 2, 96);

    // cycle through the coordinates to build the curves
    beginShape();
    curveVertex(coords[0].x, coords[0].y);
    
    for (let i = 0; i < coordsLen - 1; i++) {
      stroke(0, 83, 84);
      strokeWeight(3); // this line isn't working
      coords[i].float();
      curveVertex(coords[i].x, coords[i].y);
      // draw a circle on each data point
      // strokeWeight(1)
      // circle(coords[i].x, coords[i].y, 20);
      // strokeWeight(3)
    }
    curveVertex(coords[coordsLen-1].x, coords[coordsLen-1].y)
    endShape();

    // cycle through the coordinates again and overlay the feathers
    for (let i = 0; i < coordsLen - 2; i++) {
      if (coords[i].hasFeathers == true) {
        coords[i].drawFeathers(coords[i+1].x, coords[i+1].y);
      }
    }

}


class Coordinate {
  constructor(x, y, hasFeathers) {
    this.x = x;
    this.y = y;
    this.interval = 0.01;
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.hasFeathers = hasFeathers;
    this.numFeathers = random(2, 8);
    this.featherOffset = random(-20, 20);
    this.cpx;
    this.cpy;
    this.saturation = random(20, 80);
  }
  
  float() {
    // make the coordinates float around using Perlin noise
      let moveX = map( noise(this.noiseOffsetX), 0, 1, -0.7, 0.7 );
      let moveY = map( noise(this.noiseOffsetY), 0, 1, -0.7, 0.7 );
      this.x += moveX;
      this.y += moveY;
      this.noiseOffsetX += this.interval;
      this.noiseOffsetY += this.interval;
  }

  drawFeathers(x2, y2) {
    // calculate control point 1 (halfway between the 2 coordinates)
    // control point 2 will be randomized based on cp1
    let calculateX = abs((this.x - x2) / 2);
    let calculateY = abs((this.y - y2) / 2);
    if (this.x > x2)
      this.cpx = this.x - calculateX;
    else
      this.cpx = this.x + calculateX;
    if (this.y > y2)
      this.cpy = this.y - calculateY;
    else
      this.cpy = this.y + calculateY;


    // draw the feathers here
    for (let j = 0; j < this.numFeathers; j++) {
      stroke(0, this.saturation + j*10, 95);
      strokeWeight(1);
      // bezier(x1, y1, cpx1, cpy1, cpx2, cpy2, x2, y2)
      bezier(this.x, this.y, this.cpx + this.featherOffset, this.cpy + this.featherOffset, this.cpx - (j*this.featherOffset), this.cpy - (j*this.featherOffset), x2, y2);
    }
  }
}
