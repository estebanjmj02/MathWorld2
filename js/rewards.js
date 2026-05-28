export function launchConfetti(canvas) {
  const ctx = canvas.getContext("2d");
  const pieces = Array.from({ length: 130 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight,
    size: 6 + Math.random() * 10,
    speed: 2 + Math.random() * 5,
    spin: Math.random() * Math.PI,
    color: ["#55c7ff", "#b69cff", "#ffd84d", "#62e6b2", "#ffad68"][Math.floor(Math.random() * 5)]
  }));
  let frames = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function draw() {
    resize();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += Math.sin(piece.y * .03) * 1.4;
      piece.spin += .1;
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.spin);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * .62);
      ctx.restore();
    });
    frames += 1;
    if (frames < 180) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  draw();
}
