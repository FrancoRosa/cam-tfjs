const renamer = (text) => {
  switch (text) {
    case "bowl":
      return "tube"
    case "cup":
      return "tube"
    case "bottle":
      return "tube"
    case "frisbee":
      return "tube"
    default:
      return text
  }
}

const reColor = (text) => {
  switch (text) {
    case "bowl":
      return "#FF0000"
    case "cup":
      return "#FF0000"
    case "bottle":
      return "#FF0000"
    case "frisbee":
      return "#FF0000"
    default:
      return "#32CD32"
  }
}

export const drawRect = (detections, ctx) => {
  // Loop through each prediction
  detections.forEach((prediction) => {
    // Extract boxes and classes
    const {
      bbox: [x, y, width, height],
      class: text,
      score,
    } = prediction;

    // Set styling
    // const color = Math.floor(Math.random() * 16777215).toString(16);
    const acc = Math.round(score * 100);
    ctx.strokeStyle = reColor(text);
    ctx.font = "2em Monospace";

    // Draw rectangles and text
    ctx.beginPath();
    ctx.fillStyle = reColor(text);
    ctx.fillText(`${renamer(text)} ${acc}% ${width.toFixed(1)}`, x + 5, y + 24);
    ctx.lineWidth = 5;
    ctx.rect(x, y, width, height);
    ctx.stroke();
  });
};

export const getDistance = (people, resolution) => {
  const closest = Math.max(...people.map((p) => p.x));
  const shoulder = 60;
  const realD = 70;
  const px = 280;
  const fl = (px * realD) / shoulder;
  const distance = (shoulder * fl) / closest;
  const distanceFt = distance / 30.5;
  return distanceFt.toFixed(1);
};
