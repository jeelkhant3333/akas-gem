// Shown at the bottom of the screen for brief success / info messages
export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[999] bg-gray-800 text-white px-[18px] py-3 rounded-lg text-[13px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center gap-2 animate-[toastIn_0.25s_ease]">
      <div className="w-[7px] h-[7px] bg-accent rounded-full" />
      {message}
    </div>
  );
}
