export default function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#111", fontSize: "0.65rem", letterSpacing: "2px" }}>
      {"●".repeat(Math.floor(rating))}{"○".repeat(5 - Math.floor(rating))}
      <span style={{ color: "#999", marginLeft: 8, fontSize: "0.65rem", fontFamily: "'Space Mono', monospace" }}>{rating}</span>
    </span>
  );
}