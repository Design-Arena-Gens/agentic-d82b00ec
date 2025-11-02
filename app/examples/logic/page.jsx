"use client";
import { useEffect, useRef, useState } from "react";
import ScatterPlot from "../../../components/ScatterPlot";
import DecisionBoundary from "../../../components/DecisionBoundary";
import LossChart from "../../../components/LossChart";
import { Network } from "../../../lib/nn";
import { makeLogic } from "../../../lib/datasets";

export default function LogicPage() {
  const [gate, setGate] = useState("AND");
  const [{ X, Y }, setData] = useState(() => makeLogic(200, gate, 0.05));
  const [hidden, setHidden] = useState(4);
  const netRef = useRef(null);
  const [lr, setLr] = useState(0.2);
  const [l2, setL2] = useState(0.0);
  const [spf, setSpf] = useState(30);
  const [running, setRunning] = useState(false);
  const [losses, setLosses] = useState([]);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    setData(makeLogic(200, gate, 0.06));
    netRef.current = new Network([2, hidden, 1], ["tanh", "sigmoid"]);
    setLosses([]);
    setVersion((v) => v + 1);
  }, [gate, hidden]);

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
        <h2>Logic Gates</h2>
        <div className="controls">
          <label className="label">Gate</label>
          <select className="input" value={gate} onChange={(e) => setGate(e.target.value)}>
            <option>AND</option>
            <option>OR</option>
            <option>NAND</option>
          </select>
          <label className="label">Hidden size</label>
          <input className="input" type="number" min={0} max={32} value={hidden} onChange={(e) => setHidden(parseInt(e.target.value||"4"))} />
          <label className="label">Learning rate</label>
          <input className="input" type="number" step="0.01" value={lr} onChange={(e) => setLr(parseFloat(e.target.value||"0.1"))} />
          <label className="label">L2 regularization</label>
          <input className="input" type="number" step="0.001" value={l2} onChange={(e) => setL2(parseFloat(e.target.value||"0"))} />
          <label className="label">Steps per frame</label>
          <input className="input" type="number" min={1} max={2000} value={spf} onChange={(e) => setSpf(parseInt(e.target.value||"30"))} />
        </div>
        <div className="button-row">
          <button className="button" onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Train"}</button>
          <button className="button secondary" onClick={() => { netRef.current = new Network([2, hidden, 1], ["tanh", "sigmoid"]); setLosses([]); setVersion((v)=>v+1); }}>Reset Net</button>
          <button className="button ghost" onClick={() => { setData(makeLogic(200, gate, 0.06)); setLosses([]); setVersion((v)=>v+1); }}>Regenerate Data</button>
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
