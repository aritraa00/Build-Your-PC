const imageSet = {
  cpu: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  motherboard: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80",
  ram: "https://images.unsplash.com/photo-1541029071515-84cc66f84dc5?auto=format&fit=crop&w=800&q=80",
  gpu: "https://images.unsplash.com/photo-1593642634443-44adaa06623a?auto=format&fit=crop&w=800&q=80",
  storage: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?auto=format&fit=crop&w=800&q=80",
  psu: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80",
  case: "https://images.unsplash.com/photo-1587202372705-4fd98e227c25?auto=format&fit=crop&w=800&q=80"
};

const createComponent = (type, brand, name, price, specs) => ({
  name,
  type,
  brand,
  price,
  specs,
  imageUrl: imageSet[type]
});

const cpus = [
  createComponent("cpu", "AMD", "Ryzen 5 5600", 139, {
    socket: "AM4",
    cores: 6,
    threads: 12,
    tdp: 65,
    performanceRank: 6
  }),
  createComponent("cpu", "AMD", "Ryzen 7 5700X", 189, {
    socket: "AM4",
    cores: 8,
    threads: 16,
    tdp: 65,
    performanceRank: 7
  }),
  createComponent("cpu", "AMD", "Ryzen 7 5800X3D", 289, {
    socket: "AM4",
    cores: 8,
    threads: 16,
    tdp: 105,
    performanceRank: 9
  }),
  createComponent("cpu", "AMD", "Ryzen 5 7600", 229, {
    socket: "AM5",
    cores: 6,
    threads: 12,
    tdp: 65,
    performanceRank: 7
  }),
  createComponent("cpu", "AMD", "Ryzen 7 7700X", 309, {
    socket: "AM5",
    cores: 8,
    threads: 16,
    tdp: 105,
    performanceRank: 8
  }),
  createComponent("cpu", "AMD", "Ryzen 7 7800X3D", 399, {
    socket: "AM5",
    cores: 8,
    threads: 16,
    tdp: 120,
    performanceRank: 10
  }),
  createComponent("cpu", "AMD", "Ryzen 9 7900X", 429, {
    socket: "AM5",
    cores: 12,
    threads: 24,
    tdp: 170,
    performanceRank: 9
  }),
  createComponent("cpu", "Intel", "Core i5-12400F", 149, {
    socket: "LGA1700",
    cores: 6,
    threads: 12,
    tdp: 65,
    performanceRank: 6
  }),
  createComponent("cpu", "Intel", "Core i5-13400F", 199, {
    socket: "LGA1700",
    cores: 10,
    threads: 16,
    tdp: 65,
    performanceRank: 7
  }),
  createComponent("cpu", "Intel", "Core i5-14600K", 319, {
    socket: "LGA1700",
    cores: 14,
    threads: 20,
    tdp: 125,
    performanceRank: 8
  }),
  createComponent("cpu", "Intel", "Core i7-14700K", 409, {
    socket: "LGA1700",
    cores: 20,
    threads: 28,
    tdp: 125,
    performanceRank: 9
  }),
  createComponent("cpu", "Intel", "Core i9-14900K", 549, {
    socket: "LGA1700",
    cores: 24,
    threads: 32,
    tdp: 125,
    performanceRank: 10
  })
];

