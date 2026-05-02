import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AutoBuildPanel } from "../components/AutoBuildPanel";
import { BuildCompare } from "../components/BuildCompare";
import { BuildSummary } from "../components/BuildSummary";
import { ComparisonModal } from "../components/ComparisonModal";
import { ComponentCard } from "../components/ComponentCard";
import { FilterBar } from "../components/FilterBar";
import { Pagination } from "../components/Pagination";
import { PerformancePanel } from "../components/PerformancePanel";
import { Stepper } from "../components/Stepper";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { BUILD_STEPS, formatCurrency } from "../utils/builder";

const USD_TO_INR = 83.5;

export const BuilderPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [components, setComponents] = useState([]);
  const [componentTotal, setComponentTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [brands, setBrands] = useState([]);
  const [parts, setParts] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    brand: "",
    maxPrice: "",
    performance: "",
    sort: "price-asc"
  });
  const [page, setPage] = useState(1);
  const [compareBuild, setCompareBuild] = useState(null);
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [buildTitle, setBuildTitle] = useState("My Dream Build");
  const [budget, setBudget] = useState("100000");
  const [purpose, setPurpose] = useState("gaming");
  const [selectedGame, setSelectedGame] = useState("valorant");
  const [comparisonItems, setComparisonItems] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoBuilding, setAutoBuilding] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  const currentStepConfig = BUILD_STEPS[currentStep];
  const currentType = currentStepConfig.key;
  const deferredFilters = useDeferredValue(filters);
  const selectedCount = useMemo(() => Object.keys(parts).length, [parts]);

  useEffect(() => {
    const controller = new AbortController();

    const loadComponents = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.getComponents(
          {
            type: currentType,
            search: deferredFilters.search,
            brand: deferredFilters.brand,
            maxPrice: deferredFilters.maxPrice
              ? Math.round(Number(deferredFilters.maxPrice) / USD_TO_INR)
              : "",
            performance: deferredFilters.performance,
            sort: deferredFilters.sort,
            page,
            limit: 12
          },
          controller.signal
        );

        setComponents(response.items);
        setComponentTotal(response.total || response.items.length);
        setTotalPages(response.totalPages || 1);
        setBrands(response.brands);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
    return () => controller.abort();
  }, [currentType, deferredFilters, page]);

  useEffect(() => {
    const performanceFriendlySteps = new Set(["cpu", "gpu", "ram", "storage"]);

    if (!performanceFriendlySteps.has(currentType) && filters.performance) {
      setFilters((prev) => ({ ...prev, performance: "" }));
    }
  }, [currentType, filters.performance]);

  useEffect(() => {
    setPage(1);
    setComparisonItems([]);
  }, [
    currentType,
    deferredFilters.search,
    deferredFilters.brand,
    deferredFilters.maxPrice,
    deferredFilters.performance,
    deferredFilters.sort
  ]);

  useEffect(() => {
    const loadSavedBuilds = async () => {
      if (!token) {
        setSavedBuilds([]);
        return;
      }

      try {
        const data = await api.getSavedBuilds(token);
        setSavedBuilds(data);
        if (data.length > 0) {
          setCompareBuild(data[0]);
        }
      } catch (_error) {
        setSavedBuilds([]);
      }
    };

    loadSavedBuilds();
  }, [token]);

  useEffect(() => {
    const updatePerformance = async () => {
      if (!parts.cpu && !parts.gpu) {
        setPerformanceData(null);
        return;
      }

      try {
        const data = await api.getPerformanceEstimate(parts);
        setPerformanceData(data);
      } catch (_error) {
        setPerformanceData(null);
      }
    };

    updatePerformance();
  }, [parts]);

  const handleSelect = (item) => {
    setParts((prev) => ({
      ...prev,
      [currentType]: item
    }));
    setShareUrl("");

    if (currentStep < BUILD_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleCompareToggle = (item) => {
    setComparisonItems((prev) => {
      if (prev.some((entry) => entry._id === item._id)) {
        return prev.filter((entry) => entry._id !== item._id);
      }

      return [...prev.slice(-1), item];
    });
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    if (!buildTitle.trim()) {
      setError("Please enter a build title before saving.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const saved = await api.saveBuild(
        {
          title: buildTitle,
          parts
        },
        token
      );

      const nextShareUrl = `${window.location.origin}/build/${saved.shareId}`;
      setShareUrl(nextShareUrl);
      setSavedBuilds((prev) => [saved, ...prev]);
      setCompareBuild(saved);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!compareBuild?._id) {
      return;
    }

    setDeletingId(compareBuild._id);
    setError("");

    try {
      await api.deleteBuild(compareBuild._id, token);
      const remaining = savedBuilds.filter((item) => item._id !== compareBuild._id);
      setSavedBuilds(remaining);
      setCompareBuild(remaining[0] || null);
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId("");
    }
  };

  const applyGeneratedBuild = (generated) => {
    setParts(generated.parts || {});
    setBuildTitle(generated.title || "Smart Recommended Build");
    if (generated.performance) {
      setPerformanceData({
        ...generated.performance,
        label: generated.performance.label || "High"
      });
    }
    setCurrentStep(BUILD_STEPS.length - 1);
    setShareUrl("");
  };

  const handleAutoBuild = async () => {
    setAutoBuilding(true);
    setError("");

    try {
      const generated = await api.generateAutoBuild({
        budget: Math.round(Number(budget) / USD_TO_INR),
        purpose,
        game: selectedGame
      });

      applyGeneratedBuild({
        ...generated,
        title: `Auto ${purpose.charAt(0).toUpperCase() + purpose.slice(1)} Build`
      });
    } catch (buildError) {
      setError(buildError.message);
    } finally {
      setAutoBuilding(false);
    }
  };

  const handleGameOptimize = async () => {
    setAutoBuilding(true);
    setError("");

    try {
      const generated = await api.generateAutoBuild({
        budget: Math.round(Number(budget) / USD_TO_INR),
        purpose: "gaming",
        game: selectedGame
      });

      applyGeneratedBuild({
        ...generated,
        title: `${selectedGame === "gtaV" ? "GTA V" : selectedGame.charAt(0).toUpperCase() + selectedGame.slice(1)} Optimized Build`
      });
    } catch (buildError) {
      setError(buildError.message);
    } finally {
      setAutoBuilding(false);
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section>
        <div className="glass-panel mb-6 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Builder</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Step-by-step PC planner</h1>
              <p className="mt-2 text-slate-400">
                Selected {selectedCount} of {BUILD_STEPS.length} parts. Save builds to your account and share them with a link.
              </p>
            </div>

            <label className="text-sm text-slate-300">
              Build title
              <input
                type="text"
                value={buildTitle}
                onChange={(event) => setBuildTitle(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none lg:w-80"
              />
            </label>
          </div>
        </div>

        <AutoBuildPanel
          budget={budget}
          onBudgetChange={setBudget}
          purpose={purpose}
          onPurposeChange={setPurpose}
          game={selectedGame}
          onGameChange={setSelectedGame}
          onAutoBuild={handleAutoBuild}
          onGameOptimize={handleGameOptimize}
          loading={autoBuilding}
        />

        <Stepper currentStep={currentStep} onChange={setCurrentStep} />
        <FilterBar brands={brands} filters={filters} setFilters={setFilters} />

        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Current step</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{currentStepConfig.label}</h2>
            <p className="mt-2 text-sm text-slate-400">
              Showing {components.length} of {componentTotal} available {currentStepConfig.label.toLowerCase()} options.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Budget target: {formatCurrency(Number(budget) || 0)} • Game focus: {selectedGame === "gtaV" ? "GTA V" : selectedGame}
            </p>
          </div>

          {savedBuilds.length > 0 ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={compareBuild?._id || ""}
                onChange={(event) =>
                  setCompareBuild(savedBuilds.find((item) => item._id === event.target.value) || null)
                }
                className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
              >
                {savedBuilds.map((build) => (
                  <option key={build._id} value={build._id}>
                    Compare with: {build.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!compareBuild || Boolean(deletingId)}
                className="rounded-2xl border border-orange-400/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-200 transition hover:bg-orange-500/20 disabled:opacity-50"
              >
                {deletingId ? "Deleting..." : "Delete selected build"}
              </button>
            </div>
          ) : null}
        </div>

        {error ? <p className="mb-4 rounded-2xl bg-orange-500/10 p-4 text-sm text-orange-200">{error}</p> : null}

        {loading ? (
          <div className="glass-panel p-8 text-slate-300">Loading components...</div>
        ) : components.length === 0 ? (
          <div className="glass-panel p-8 text-slate-300">
            No components match the current filters. Try widening the price or brand filters.
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {components.map((item) => (
                <ComponentCard
                  key={item._id}
                  item={item}
                  selected={parts[currentType]?._id === item._id}
                  onSelect={handleSelect}
                  onCompareToggle={handleCompareToggle}
                  isCompared={comparisonItems.some((entry) => entry._id === item._id)}
                />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}

        <PerformancePanel performanceData={performanceData} />
        <BuildCompare currentParts={parts} buildToCompare={compareBuild} />
      </section>

      <BuildSummary
        parts={parts}
        onSave={handleSave}
        isSaving={saving}
        shareUrl={shareUrl}
        saveDisabled={selectedCount === 0}
        budget={Number(budget) || 0}
        performanceData={performanceData}
      />

      <ComparisonModal
        items={comparisonItems}
        stepLabel={currentStepConfig.label}
        onClose={() => setComparisonItems([])}
      />
    </div>
  );
};