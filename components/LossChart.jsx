"use client";
import { useEffect, useRef } from "react";

export default function LossChart({ losses, width = 320, height = 120 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    if (losses.length === 0) return;
    const maxLoss = Math.max(...losses);
    const minLoss = Math.min(...losses);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;
    ctx.beginPath();
    losses.forEach((l, i) => {
      const x = (i / (losses.length - 1)) * (width - 10) + 5;
      const y = height - 5 - ((l - minLoss) / (maxLoss - minLoss + 1e-9)) * (height - 10);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [losses, width, height]);
  return (
    <div>
      <canvas className="canvas" ref={ref} width={width} height={height} />
      <div className="small">Loss: {losses.at(-1)?.toFixed(4) ?? "-"}</div>
    </div>
  );
}
