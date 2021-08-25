let coords = [];
let coordsLen = 24;
let offset = 50;

function setup() {
  createCanvas(800, 800);
  noFill();
  noiseDetail(24);
  colorMode(HSB, 360, 100, 100);

  let currentX = width/2
  let currentY = height/2

  // fill the coordinates array with random data
  for (let i = 0; i < coordsLen; i++) {
    let hasFeathers = false;
    if ( Math.ceil(random(100)) > 40 ) // 60% chance of getting feathers
      hasFeathers = true;
    coords.push(new Coordinate(currentX, currentY, hasFeathers));
    currentX = random(currentX-offset, currentX + offset);
    currentY = random(currentY-offset, currentY + offset);
  }
}


function draw() {
    background(4, 2, 100);

    // cycle through the coordinates to build the curves
    beginShape();
    curveVertex(coords[0].x, coords[0].y);
    
    for (let i = 0; i < coordsLen - 1; i++) {
      stroke(0, 88, 94);
      strokeWeight(2);
      coords[i].float();
      curveVertex(coords[i].x, coords[i].y);

      if (i != coordsLen-2) {
        coords[i].stayClose(coords[i+1].x, coords[i+1].y);
      }
    }
    curveVertex(coords[coordsLen-1].x, coords[coordsLen-1].y)
    endShape();

    // cycle through the coordinates again and overlay the feathers
    for (let i = 0; i < coordsLen - 2; i++) {
      if (coords[i].hasFeathers == true) {
        coords[i].drawFeathers(coords[i+1].x, coords[i+1].y);
      }
    }
    choosePoint(0.25);
}


// curvePoint can do percentages between 2 coords only, so to find a percentage of the whole line,
// do division on coordsLen to narrow which 2 points you have to search between
function choosePoint(percentage) {
  let closestPoint = coordsLen / (1 / percentage);
  let index1 = Math.floor(closestPoint);
  let index2 = Math.floor(closestPoint + 1);
  let x = curvePoint(coords[index1 - 1].x, coords[index1].x, coords[index2].x, coords[index2 + 1].x, percentage);
  let y = curvePoint(coords[index1 - 1].y, coords[index1].y, coords[index2].y, coords[index2 + 1].y, percentage);
  stroke(230, 100, 100)
  strokeWeight(2)
  circle(x, y, 10);
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
    this.saturation = random(20, 70);
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

  stayClose(x2, y2) {
    if (dist(this.x, this.y, x2, y2) > 200) {
      let xDesired = x2;
      let yDesired = y2;
      let xDist = xDesired - this.x;
      let yDist = yDesired - this.y;
      this.x += 0.01 * xDist;
      this.y += 0.01 * yDist;
    }

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
      bezier(this.x, this.y, this.cpx + this.featherOffset, this.cpy - this.featherOffset, this.cpx - (j*this.featherOffset), this.cpy + (j*this.featherOffset), x2, y2);
    }
  }
}
