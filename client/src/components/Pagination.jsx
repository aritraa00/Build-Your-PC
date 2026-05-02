export const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];
  const start = Math.max(page - 2, 1);
  const end = Math.min(start + 4, totalPages);

  for (let current = start; current <= end; current += 1) {
    pages.push(current);
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10 disabled:opacity-40"
      >
        Previous
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onChange(pageNumber)}
          className={`rounded-2xl px-4 py-3 text-sm transition ${
            pageNumber === page ? "bg-sky-400 text-slate-950" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};
