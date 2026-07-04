export default function Header({ tab, setTab, recordCount }) {
    return (
      <header className="header">
        <div className="logo">
          <div className="logo-icon" />
          <span className="logo-name">AKAS</span>
          <span className="logo-tag">Diamond Inventory</span>
        </div>
        <nav className="nav">
          <button
            className={`nav-btn ${tab === "add" ? "active" : ""}`}
            onClick={() => setTab("add")}
          >
            ＋ Add Stone
          </button>
          <button
            className={`nav-btn ${tab === "records" ? "active" : ""}`}
            onClick={() => setTab("records")}
          >
            Records ({recordCount})
          </button>
          <button
            className={`nav-btn ${tab === "masters" ? "active" : ""}`}
            onClick={() => setTab("masters")}
          >
            Masters
          </button>
        </nav>
      </header>
    );
  }