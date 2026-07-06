export default function Header({ tab, setTab, recordCount }) {
    const navBase = "px-[18px] py-1.5 text-xs font-medium tracking-[0.3px] cursor-pointer border-none rounded-[5px] transition-all";
    const navItem = active =>
      `${navBase} ${active ? "bg-accent text-white" : "bg-transparent text-white/60 hover:bg-white/10 hover:text-white"}`;

    return (
      <header className="bg-primary px-8 flex items-center justify-between sticky top-0 z-[100] shadow-[0_2px_8px_rgba(53,73,107,0.25)] h-[58px] max-[900px]:px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] bg-accent [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)]" />
          <span className="text-[17px] font-semibold text-white tracking-[1.5px]">AKAS</span>
          <span className="text-[10px] text-white/50 ml-0.5 tracking-[0.5px]">Diamond Inventory</span>
        </div>
        <nav className="flex gap-1">
          <button
            className={navItem(tab === "add")}
            onClick={() => setTab("add")}
          >
            ＋ Add Stone
          </button>
          <button
            className={navItem(tab === "records")}
            onClick={() => setTab("records")}
          >
            Records ({recordCount})
          </button>
          <button
            className={navItem(tab === "masters")}
            onClick={() => setTab("masters")}
          >
            Masters
          </button>
        </nav>
      </header>
    );
  }