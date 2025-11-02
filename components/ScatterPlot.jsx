"use client";
import { useEffect, useRef } from "react";

export default function ScatterPlot({ points, labels, width = 320, height = 320 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      const cls = labels[i]?.[0] ?? 0;
      const cx = ((x + 1) / 2) * width;
      const cy = ((y + 1) / 2) * height;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = cls > 0.5 ? "#ef4444" : "#3b82f6";
      ctx.fill();
    }
  }, [points, labels, width, height]);
  return <canvas className="canvas" ref={ref} width={width} height={height} />;
}
