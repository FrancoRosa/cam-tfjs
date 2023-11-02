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
    const lime = "#32CD32";
    ctx.strokeStyle = lime;
    ctx.font = "18px Monospace";

    // Draw rectangles and text
    ctx.beginPath();
    ctx.fillStyle = lime;
    ctx.fillText(`${text} ${acc}%`, x + 5, y + 18);
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
