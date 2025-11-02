"use client";
import { useEffect, useRef } from "react";
import { makeGrid } from "../lib/nn";

export default function DecisionBoundary({ net, width = 320, height = 320, scale = 1.2 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !net) return;
    const ctx = canvas.getContext("2d");
    const { xs, w, h } = makeGrid(width, height, scale);
    // Evaluate in batches for performance
    const points = [];
    for (let i = 0; i < xs.length; i += 2) points.push([xs[i], xs[i + 1]]);
    const preds = [];
    const batchSize = 1024;
    for (let i = 0; i < points.length; i += batchSize) {
      const batch = points.slice(i, i + batchSize);
      const { Yhat } = net.predict(batch);
      for (let j = 0; j < Yhat.length; j++) preds.push(Yhat[j][0]);
    }
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < w * h; i++) {
      const p = preds[i] ?? 0;
      const r = Math.floor(239 * p + 59 * (1 - p));
      const g = Math.floor(68 * (1 - p) + 82 * p);
      const b = Math.floor(246 * (1 - p) + 46 * p);
      const idx = i * 4;
      img.data[idx] = r; img.data[idx + 1] = g; img.data[idx + 2] = b; img.data[idx + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, [net, width, height, scale]);
  return <canvas className="canvas" ref={ref} width={width} height={height} />;
}
