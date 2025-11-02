export const metadata = {
  title: "Backpropagation Playground",
  description: "Interactive backpropagation examples and visualizations"
};

import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <a href="/" className="brand">Backpropagation Playground</a>
            <nav className="nav">
              <a href="/examples/xor">XOR</a>
              <a href="/examples/logic">Logic</a>
              <a href="/examples/circle">Circle</a>
              <a href="/examples/spiral">Spiral</a>
            </nav>
          </header>
          <main className="main">{children}</main>
          <footer className="footer">Built with Next.js ? ? {new Date().getFullYear()}</footer>
        </div>
      </body>
    </html>
  );
}