const motherboards = [
  createComponent("motherboard", "MSI", "B550 Tomahawk", 159, {
    socket: "AM4",
    ramType: "DDR4",
    formFactor: "ATX",
    supportedStorage: ["NVMe", "SATA"]
  }),
  createComponent("motherboard", "ASUS", "B550M Prime", 119, {
    socket: "AM4",
    ramType: "DDR4",
    formFactor: "Micro-ATX",
    supportedStorage: ["NVMe", "SATA"]
  }),
  createComponent("motherboard", "Gigabyte", "X570 Aorus Elite", 219, {
    socket: "AM4",
    ramType: "DDR4",
    formFactor: "ATX",
    supportedStorage: ["NVMe", "SATA"]
  }),
  createComponent("motherboard", "MSI", "B650 Gaming WiFi", 189, {
    socket: "AM5",
    ramType: "DDR5",
    formFactor: "ATX",
    supportedStorage: ["NVMe", "SATA"]
  }),
  createComponent("motherboard", "ASUS", "B650M TUF WiFi", 169, {
    socket: "AM5",
    ramType: "DDR5",
    formFactor: "Micro-ATX",
    supportedStorage: ["NVMe", "SATA"]
  }),
  createComponent("motherboard", "ASRock", "A620I Lightning", 149, {
    socket: "AM5",
    ramType: "DDR5",
    formFactor: "Mini-ITX",
    supportedStorage: ["NVMe", "SATA"]
  }),
  createComponent("motherboard", "ASUS", "X670E Creator", 359, {
    socket: "AM5",
    ramType: "DDR5",
    formFactor: "E-ATX",
    supportedStorage: ["NVMe", "SATA"]
  }),
  createComponent("motherboard", "Gigabyte", "B760 DS3H", 129, {
    socket: "LGA1700",
    ramType: "DDR4",
    formFactor: "ATX",
    supportedStorage: ["NVMe", "SATA"]
  }),
  createComponent("motherboard", "MSI", "B760M Mortar", 179, {
    socket: "LGA1700",
    ramType: "DDR5",
    formFactor: "Micro-ATX",
    supportedStorage: ["NVMe", "SATA"]
  }),
  createComponent("motherboard", "Gigabyte", "Z790 Edge", 269, {
    socket: "LGA1700",
    ramType: "DDR5",
    formFactor: "ATX",
    supportedStorage: ["NVMe", "SATA"]
  }),
  createComponent("motherboard", "ASUS", "Z790 Hero", 459, {
    socket: "LGA1700",
    ramType: "DDR5",
    formFactor: "ATX",
    supportedStorage: ["NVMe", "SATA"]
  })
];

const ramKits = [
  createComponent("ram", "Corsair", "16GB DDR4 3200", 49, {
    ramType: "DDR4",
    capacity: 16,
    modules: "2x8GB",
    performanceRank: 4
  }),
  createComponent("ram", "Kingston", "32GB DDR4 3600", 95, {
    ramType: "DDR4",
    capacity: 32,
    modules: "2x16GB",
    performanceRank: 6
  }),
  createComponent("ram", "Corsair", "64GB DDR4 3600", 169, {
    ramType: "DDR4",
    capacity: 64,
    modules: "2x32GB",
    performanceRank: 7
  }),
  createComponent("ram", "Corsair", "16GB DDR5 5600", 69, {
    ramType: "DDR5",
    capacity: 16,
    modules: "2x8GB",
    performanceRank: 5
  }),
  createComponent("ram", "Corsair", "16GB DDR5 6000", 84, {
    ramType: "DDR5",
    capacity: 16,
    modules: "2x8GB",
    performanceRank: 6
  }),
  createComponent("ram", "G.Skill", "32GB DDR5 6000", 124, {
    ramType: "DDR5",
    capacity: 32,
    modules: "2x16GB",
    performanceRank: 8
  }),
  createComponent("ram", "TeamGroup", "32GB DDR5 6400", 139, {
    ramType: "DDR5",
    capacity: 32,
    modules: "2x16GB",
    performanceRank: 8
  }),
  createComponent("ram", "Corsair", "64GB DDR5 6000", 239, {
    ramType: "DDR5",
    capacity: 64,
    modules: "2x32GB",
    performanceRank: 9
  })
];

