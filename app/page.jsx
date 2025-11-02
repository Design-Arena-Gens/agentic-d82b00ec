import Link from "next/link";

export default function Page() {
  return (
    <div className="content">
      <h1>Backpropagation Playground</h1>
      <p>
        Explore neural networks trained with backpropagation on classic toy datasets.
        Tweak hyperparameters and watch decision boundaries evolve in real-time.
      </p>
      <div className="cards">
        <Link className="card" href="/examples/xor">
          <h3>XOR</h3>
          <p>Learn non-linear XOR with a tiny MLP.</p>
        </Link>
        <Link className="card" href="/examples/logic">
          <h3>Logic Gates</h3>
          <p>AND / OR classification using a single-layer net.</p>
        </Link>
        <Link className="card" href="/examples/circle">
          <h3>Circle</h3>
          <p>Classify points inside vs. outside a circle.</p>
        </Link>
        <Link className="card" href="/examples/spiral">
          <h3>Spiral</h3>
          <p>Two intertwined spirals with a deeper MLP.</p>
        </Link>
      </div>
    </div>
  );
}
