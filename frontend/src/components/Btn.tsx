export default function Btn({ label, secondary, danger, full, onClick }: { label: string; secondary?: boolean; danger?: boolean; full?: boolean; onClick?: () => void }) {
  const base: React.CSSProperties = {
    padding: secondary || danger ? "6px 16px" : "8px 22px",
    border: danger ? "1px solid #ddd" : secondary ? "1px solid #ddd" : "1px solid #111",
    cursor: "pointer",
    fontFamily: "'Space Mono', monospace",
    fontWeight: 400,
    fontSize: "0.68rem",
    letterSpacing: "0.08em",
    transition: "all 0.2s",
    width: full ? "100%" : "auto",
    background: danger ? "transparent" : secondary ? "transparent" : "#111",
    color: danger ? "#999" : secondary ? "#666" : "#fff",
    borderRadius: 0,
  };
  return (
    <button
      style={base}
      onClick={onClick}
      onMouseEnter={e => {
        if (!secondary && !danger) { e.currentTarget.style.background = "#333"; e.currentTarget.style.borderColor = "#333"; }
        else { e.currentTarget.style.color = "#111"; e.currentTarget.style.borderColor = "#111"; }
      }}
      onMouseLeave={e => {
        if (!secondary && !danger) { e.currentTarget.style.background = "#111"; e.currentTarget.style.borderColor = "#111"; }
        else { e.currentTarget.style.color = danger ? "#999" : "#666"; e.currentTarget.style.borderColor = "#ddd"; }
      }}
    >{label}</button>
  );
}