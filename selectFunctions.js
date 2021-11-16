function selectPoint(percentage) {
    // find the 2 existing coordinate points closest to the percentage you want
    const closestPoint = (nodesLength - 1) / (1 / percentage);
    const index1 = Math.floor(closestPoint);
    const index2 = Math.floor(closestPoint + 1);
  
    // calculate new percentage to plot the point between the 2 chosen coordinates
    adjustedPercentage = (closestPoint * 100) % 100 / 100;
  
    // curvePoint can do percentages between 2 coords only
    let x = curvePoint(nodes[index1 == 0 ? index1 : index1 - 1].x, nodes[index1].x, nodes[index2].x, nodes[index2 == (nodesLength - 1) ? index2 : index2 + 1].x, adjustedPercentage);
    let y = curvePoint(nodes[index1 == 0 ? index1 : index1 - 1].y, nodes[index1].y, nodes[index2].y, nodes[index2 == (nodesLength - 1) ? index2 : index2 + 1].y, adjustedPercentage);
    
    let tx = curveTangent(nodes[index1 == 0 ? index1 : index1 - 1].x, nodes[index1].x, nodes[index2].x, nodes[index2 == (nodesLength - 1) ? index2 : index2 + 1].x, adjustedPercentage);
    let ty = curveTangent(nodes[index1 == 0 ? index1 : index1 - 1].y, nodes[index1].y, nodes[index2].y, nodes[index2 == (nodesLength - 1) ? index2 : index2 + 1].y, adjustedPercentage);
    let a = atan2(ty, tx);
    a -= Math.PI / 2.0;
    line(x, y, cos(a) * 10 + x, sin(a) * 10 + y);
    
    return { x, y, a };
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