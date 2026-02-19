
export default function Search() {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="px-6 py-4 flex justify-between items-center backdrop-blur-xl" style={{ background: "var(--premium-surface)", borderBottom: "1px solid var(--premium-border)" }}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-800 flex items-center justify-center shadow-lg shadow-amber-900/20 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">QUAN<span className="text-amber-500">TILE</span></span>
        </div>
      </header>

      <main className="flex-1 p-6 flex justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full ">
          <h1>hello</h1>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4">
        &copy; 2025 Quantile. All Rights Reserved.
      </footer>
    </div>
  );
}
