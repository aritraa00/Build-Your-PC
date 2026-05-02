import { Component } from "../models/Component.js";
import { getDynamicPricing, attachPricing } from "./pricingService.js";
import { getCompatibilityWarnings } from "../utils/buildUtils.js";
import { getPerformanceBreakdown } from "./performanceService.js";

const USD_TO_INR = 83.5;
const typeOrder = ["cpu", "motherboard", "ram", "gpu", "storage", "psu", "case"];

const pickCheapest = (items) =>
  [...items].sort((left, right) => getDynamicPricing(left).bestPrice - getDynamicPricing(right).bestPrice)[0];

const pickBestByScore = (items, scorer) =>
  [...items].sort((left, right) => scorer(right) - scorer(left))[0];

const getTypePrice = (component) => getDynamicPricing(component).bestPrice;

const isRamCompatible = (ram, motherboard) => ram?.specs?.ramType === motherboard?.specs?.ramType;
const isCpuCompatible = (cpu, motherboard) => cpu?.specs?.socket === motherboard?.specs?.socket;
const isCaseCompatible = (caseOption, motherboard) =>
  caseOption?.specs?.supportedFormFactors?.includes(motherboard?.specs?.formFactor);

const scorePurpose = (cpu, gpu, purpose, game) => {
  const cpuRank = cpu?.specs?.performanceRank || 0;
  const gpuRank = gpu?.specs?.performanceRank || 0;

  if (purpose === "editing") return cpuRank * 0.65 + gpuRank * 0.35;
  if (purpose === "balanced") return cpuRank * 0.5 + gpuRank * 0.5;
  if (game === "valorant") return cpuRank * 0.6 + gpuRank * 0.4;
  return cpuRank * 0.45 + gpuRank * 0.55;
};

export const generateAutoBuild = async ({ budget, purpose = "gaming", game = "fortnite" }) => {
  const budgetInr = Math.round(budget * USD_TO_INR);

  const components = await Component.find({
    type: { $in: typeOrder }
  }).lean();

  const byType = typeOrder.reduce((map, type) => {
    map[type] = components.filter((item) => item.type === type);
    return map;
  }, {});

  const cpus = byType.cpu;
  const gpus = byType.gpu;
  let bestBuild = null;

  for (const cpu of cpus) {
    for (const gpu of gpus) {
      const compatibleBoards = byType.motherboard.filter((motherboard) =>
        isCpuCompatible(cpu, motherboard)
      );

      const motherboard = pickBestByScore(
        compatibleBoards.filter((item) => getTypePrice(item) <= budgetInr),
        (item) => item.price * -1
      );

      if (!motherboard) continue;

      const ram = pickBestByScore(
        byType.ram.filter((item) => isRamCompatible(item, motherboard)),
        (item) => item.specs?.performanceRank || 0
      );

      const storage = pickBestByScore(
        byType.storage,
        (item) => item.specs?.performanceRank || 0
      );

      const caseOption = pickCheapest(
        byType.case.filter((item) => isCaseCompatible(item, motherboard))
      );

      if (!ram || !storage || !caseOption) continue;

      const tentative = { cpu, motherboard, ram, gpu, storage, case: caseOption };
      const requiredWattage = (cpu.specs?.tdp || 0) + (gpu.specs?.tdp || 0) + 75;
      const psu = pickCheapest(
        byType.psu.filter((item) => (item.specs?.wattage || 0) >= requiredWattage)
      );

      if (!psu) continue;

      tentative.psu = psu;

      const totalPrice = Object.values(tentative).reduce(
        (sum, component) => sum + getDynamicPricing(component).bestPrice,
        0
      );

      if (totalPrice > budgetInr) continue;

      const warnings = getCompatibilityWarnings(tentative);
      if (warnings.length > 0) continue;

      const score = scorePurpose(cpu, gpu, purpose, game);

      if (
        !bestBuild ||
        score > bestBuild.score ||
        (score === bestBuild.score && totalPrice < bestBuild.totalPrice)
      ) {
        bestBuild = {
          score,
          totalPrice,
          parts: tentative,
          performance: getPerformanceBreakdown(tentative)
        };
      }
    }
  }

  if (!bestBuild) {
    throw new Error("No compatible auto-build could be generated inside this budget.");
  }

  // ─── Attach priceInfo to every part before returning ─────────────────────
  const partsWithPricing = Object.fromEntries(
    Object.entries(bestBuild.parts).map(([key, component]) => [
      key,
      attachPricing(component)
    ])
  );

  return {
    ...bestBuild,
    parts: partsWithPricing
  };
};