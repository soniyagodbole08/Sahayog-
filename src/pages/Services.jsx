import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ArrowRight } from "lucide-react";
import ServiceCard from "../components/ServiceCard";
import { services, categories } from "../data";
import Icon from "../components/Icon";
import BackButton from "../components/BackButton";
import { useToast } from "../useToast";
import { useAuth } from "../context/useAuth";

const sortOptions = [
  { id: "popular", label: "Most Popular" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Highest Rated" },
];

function Services() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [sort, setSort] = useState("popular");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [mobileFilter, setMobileFilter] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const activeCat = params.get("cat") || "all";
  const activeQuery = params.get("q") || "";

  const results = useMemo(() => {
    let list = [...services];

    if (activeCat !== "all") list = list.filter((s) => s.category === activeCat);

    if (activeQuery) {
      const q = activeQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.categoryLabel.toLowerCase().includes(q)
      );
    }

    if (min) list = list.filter((s) => s.price >= Number(min));
    if (max) list = list.filter((s) => s.price <= Number(max));
    if (onlyVerified) list = list.filter((s) => s.verified);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => b.booked - a.booked);
    }

    return list;
  }, [activeCat, activeQuery, min, max, onlyVerified, sort]);

  const activeCatObj = categories.find((c) => c.id === activeCat);

  function applySearch(e) {
    e.preventDefault();
    setParams(query ? { q: query } : {});
    if (query) toast(`Showing results for "${query}"`, "info");
  }

  function setCat(cat) {
    const next = new URLSearchParams(params);
    if (cat === "all") next.delete("cat");
    else next.set("cat", cat);
    setParams(next);
  }

  function clearFilters() {
    setParams({});
    setMin("");
    setMax("");
    setOnlyVerified(false);
  }

  const priceRange = `₹${min || 0} – ₹${max || "50,000"}`;

  return (
    <div className="page-wrap">
      <div className="page-hero slim">
        <div className="page-inner">
          <BackButton className="hero" />
          <span className="eyebrow">SERVICES</span>
          <h1>Find the right professional for the job</h1>
          <p>
            Every provider is background-verified and backed by a local
            cooperative. Transparent pricing, quality guarantee.
          </p>

          <form className="page-search" onSubmit={applySearch}>
            <Search size={20} />
            <input
              placeholder="Search services, e.g. AC repair, tiffin..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search services"
            />
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="page-inner">
        <div className="category-tabs">
          <button
            className={activeCat === "all" ? "cat-tab active" : "cat-tab"}
            onClick={() => setCat("all")}
          >
            All Services
          </button>
          {categories.map((c) => (
            <button
              className={activeCat === c.id ? "cat-tab active" : "cat-tab"}
              key={c.id}
              onClick={() => setCat(c.id)}
            >
              <Icon name={c.icon} size={15} />
              {c.label}
            </button>
          ))}
        </div>

        <div className="browse-layout">
          <aside className={`browse-filters ${mobileFilter ? "open" : ""}`}>
            {mobileFilter && <div className="filter-mobile-head">
              <h3>Filters</h3>
              <button className="icon-btn" onClick={() => setMobileFilter(false)} aria-label="Close filters">
                <X size={18} />
              </button>
            </div>}

            <div className="filter-group">
              <h4><SlidersHorizontal size={15} /> Budget Range</h4>
              <div className="filter-range">
                <div className="input-box">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    aria-label="Minimum price"
                  />
                </div>
                <span>to</span>
                <div className="input-box">
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                    aria-label="Maximum price"
                  />
                </div>
              </div>
              <p className="filter-hint">Current: {priceRange}</p>
            </div>

            <div className="filter-group">
              <h4>Sort By</h4>
              {sortOptions.map((o) => (
                <label className="radio-row" key={o.id}>
                  <input
                    type="radio"
                    name="sort"
                    checked={sort === o.id}
                    onChange={() => setSort(o.id)}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>

            <div className="filter-group">
              <label className="radio-row check">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                />
                <span>Verified providers only</span>
              </label>
            </div>

            <div className="filter-actions">
              <button className="btn btn-outline btn-block btn-sm" onClick={clearFilters}>
                Clear Filters
              </button>
              <button className="btn btn-primary btn-block btn-sm" onClick={() => setMobileFilter(false)}>
                Apply
              </button>
            </div>
          </aside>
          {mobileFilter && <button className="filter-backdrop" onClick={() => setMobileFilter(false)} />}

          <div className="browse-main">
            <div className="browse-toolbar">
              <p>
                <strong>{results.length}</strong> service{results.length !== 1 && "s"}
                {activeCatObj ? ` in ${activeCatObj.label}` : ""}
                {activeQuery ? ` for "${activeQuery}"` : ""}
              </p>
              <button className="btn btn-outline btn-sm mobile-filters" onClick={() => setMobileFilter(true)}>
                <SlidersHorizontal size={15} /> Filters
              </button>
            </div>

            {results.length === 0 ? (
              <div className="empty-state">
                <Search size={30} />
                <h3>No services found</h3>
                <p>Try a different keyword or clear your filters.</p>
                <button className="btn btn-primary btn-sm" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="service-grid">
                {results.map((s) => (
                  <ServiceCard
                    key={s.id}
                    service={s}
                    onBook={(svc) => {
                      if (!user) {
                        toast("Please login to book a service.", "info");
                        navigate("/login", { state: { from: `/services/${svc.id}#book` } });
                      } else {
                        navigate(`/services/${svc.id}#book`);
                      }
                    }}
                  />
                ))}
              </div>
            )}

            <div className="view-all-strip">
              <span>
                <ArrowRight size={16} /> Helping neighbourhoods, one booking at a time
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;