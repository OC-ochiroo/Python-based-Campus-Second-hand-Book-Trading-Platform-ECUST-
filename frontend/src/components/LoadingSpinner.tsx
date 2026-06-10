import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({ message = "Loading...", size = "md" }: LoadingSpinnerProps) {
  return (
    <div className={`spinner-wrap spinner-wrap--${size}`} role="status" aria-label={message}>
      <div className="spinner" />
      {message && <p className="spinner__message">{message}</p>}
    </div>
  );
}