const gpus = [
  createComponent("gpu", "NVIDIA", "RTX 3050", 219, {
    vram: 8,
    tdp: 130,
    performanceRank: 4
  }),
  createComponent("gpu", "AMD", "RX 6600", 199, {
    vram: 8,
    tdp: 132,
    performanceRank: 5
  }),
  createComponent("gpu", "NVIDIA", "RTX 4060", 299, {
    vram: 8,
    tdp: 115,
    performanceRank: 6
  }),
  createComponent("gpu", "AMD", "RX 7600 XT", 329, {
    vram: 16,
    tdp: 190,
    performanceRank: 6
  }),
  createComponent("gpu", "NVIDIA", "RTX 4060 Ti", 389, {
    vram: 8,
    tdp: 160,
    performanceRank: 7
  }),
  createComponent("gpu", "AMD", "RX 7700 XT", 429, {
    vram: 12,
    tdp: 245,
    performanceRank: 7
  }),
  createComponent("gpu", "AMD", "RX 7800 XT", 499, {
    vram: 16,
    tdp: 263,
    performanceRank: 8
  }),
  createComponent("gpu", "NVIDIA", "RTX 4070 Super", 599, {
    vram: 12,
    tdp: 220,
    performanceRank: 9
  }),
  createComponent("gpu", "NVIDIA", "RTX 4080 Super", 999, {
    vram: 16,
    tdp: 320,
    performanceRank: 10
  })
];

const storageDevices = [
  createComponent("storage", "Kingston", "500GB NVMe SSD", 49, {
    storageType: "NVMe",
    capacity: "500GB",
    performanceRank: 5
  }),
  createComponent("storage", "Samsung", "1TB NVMe SSD", 99, {
    storageType: "NVMe",
    capacity: "1TB",
    performanceRank: 7
  }),
  createComponent("storage", "WD", "2TB NVMe SSD", 159, {
    storageType: "NVMe",
    capacity: "2TB",
    performanceRank: 8
  }),
  createComponent("storage", "Crucial", "2TB SATA SSD", 129, {
    storageType: "SATA",
    capacity: "2TB",
    performanceRank: 5
  }),
  createComponent("storage", "Seagate", "4TB HDD", 89, {
    storageType: "HDD",
    capacity: "4TB",
    performanceRank: 2
  }),
  createComponent("storage", "WD", "8TB HDD", 149, {
    storageType: "HDD",
    capacity: "8TB",
    performanceRank: 2
  })
];

const psus = [
  createComponent("psu", "Corsair", "550W Bronze PSU", 59, {
    wattage: 550,
    efficiency: "80+ Bronze"
  }),
  createComponent("psu", "Cooler Master", "650W Gold PSU", 89, {
    wattage: 650,
    efficiency: "80+ Gold"
  }),
  createComponent("psu", "Corsair", "750W Gold PSU", 109, {
    wattage: 750,
    efficiency: "80+ Gold"
  }),
  createComponent("psu", "Seasonic", "850W Gold PSU", 139, {
    wattage: 850,
    efficiency: "80+ Gold"
  }),
  createComponent("psu", "MSI", "1000W Gold PSU", 189, {
    wattage: 1000,
    efficiency: "80+ Gold"
  }),
  createComponent("psu", "be quiet!", "1200W Platinum PSU", 269, {
    wattage: 1200,
    efficiency: "80+ Platinum"
  })
];

const cases = [
  createComponent("case", "Cooler Master", "Compact Mesh Case", 69, {
    supportedFormFactors: ["Micro-ATX", "Mini-ITX"],
    style: "Airflow"
  }),
  createComponent("case", "NZXT", "Airflow ATX Case", 109, {
    supportedFormFactors: ["ATX", "Micro-ATX", "Mini-ITX"],
    style: "Airflow"
  }),
  createComponent("case", "Fractal", "North Mid Tower", 149, {
    supportedFormFactors: ["ATX", "Micro-ATX", "Mini-ITX"],
    style: "Wood Accent"
  }),
  createComponent("case", "Lian Li", "Creator Tower", 169, {
    supportedFormFactors: ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"],
    style: "Premium"
  }),
  createComponent("case", "NZXT", "H1 Mini Pro", 249, {
    supportedFormFactors: ["Mini-ITX"],
    style: "Small Form Factor"
  }),
  createComponent("case", "Phanteks", "Enthoo Pro 2", 199, {
    supportedFormFactors: ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"],
    style: "Full Tower"
  })
];

export const mockComponents = [
  ...cpus,
  ...motherboards,
  ...ramKits,
  ...gpus,
  ...storageDevices,
  ...psus,
  ...cases
];
