// Shown at the bottom of the screen for brief success / info messages
export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast">
      <div className="toast-dot" />
      {message}
    </div>
  );
}
