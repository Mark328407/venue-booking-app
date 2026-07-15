export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="footer-brand">Venuelist</span>
        <p className="footer-text">
          Built by{" "}
          <a
            href="https://github.com/Mark328407"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mark Anthony Estrecho
          </a>{" "}
          · a full-stack MERN project
        </p>
        <span className="footer-year">&copy; {year} Venuelist</span>
      </div>
    </footer>
  );
}
