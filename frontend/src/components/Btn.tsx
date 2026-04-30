import "./Btn.css";

export default function Btn({ label, secondary, danger, full, onClick }: {
  label: string;
  secondary?: boolean;
  danger?: boolean;
  full?: boolean;
  onClick?: () => void;
}) {
  const classes = [
    "btn",
    danger ? "btn--danger" : secondary ? "btn--secondary" : "btn--primary",
    full ? "btn--full" : "",
  ].filter(Boolean).join(" ");

  return (
    <button className={classes} onClick={onClick}>
      {label}
    </button>
  );
}