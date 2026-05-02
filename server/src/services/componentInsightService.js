const getUseCase = (component) => {
  const rank = component.specs?.performanceRank || 0;

  if (component.type === "storage") {
    return component.specs?.storageType === "HDD"
      ? "Good for large archival storage and budget-heavy builds."
      : "Strong fit for fast game loads and responsive everyday use.";
  }

  if (component.type === "psu") {
    return (component.specs?.wattage || 0) >= 850
      ? "Great for high-end gaming or editing builds with upgrade headroom."
      : "Solid for mainstream builds with efficient power usage.";
  }

  if (rank >= 9) return "Excellent for premium gaming and creator-focused builds.";
  if (rank >= 7) return "Great for mid-range gaming and balanced productivity work.";
  if (rank >= 5) return "Best suited for value-oriented or entry gaming builds.";
  return "A budget-friendly option for starter or office-focused systems.";
};

const getPairing = (component) => {
  if (component.type === "cpu") {
    if ((component.specs?.performanceRank || 0) >= 9) return "Pairs well with RTX 4070 Super and above.";
    if ((component.specs?.performanceRank || 0) >= 7) return "Pairs well with RTX 4060 Ti, RX 7700 XT, or similar GPUs.";
    return "Best paired with entry to mid-range GPUs to keep the build balanced.";
  }

  if (component.type === "gpu") {
    if ((component.specs?.performanceRank || 0) >= 9) return "Works best with high-end CPUs like Ryzen 7/9 or Core i7/i9 chips.";
    if ((component.specs?.performanceRank || 0) >= 7) return "Pairs nicely with strong mid-range CPUs for 1080p and 1440p gaming.";
    return "A good match for value CPUs and budget-conscious gaming builds.";
  }

  return "Fits well into a balanced build when the rest of the parts target a similar tier.";
};

const getWarnings = (component) => {
  const warnings = [];

  if (component.type === "cpu" && (component.specs?.performanceRank || 0) <= 5) {
    warnings.push("May bottleneck high-end GPUs in newer games.");
  }

  if (component.type === "gpu" && (component.specs?.performanceRank || 0) >= 9) {
    warnings.push("Needs a strong PSU and CPU to avoid leaving performance on the table.");
  }

  if (component.type === "psu" && (component.specs?.wattage || 0) < 650) {
    warnings.push("Not ideal for power-hungry gaming GPUs.");
  }

  return warnings;
};

export const getComponentInsight = (component) => ({
  useCase: getUseCase(component),
  pairing: getPairing(component),
  warnings: getWarnings(component)
});

