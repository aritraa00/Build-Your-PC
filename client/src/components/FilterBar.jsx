export const FilterBar = ({ brands, filters, setFilters }) => (
  <div className="glass-panel mb-6 grid gap-4 p-4 md:grid-cols-6">
    <label className="text-sm text-slate-300">
      Search
      <input
        type="text"
        value={filters.search}
        onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
        placeholder="Search by name"
      />
    </label>

    <label className="text-sm text-slate-300">
      Brand
      <select
        value={filters.brand}
        onChange={(event) => setFilters((prev) => ({ ...prev, brand: event.target.value }))}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
      >
        <option value="">All brands</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </label>

    <label className="text-sm text-slate-300">
      Max price
      <input
        type="number"
        min="0"
        value={filters.maxPrice}
        onChange={(event) => setFilters((prev) => ({ ...prev, maxPrice: event.target.value }))}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
        placeholder="No limit"
      />
    </label>

    <label className="text-sm text-slate-300">
      Performance
      <select
        value={filters.performance}
        onChange={(event) => setFilters((prev) => ({ ...prev, performance: event.target.value }))}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
      >
        <option value="">Any tier</option>
        <option value="medium">Medium+</option>
        <option value="high">High+</option>
        <option value="ultra">Ultra</option>
      </select>
    </label>

    <label className="text-sm text-slate-300">
      Sort by
      <select
        value={filters.sort}
        onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
      >
        <option value="price-asc">Price: Low to high</option>
        <option value="price-desc">Price: High to low</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="name-desc">Name: Z to A</option>
        <option value="newest">Newest imported</option>
      </select>
    </label>

    <button
      type="button"
      onClick={() => setFilters({ search: "", brand: "", maxPrice: "", performance: "", sort: "price-asc" })}
      className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
    >
      Reset filters
    </button>
  </div>
);
