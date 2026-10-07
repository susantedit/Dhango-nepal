export const initialProducts = [
  {
    id: 'prod-classic-01',
    title: 'Dhango Classic Crewneck T-Shirt',
    slug: 'dhango-classic-crewneck',
    description: '100% Super-Combed Ring-Spun Cotton (220 GSM). Perfect everyday drape for vibrant DTG custom graphics and crisp text prints.',
    originalPrice: 2000,
    salePrice: 1500,
    category: 'classic',
    colors: [
      { name: 'Jet Black', hex: '#111111' },
      { name: 'Optical White', hex: '#FFFFFF' },
      { name: 'Heather Grey', hex: '#9E9E9E' },
      { name: 'Navy Blue', hex: '#1B2A4A' },
      { name: 'Forest Green', hex: '#2D5A27' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: '100% Ring-Spun Cotton (220 GSM)',
    featured: true,
    inStock: true
  },
  {
    id: 'prod-oversized-02',
    title: 'Dhango Oversized Streetwear Tee',
    slug: 'dhango-oversized-streetwear',
    description: 'Heavyweight 240 GSM drop-shoulder boxy fit inspired by Kathmandu streetwear culture. Built to showcase bold chest and back designs.',
    originalPrice: 2000,
    salePrice: 1500,
    category: 'oversized',
    colors: [
      { name: 'Jet Black', hex: '#111111' },
      { name: 'Optical White', hex: '#FFFFFF' },
      { name: 'Heather Grey', hex: '#9E9E9E' },
      { name: 'Crimson Red', hex: '#991B1B' }
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    material: 'Heavyweight 240 GSM Pre-Shrunk Cotton',
    featured: true,
    inStock: true
  },
  {
    id: 'prod-heritage-03',
    title: 'Nepal Heritage Typography Tee',
    slug: 'nepal-heritage-typography',
    description: 'Nepali calligraphy and modern typography print on ultra-soft bio-washed combed cotton.',
    originalPrice: 2000,
    salePrice: 1500,
    category: 'streetwear',
    colors: [
      { name: 'Jet Black', hex: '#111111' },
      { name: 'Optical White', hex: '#FFFFFF' },
      { name: 'Forest Green', hex: '#2D5A27' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: '220 GSM Bio-Washed Cotton',
    featured: true,
    inStock: true
  },
  {
    id: 'prod-anime-04',
    title: 'Dhango Anime & Cyberpunk Edition',
    slug: 'dhango-anime-cyberpunk',
    description: 'Ultra-vibrant DTG color fidelity optimized for intricate anime artwork, manga panels, and high-contrast digital illustrations.',
    originalPrice: 2000,
    salePrice: 1500,
    category: 'streetwear',
    colors: [
      { name: 'Jet Black', hex: '#111111' },
      { name: 'Navy Blue', hex: '#1B2A4A' },
      { name: 'Optical White', hex: '#FFFFFF' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: '220 GSM Combed Cotton',
    featured: true,
    inStock: true
  }
];

export const generateInitialInventory = () => {
  const colors = [
    { name: 'Jet Black', hex: '#111111' },
    { name: 'Optical White', hex: '#FFFFFF' },
    { name: 'Heather Grey', hex: '#9E9E9E' },
    { name: 'Navy Blue', hex: '#1B2A4A' },
    { name: 'Forest Green', hex: '#2D5A27' },
    { name: 'Crimson Red', hex: '#991B1B' }
  ];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const inventory = [];

  colors.forEach(col => {
    sizes.forEach(sz => {
      inventory.push({
        sku: `TSHIRT-${col.name.toUpperCase().replace(/\s+/g, '')}-${sz}`,
        color: col.name,
        colorHex: col.hex,
        size: sz,
        currentStock: 40,
        lowStockThreshold: 10
      });
    });
  });

  return inventory;
};
