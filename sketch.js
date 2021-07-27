let coords = [];
let coordsLen = 16;

function setup() {
  createCanvas(600, 600);
  noFill();

  noiseDetail(24);

  // fill the coordinates array with random data
  for (let i = 0; i < coordsLen; i++) {
    let hasFeathers = false;
    if ( Math.ceil(random(2)) % 2 == 0 ) // test for an even number to determine feathers or not
      hasFeathers = true;
    coords.push(new Coordinate(random(100, 500), random(100, 500), hasFeathers));
  }

}


function draw() {
    background(245, 240, 240);

    // cycle through the coordinates to build the curves
    beginShape();
    curveVertex(coords[0].x, coords[0].y);
    
    for (let i = 0; i < coordsLen - 1; i++) {
      stroke(255, 43, 43);
      strokeWeight(2); // this line isn't working
      coords[i].float();
      curveVertex(coords[i].x, coords[i].y);
      // draw a circle on each data point
      strokeWeight(1)
      circle(coords[i].x, coords[i].y, 20);
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
    this.numFeathers = random(1, 6);
    this.featherOffset = random(-20, 20);
    this.cpx;
    this.cpy;
  }
  
  float() {
      let moveX = map( noise(this.noiseOffsetX), 0, 1, -1, 1 );
      let moveY = map( noise(this.noiseOffsetY), 0, 1, -1, 1 );
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

    for (let j = 0; j < this.numFeathers; j++) {
      stroke(0, 255, 0);
      strokeWeight(1);
      // bezier(x1, y1, cpx1, cpy1, cpx2, cpy2, x2, y2)
      bezier(this.x, this.y, this.cpx, this.cpy, this.cpx + (j*this.featherOffset), this.cpy - (j*this.featherOffset), x2, y2);
    }
  }
}
