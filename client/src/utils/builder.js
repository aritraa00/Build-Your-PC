export const BUILD_STEPS = [
  { key: "cpu", label: "CPU", icon: "CPU" },
  { key: "motherboard", label: "Motherboard", icon: "MB" },
  { key: "ram", label: "RAM", icon: "RAM" },
  { key: "gpu", label: "GPU", icon: "GPU" },
  { key: "storage", label: "Storage", icon: "SSD" },
  { key: "psu", label: "PSU", icon: "PSU" },
  { key: "case", label: "Case", icon: "CASE" }
];

// ─── Currency ─────────────────────────────────────────────────────────────────
const USD_TO_INR = 83.5;

export const toINR = (usdAmount = 0) => Math.round(usdAmount * USD_TO_INR);

export const formatCurrency = (inrAmount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(inrAmount);

// ─── Price helpers ────────────────────────────────────────────────────────────
// priceInfo.bestPrice is already INR (set by backend pricingService)
// raw item.price is USD — convert it
export const getEffectivePrice = (item) => {
  if (item?.priceInfo?.bestPrice) {
    return item.priceInfo.bestPrice;
  }
  return toINR(item?.price || 0);
};

export const calculateTotalPrice = (parts) =>
  Object.values(parts).reduce((sum, item) => sum + getEffectivePrice(item), 0);

// ─── Power ───────────────────────────────────────────────────────────────────
export const estimatePower = (parts) =>
  (parts.cpu?.specs?.tdp || 0) + (parts.gpu?.specs?.tdp || 0) + 75;

// ─── Performance ─────────────────────────────────────────────────────────────
export const estimatePerformanceLabel = (parts) => {
  const score =
    (parts.cpu?.specs?.performanceRank || 0) * 0.35 +
    (parts.gpu?.specs?.performanceRank || 0) * 0.5 +
    (parts.ram?.specs?.performanceRank || 0) * 0.15;

  if (score >= 8.5) return "Ultra";
  if (score >= 7) return "High";
  if (score >= 5) return "Medium";
  return "Low";
};

// ─── Compatibility ────────────────────────────────────────────────────────────
export const getCompatibilityWarnings = (parts) => {
  const warnings = [];

  if (parts.cpu && parts.motherboard && parts.cpu.specs?.socket !== parts.motherboard.specs?.socket) {
    warnings.push("CPU socket and motherboard socket do not match.");
  }

  if (parts.ram && parts.motherboard && parts.ram.specs?.ramType !== parts.motherboard.specs?.ramType) {
    warnings.push("Selected RAM type is incompatible with the motherboard.");
  }

  if (parts.psu && (parts.psu.specs?.wattage || 0) < estimatePower(parts)) {
    warnings.push("PSU wattage is too low for the current estimated power.");
  }

  if (parts.case && parts.motherboard) {
    const supported = parts.case.specs?.supportedFormFactors || [];
    if (!supported.includes(parts.motherboard.specs?.formFactor)) {
      warnings.push("Case does not support the motherboard form factor.");
    }
  }

  return warnings;
};

export const getCompatibilityTone = (warnings) => {
  if (!warnings.length) return "ready";
  if (warnings.length === 1) return "warning";
  return "critical";
};

// ─── Recommended builds ───────────────────────────────────────────────────────
export const getRecommendedBuilds = () => [
  {
    title: "Budget Battle Station",
    description: "1080p-friendly starter build with balanced value.",
    parts: ["Ryzen 5 7600", "RTX 4060", "16GB DDR5"]
  },
  {
    title: "Competitive Gamer",
    description: "High refresh-rate rig aimed at strong 1440p performance.",
    parts: ["Core i5-14600K", "RTX 4070 Super", "32GB DDR5"]
  },
  {
    title: "Creator Hybrid",
    description: "Strong multitasking setup for editing and gaming.",
    parts: ["Ryzen 7 7800X3D", "RX 7800 XT", "32GB DDR5"]
  }
];