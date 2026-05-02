import crypto from "crypto";

const USD_TO_INR = 83;

const hashSeed = (value) => {
  const hash = crypto.createHash("sha256").update(value).digest("hex");
  return parseInt(hash.slice(0, 8), 16);
};

const getRatio = (seed, min, max) => {
  const normalized = (seed % 1000) / 1000;
  return min + (max - min) * normalized;
};

export const getDynamicPricing = (component) => {
  const priceSeed = hashSeed(`${component.name}-${component.brand}-${new Date().toISOString().slice(0, 10)}`);
  const baseInr = Math.round((component.price || 0) * USD_TO_INR);
  const amazonRatio = getRatio(priceSeed, 0.93, 1.08);
  const flipkartRatio = getRatio(priceSeed >> 1, 0.92, 1.09);
  const amazonPrice = Math.round(baseInr * amazonRatio);
  const flipkartPrice = Math.round(baseInr * flipkartRatio);

  const offers = [
    { vendor: "Amazon", price: amazonPrice },
    { vendor: "Flipkart", price: flipkartPrice }
  ].sort((left, right) => left.price - right.price);

  return {
    basePriceInr: baseInr,
    offers,
    bestPrice: offers[0].price,
    bestVendor: offers[0].vendor,
    lastUpdated: new Date().toISOString()
  };
};

export const attachPricing = (component) => ({
  ...component,
  priceInfo: getDynamicPricing(component)
});

