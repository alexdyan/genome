let nodes = [];
const nodesLength = 24;

function setup() {
  createCanvas(800, 800);
  noFill();
  noiseDetail(24);
  colorMode(HSB, 360, 100, 100);

  let currentX = width / 2;
  let currentY = height / 2;
  const offset = 50;

  // fill the coordinates array with random data
  for (let i = 0; i < nodesLength; i++) {
    nodes.push(new Node(currentX, currentY));
    currentX = random(currentX - offset, currentX + offset);
    currentY = random(currentY - offset, currentY + offset);
  }
}


function draw() {
  background(4, 2, 100);
  // cycle through the coordinates to build the curves
  drawMainCurve(nodes);

  // cycle through the coordinates again and overlay the feathers
  for (let i = 0; i < nodesLength - 2; i++) {
    nodes[i].drawFeathers(i, i+1)
  }
}


function drawMainCurve(nodes) {
  beginShape();
  curveVertex(nodes[0].x, nodes[0].y);
  for (let i = 0; i < nodesLength - 1; i++) {
    stroke(0, 88, 94);
    strokeWeight(2);
    if (i != 0) {
      nodes[i].float(nodes[i - 1].x, nodes[i - 1].y);
    }
    curveVertex(nodes[i].x, nodes[i].y);
  }
  curveVertex(nodes[nodesLength - 1].x, nodes[nodesLength - 1].y)
  endShape();
}


class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.interval = 0.01;
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.numFeathers = random(4, 10);
    this.ctrlA = random(-10, 10);
    this.ctrlB = random(-10, 10);
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

  drawFeathers(index1, index2) {
    let pointsData = {x:0, y:0, a1:0, a2:0}
    let pointsData2 = {x:0, y:0, a1:0, a2:0}
    let steps = 3;
    for (let i = 1; i <= steps - 1; i++) {
      let t = i / steps;
      let x = curvePoint(nodes[index1 == 0 ? index1 : index1 - 1].x,
                          nodes[index1].x,
                          nodes[index2].x,
                          nodes[index2 == (nodesLength - 1) ? index2 : index2 + 1].x,
                          t);
      let y = curvePoint(nodes[index1 == 0 ? index1 : index1 - 1].y,
                          nodes[index1].y,
                          nodes[index2].y,
                          nodes[index2 == (nodesLength - 1) ? index2 : index2 + 1].y,
                          t);
      let tx = curveTangent(nodes[index1 == 0 ? index1 : index1 - 1].x,
                            nodes[index1].x,
                            nodes[index2].x,
                            nodes[index2 == (nodesLength - 1) ? index2 : index2 + 1].x,
                            t);
      let ty = curveTangent(nodes[index1 == 0 ? index1 : index1 - 1].y,
                            nodes[index1].y,
                            nodes[index2].y,
                            nodes[index2 == (nodesLength - 1) ? index2 : index2 + 1].y,
                            t);
      let a = atan2(ty, tx);
      a -= Math.PI / 2.0;
      // line(x, y, cos(a) * 10 + x, sin(a) * 10 + y)

      if (i == 1)
        pointsData = {x, y, a1: (v) => cos(a) * v + x, a2: (v) => sin(a) * v + y}
      else
        pointsData2 = {x, y, a1: (v) => cos(a) * v + x, a2: (v) => sin(a) * v + y}
    }

    for (let j = 0; j < this.numFeathers; j++) {
      stroke(0, 100, 100);
      strokeWeight(1)
      if (j % this.numFeathers == 0)
        bezier(nodes[index1].x, nodes[index1].y, pointsData.a1(this.ctrlA*j), pointsData.a2(this.ctrlA*j), pointsData2.a1(this.ctrlB*j), pointsData2.a2(this.ctrlB*j), nodes[index2].x, nodes[index2].y)
      else
        bezier(nodes[index1].x, nodes[index1].y, pointsData.a1(this.ctrlA*j), pointsData.a2(this.ctrlA*j), pointsData2.a1(-this.ctrlB*j), pointsData2.a2(-this.ctrlB*j), nodes[index2].x, nodes[index2].y)

    }
  }
}
