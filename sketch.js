let coords = [];
const coordsLen = 24;

function setup() {
  createCanvas(800, 800);
  noFill();
  noiseDetail(24);
  colorMode(HSB, 360, 100, 100);

  let currentX = width / 2;
  let currentY = height / 2;
  const offset = 50;

  // fill the coordinates array with random data
  for (let i = 0; i < coordsLen; i++) {
    let hasFeathers = false;
    if (Math.ceil(random(100)) > 40) // 60% chance of getting feathers
      hasFeathers = true;
    coords.push(new Coordinate(currentX, currentY, hasFeathers));
    currentX = random(currentX - offset, currentX + offset);
    currentY = random(currentY - offset, currentY + offset);
  }
}


function draw() {
  background(4, 2, 100);
  // cycle through the coordinates to build the curves
  drawMainCurve(coords);

  // cycle through the coordinates again and overlay the feathers
  for (let i = 0; i < coordsLen - 2; i++) {
    if (coords[i].hasFeathers == true) {
      coords[i].drawFeathers(coords[i + 1].x, coords[i + 1].y);
    }
  }
  // selectRegion(0.10, 0.50)
}


function drawMainCurve(coords) {
  beginShape();
  curveVertex(coords[0].x, coords[0].y);
  for (let i = 0; i < coordsLen - 1; i++) {
    stroke(0, 88, 94);
    strokeWeight(2);
    if (i != 0) {
      coords[i].float(coords[i - 1].x, coords[i - 1].y);
    }
    curveVertex(coords[i].x, coords[i].y);
    // if (i != coordsLen - 2) {
    //   coords[i].constrain(coords[i + 1].x, coords[i + 1].y);
    // }
  }
  curveVertex(coords[coordsLen - 1].x, coords[coordsLen - 1].y)
  endShape();
}


function selectPoint(percentage) {
  // find the 2 existing coordinate points closest to the percentage you want
  const closestPoint = (coordsLen - 1) / (1 / percentage);
  const index1 = Math.floor(closestPoint);
  const index2 = Math.floor(closestPoint + 1);

  // calculate new percentage to plot the point between the 2 chosen coordinates
  adjustedPercentage = (closestPoint * 100) % 100 / 100;

  // curvePoint can do percentages between 2 coords only
  let x = curvePoint(coords[index1 == 0 ? index1 : index1 - 1].x, coords[index1].x, coords[index2].x, coords[index2 == (coordsLen - 1) ? index2 : index2 + 1].x, adjustedPercentage);
  let y = curvePoint(coords[index1 == 0 ? index1 : index1 - 1].y, coords[index1].y, coords[index2].y, coords[index2 == (coordsLen - 1) ? index2 : index2 + 1].y, adjustedPercentage);
  stroke(0)
  strokeWeight(2)
  circle(x, y, 10);
  return { x, y };
}

// given 2 percentages, it highlights the region of the curve that falls between them
function selectRegion(percentage1, percentage2) {
  const { x: x1, y: y1 } = selectPoint(percentage1);
  const { x: x2, y: y2 } = selectPoint(percentage2);
  stroke(0)
  strokeWeight(2)
  circle(x1, y1, 10);
  stroke(240, 100, 100)
  circle(x2, y2, 10);
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
    this.state = 1; // 1 = move normally, 2 = reset
  }

  float(prevX, prevY) {
    if (this.state == 1) {
      // make the coordinates float around using Perlin noise
      const moveX = map(noise(this.noiseOffsetX), 0, 1, -0.7, 0.7);
      const moveY = map(noise(this.noiseOffsetY), 0, 1, -0.7, 0.7);
      this.x += moveX;
      this.y += moveY;
      this.noiseOffsetX += this.interval;
      this.noiseOffsetY += this.interval;

      if (dist(this.x, this.y, prevX, prevY) > 200) {
        this.state = 2;
      }
    }
    if (this.state == 2) {
      console.log(this.state);
      const xDesired = prevX;
      const yDesired = prevY;
      const xDist = xDesired - this.x;
      const yDist = yDesired - this.y;
      this.x += 0.02 * xDist;
      this.y += 0.02 * yDist;
      if (dist(this.x, this.y, xDesired, yDesired) < 10) {
        this.state = 1;
      }
    }
  }

  // constrain(x2, y2) {
  //   if (dist(this.x, this.y, x2, y2) > 200) {
  //     const xDesired = x2;
  //     const yDesired = y2;
  //     const xDist = xDesired - this.x;
  //     const yDist = yDesired - this.y;
  //     this.x += 0.05 * xDist;
  //     this.y += 0.05 * yDist;
  //     if ( dist(this.x, this.y, xDesired, yDesired) < 10 ) {
  //       this.state = 1;
  //     }
  //   }
  // }

  drawFeathers(x2, y2) {
    // calculate control point 1 (halfway between the 2 coordinates)
    // control point 2 will be randomized based on cp1
    const calculateX = abs((this.x - x2) / 2);
    const calculateY = abs((this.y - y2) / 2);
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
      stroke(0, this.saturation + j * 10, 95);
      strokeWeight(1);
      // bezier(x1, y1, cpx1, cpy1, cpx2, cpy2, x2, y2)
      bezier(this.x, this.y, this.cpx + this.featherOffset, this.cpy - this.featherOffset, this.cpx - (j * this.featherOffset), this.cpy + (j * this.featherOffset), x2, y2);
    }
  }
}
