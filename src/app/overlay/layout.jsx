export default function OverlayLayout({ children }) {
  return (
    <div className="bg-transparent overflow-hidden m-0 p-0">
      {children}
    </div>
  );
}