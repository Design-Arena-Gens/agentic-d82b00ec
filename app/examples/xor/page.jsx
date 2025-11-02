"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import ScatterPlot from "../../../components/ScatterPlot";
import DecisionBoundary from "../../../components/DecisionBoundary";
import LossChart from "../../../components/LossChart";
import { Network } from "../../../lib/nn";
import { makeXOR } from "../../../lib/datasets";

export default function XORPage() {
  const [{ X, Y }, setData] = useState(() => makeXOR(200, 0.1));
  const [hidden, setHidden] = useState(8);
  const netRef = useRef(null);
  const [lr, setLr] = useState(0.2);
  const [l2, setL2] = useState(0.0);
  const [spf, setSpf] = useState(50);
  const [running, setRunning] = useState(false);
  const [losses, setLosses] = useState([]);
  const [version, setVersion] = useState(0);

  // Initialize network
  useEffect(() => {
    netRef.current = new Network([2, hidden, 1], ["tanh", "sigmoid"]);
    setLosses([]);
    setVersion((v) => v + 1);
  }, [hidden]);

  // Training loop
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

  const regenerate = () => {
    setData(makeXOR(200, 0.12));
    setLosses([]);
    setVersion((v) => v + 1);
  };

  return (
    <div className="row">
      <div className="panel" style={{ flex: 1 }}>
        <h2>XOR</h2>
        <p className="small">Non-linear classification requiring a hidden layer.</p>
        <div className="controls">
          <label className="label">Hidden size</label>
          <input className="input" type="number" min={2} max={64} value={hidden} onChange={(e) => setHidden(parseInt(e.target.value||"8"))} />
          <label className="label">Learning rate</label>
          <input className="input" type="number" step="0.01" value={lr} onChange={(e) => setLr(parseFloat(e.target.value||"0.1"))} />
          <label className="label">L2 regularization</label>
          <input className="input" type="number" step="0.001" value={l2} onChange={(e) => setL2(parseFloat(e.target.value||"0"))} />
          <label className="label">Steps per frame</label>
          <input className="input" type="number" min={1} max={2000} value={spf} onChange={(e) => setSpf(parseInt(e.target.value||"50"))} />
        </div>
        <div className="button-row">
          <button className="button" onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Train"}</button>
          <button className="button secondary" onClick={() => { netRef.current = new Network([2, hidden, 1], ["tanh", "sigmoid"]); setLosses([]); setVersion((v)=>v+1); }}>Reset Net</button>
          <button className="button ghost" onClick={regenerate}>Regenerate Data</button>
        </div>
      </div>
      <div className="panel" style={{ flexBasis: 340 }}>
        <DecisionBoundary net={netRef.current} version={version} width={320} height={320} />
      </div>
      <div className="panel" style={{ flexBasis: 340 }}>
        <ScatterPlot points={X} labels={Y} width={320} height={320} />
        <LossChart losses={losses} width={320} height={120} />
      </div>
    </div>
  );
}
