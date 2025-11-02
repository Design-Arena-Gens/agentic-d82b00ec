"use client";
import { useEffect, useRef, useState } from "react";
import ScatterPlot from "../../../components/ScatterPlot";
import DecisionBoundary from "../../../components/DecisionBoundary";
import LossChart from "../../../components/LossChart";
import { Network } from "../../../lib/nn";
import { makeCircle } from "../../../lib/datasets";

export default function CirclePage() {
  const [{ X, Y }, setData] = useState(() => makeCircle(600, 0.6, 0.05));
  const [hidden1, setHidden1] = useState(12);
  const [hidden2, setHidden2] = useState(12);
  const netRef = useRef(null);
  const [lr, setLr] = useState(0.15);
  const [l2, setL2] = useState(0.000);
  const [spf, setSpf] = useState(80);
  const [running, setRunning] = useState(false);
  const [losses, setLosses] = useState([]);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    netRef.current = new Network([2, hidden1, hidden2, 1], ["tanh", "tanh", "sigmoid"]);
    setLosses([]);
    setVersion((v) => v + 1);
  }, [hidden1, hidden2]);

  useEffect(() => {
    if (!running) return;
    let raf; let cancelled = false;
    const step = () => {
      if (cancelled) return;
      let loss;
      for (let i = 0; i < spf; i++) loss = netRef.current.trainStep(X, Y, lr, l2);
      setLosses((ls) => [...ls.slice(-299), loss]);
      setVersion((v) => v + 1);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [running, spf, lr, l2, X, Y]);

  return (
    <div className="row">
      <div className="panel" style={{ flex: 1 }}>
        <h2>Circle Classification</h2>
        <div className="controls">
          <label className="label">Hidden size 1</label>
          <input className="input" type="number" min={2} max={64} value={hidden1} onChange={(e) => setHidden1(parseInt(e.target.value||"12"))} />
          <label className="label">Hidden size 2</label>
          <input className="input" type="number" min={2} max={64} value={hidden2} onChange={(e) => setHidden2(parseInt(e.target.value||"12"))} />
          <label className="label">Learning rate</label>
          <input className="input" type="number" step="0.01" value={lr} onChange={(e) => setLr(parseFloat(e.target.value||"0.1"))} />
          <label className="label">L2 regularization</label>
          <input className="input" type="number" step="0.001" value={l2} onChange={(e) => setL2(parseFloat(e.target.value||"0"))} />
          <label className="label">Steps per frame</label>
          <input className="input" type="number" min={1} max={3000} value={spf} onChange={(e) => setSpf(parseInt(e.target.value||"80"))} />
        </div>
        <div className="button-row">
          <button className="button" onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Train"}</button>
          <button className="button secondary" onClick={() => { netRef.current = new Network([2, hidden1, hidden2, 1], ["tanh", "tanh", "sigmoid"]); setLosses([]); setVersion((v)=>v+1); }}>Reset Net</button>
          <button className="button ghost" onClick={() => { setData(makeCircle(600, 0.6, 0.06)); setLosses([]); setVersion((v)=>v+1); }}>Regenerate Data</button>
        </div>
      </div>
      <div className="panel" style={{ flexBasis: 340 }}>
        <DecisionBoundary net={netRef.current} version={version} width={320} height={320} scale={1.4} />
      </div>
      <div className="panel" style={{ flexBasis: 340 }}>
        <ScatterPlot points={X} labels={Y} width={320} height={320} />
        <LossChart losses={losses} width={320} height={120} />
      </div>
    </div>
  );
}
