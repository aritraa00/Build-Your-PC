import crypto from "crypto";

const stepOrder = ["cpu", "motherboard", "ram", "gpu", "storage", "psu", "case"];

export const getStepOrder = () => stepOrder;

export const normalizeParts = (parts = {}) => {
  const normalized = {};

  stepOrder.forEach((step) => {
    if (parts[step]) {
      normalized[step] = parts[step];
    }
  });

  return normalized;
};

export const calculateTotalPrice = (parts = {}) =>
  Object.values(parts).reduce(
    (total, part) => total + (part?.priceInfo?.bestPrice || part?.price || 0),
    0
  );

export const estimatePower = (parts = {}) => {
  const cpuPower = parts.cpu?.specs?.tdp || 0;
  const gpuPower = parts.gpu?.specs?.tdp || 0;
  const baseline = 75;

  return cpuPower + gpuPower + baseline;
};

export const estimatePerformance = (parts = {}) => {
  const cpuRank = parts.cpu?.specs?.performanceRank || 0;
  const gpuRank = parts.gpu?.specs?.performanceRank || 0;
  const ramRank = parts.ram?.specs?.performanceRank || 0;

  const score = cpuRank * 0.35 + gpuRank * 0.5 + ramRank * 0.15;

  if (score >= 8.5) {
    return "Ultra";
  }

  if (score >= 7) {
    return "High";
  }

  if (score >= 5) {
    return "Medium";
  }

  return "Low";
};

export const getCompatibilityWarnings = (parts = {}) => {
  const warnings = [];

  if (parts.cpu && parts.motherboard) {
    if (parts.cpu.specs?.socket !== parts.motherboard.specs?.socket) {
      warnings.push("CPU socket does not match the motherboard socket.");
    }
  }

  if (parts.ram && parts.motherboard) {
    if (parts.ram.specs?.ramType !== parts.motherboard.specs?.ramType) {
      warnings.push("RAM type does not match the motherboard memory standard.");
    }
  }

  const estimatedPower = estimatePower(parts);

  if (parts.psu) {
    if ((parts.psu.specs?.wattage || 0) < estimatedPower) {
      warnings.push("PSU wattage is lower than the estimated system power draw.");
    }
  }

  if (parts.case && parts.motherboard) {
    const supported = parts.case.specs?.supportedFormFactors || [];
    const boardSize = parts.motherboard.specs?.formFactor;

    if (boardSize && !supported.includes(boardSize)) {
      warnings.push("Case does not support the selected motherboard form factor.");
    }
  }

  return warnings;
};

export const generateShareId = () => crypto.randomBytes(6).toString("hex");
