const games = {
  valorant: { cpuWeight: 0.6, gpuWeight: 0.4, base: 95, scale: 18, quality: "1080p High" },
  gtaV: { cpuWeight: 0.45, gpuWeight: 0.55, base: 40, scale: 11, quality: "1080p High" },
  fortnite: { cpuWeight: 0.5, gpuWeight: 0.5, base: 55, scale: 13, quality: "1080p High" }
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const getCpuScore = (cpu) => cpu?.specs?.performanceRank || 0;
export const getGpuScore = (gpu) => gpu?.specs?.performanceRank || 0;

export const getPerformanceBreakdown = (parts = {}) => {
  const cpuScore = getCpuScore(parts.cpu);
  const gpuScore = getGpuScore(parts.gpu);
  const ramScore = parts.ram?.specs?.performanceRank || 0;
  const combinedScore = cpuScore * 0.35 + gpuScore * 0.5 + ramScore * 0.15;
  const gamingScore = clamp(Math.round(combinedScore), 1, 10);
  const productivityScore = clamp(Math.round(cpuScore * 0.55 + ramScore * 0.25 + gpuScore * 0.2), 1, 10);

  const fps = Object.entries(games).map(([slug, config]) => {
    const score = cpuScore * config.cpuWeight + gpuScore * config.gpuWeight;
    const estimated = Math.round(config.base + score * config.scale);

    return {
      game: slug,
      label: slug === "gtaV" ? "GTA V" : slug.charAt(0).toUpperCase() + slug.slice(1),
      fps: estimated,
      quality: config.quality,
      summary: `${slug === "valorant" && estimated >= 200 ? "200+" : estimated} FPS (${config.quality})`
    };
  });

  return {
    gamingScore,
    productivityScore,
    combinedScore: gamingScore,
    fps
  };
};

export const getPerformanceLabel = (score) => {
  if (score >= 9) return "Ultra";
  if (score >= 7) return "High";
  if (score >= 5) return "Medium";
  return "Low";
};

