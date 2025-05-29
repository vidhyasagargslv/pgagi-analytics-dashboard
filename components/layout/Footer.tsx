export function Footer() {
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content">
      <div>
        <p>© {new Date().getFullYear()} - Analytics Dashboard</p>
      </div>
    </footer>
  );
}