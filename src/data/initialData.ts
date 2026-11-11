import { Product, Shop, PriceEntry } from '../types/grocery';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-rice-1',
    name: 'Basmati Rice',
    category: 'Grains & Staples',
    unit: '1 kg',
    image: '/src/assets/images/grocery_rice_bowl_1794307339759.jpg',
    description: 'Aromatic long-grain premium Basmati rice, aged for fluffy texture and rich aroma.',
    createdAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'prod-sugar-2',
    name: 'Refined Sugar',
    category: 'Pantry & Essentials',
    unit: '1 kg',
    image: '/src/assets/images/grocery_white_sugar_1794307358676.jpg',
    description: 'Sparkling white, sulphur-free pure cane sugar crystals for daily tea, coffee & sweets.',
    createdAt: '2026-03-01T08:15:00Z',
  },
  {
    id: 'prod-oil-3',
    name: 'Cooking Sunflower Oil',
    category: 'Oils & Ghee',
    unit: '1 L',
    image: '/src/assets/images/grocery_cooking_oil_1794307340280.jpg',
    description: 'Light, healthy cold-pressed refined sunflower oil enriched with Vitamins A & D.',
    createdAt: '2026-03-01T08:30:00Z',
  },
  {
    id: 'prod-dal-4',
    name: 'Toor Dal (Pigeon Pea)',
    category: 'Pulses & Lentils',
    unit: '1 kg',
    image: '/src/assets/images/grocery_toor_dal_1794307341324.jpg',
    description: 'Unpolished premium yellow toor dal, rich in plant protein and ideal for daily sambar and dal fry.',
    createdAt: '2026-03-01T08:45:00Z',
  },
  {
    id: 'prod-milk-5',
    name: 'Fresh Cow Milk',
    category: 'Dairy & Eggs',
    unit: '1 L',
    image: '/src/assets/images/grocery_fresh_milk_1794307359905.jpg',
    description: 'Farm-fresh pasteurized homogenized standardized milk, rich in calcium and natural fats.',
    createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'prod-wheat-6',
    name: 'Chakki Whole Wheat Flour',
    category: 'Grains & Staples',
    unit: '1 kg',
    image: '/src/assets/images/grocery_wheat_flour_1794307342884.jpg',
    description: '100% whole wheat chakki atta with natural bran and fibre for extra soft rotis and parathas.',
    createdAt: '2026-03-01T09:15:00Z',
  },
];

export const INITIAL_SHOPS: Shop[] = [
  {
    id: 'shop-local-mart',
    name: 'Local Mart',
    type: 'local',
    location: 'Indiranagar 12th Main, Bengaluru',
    contactPhone: '+91 98450 12345',
    websiteOrApp: 'Near BDA Complex',
    rating: 4.4,
    deliveryTime: 'Walk-in / 30m',
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'shop-fresh-supermarket',
    name: 'Fresh Supermarket',
    type: 'supermarket',
    location: 'Koramangala 4th Block, Bengaluru',
    contactPhone: '+91 98800 67890',
    websiteOrApp: 'www.freshsupermarket.in',
    rating: 4.6,
    deliveryTime: 'Same Day Delivery',
    createdAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'shop-reliance-smart',
    name: 'Reliance Smart',
    type: 'supermarket',
    location: 'HSR Layout Sector 1, Bengaluru',
    contactPhone: '+91 1800 891 0001',
    websiteOrApp: 'www.reliancesmart.in',
    rating: 4.5,
    deliveryTime: 'In-store / Pick-up',
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'shop-online-grocery',
    name: 'Online Grocery Store',
    type: 'online',
    location: 'Pan-City Rapid Dark Stores',
    contactPhone: '+91 1800 200 4567',
    websiteOrApp: 'App / Instant Delivery',
    rating: 4.7,
    deliveryTime: '10 - 15 Mins Delivery',
    createdAt: '2026-02-22T10:00:00Z',
  },
];

// 24 sample price entries (6 products x 4 shops) with realistic Indian Rupee prices (₹)
export const INITIAL_PRICES: PriceEntry[] = [
  // 1. Basmati Rice (1 kg)
  {
    id: 'price-rice-lm',
    productId: 'prod-rice-1',
    shopId: 'shop-local-mart',
    price: 65,
    inStock: true,
    lastUpdated: '2026-03-08T10:00:00Z',
  },
  {
    id: 'price-rice-fs',
    productId: 'prod-rice-1',
    shopId: 'shop-fresh-supermarket',
    price: 60,
    inStock: true,
    lastUpdated: '2026-03-09T14:30:00Z',
  },
  {
    id: 'price-rice-rs',
    productId: 'prod-rice-1',
    shopId: 'shop-reliance-smart',
    price: 54, // Lowest
    inStock: true,
    lastUpdated: '2026-03-10T08:00:00Z',
  },
  {
    id: 'price-rice-og',
    productId: 'prod-rice-1',
    shopId: 'shop-online-grocery',
    price: 68,
    inStock: true,
    lastUpdated: '2026-03-10T09:15:00Z',
  },

  // 2. Refined Sugar (1 kg)
  {
    id: 'price-sugar-lm',
    productId: 'prod-sugar-2',
    shopId: 'shop-local-mart',
    price: 45,
    inStock: true,
    lastUpdated: '2026-03-08T11:00:00Z',
  },
  {
    id: 'price-sugar-fs',
    productId: 'prod-sugar-2',
    shopId: 'shop-fresh-supermarket',
    price: 42, // Lowest
    inStock: true,
    lastUpdated: '2026-03-09T15:00:00Z',
  },
  {
    id: 'price-sugar-rs',
    productId: 'prod-sugar-2',
    shopId: 'shop-reliance-smart',
    price: 44,
    inStock: true,
    lastUpdated: '2026-03-10T08:10:00Z',
  },
  {
    id: 'price-sugar-og',
    productId: 'prod-sugar-2',
    shopId: 'shop-online-grocery',
    price: 48,
    inStock: true,
    lastUpdated: '2026-03-10T09:20:00Z',
  },

  // 3. Cooking Sunflower Oil (1 L)
  {
    id: 'price-oil-lm',
    productId: 'prod-oil-3',
    shopId: 'shop-local-mart',
    price: 148,
    inStock: true,
    lastUpdated: '2026-03-08T11:15:00Z',
  },
  {
    id: 'price-oil-fs',
    productId: 'prod-oil-3',
    shopId: 'shop-fresh-supermarket',
    price: 152,
    inStock: true,
    lastUpdated: '2026-03-09T15:30:00Z',
  },
  {
    id: 'price-oil-rs',
    productId: 'prod-oil-3',
    shopId: 'shop-reliance-smart',
    price: 136, // Lowest
    inStock: true,
    lastUpdated: '2026-03-10T08:20:00Z',
  },
  {
    id: 'price-oil-og',
    productId: 'prod-oil-3',
    shopId: 'shop-online-grocery',
    price: 155,
    inStock: true,
    lastUpdated: '2026-03-10T09:30:00Z',
  },

  // 4. Toor Dal (1 kg)
  {
    id: 'price-dal-lm',
    productId: 'prod-dal-4',
    shopId: 'shop-local-mart',
    price: 165,
    inStock: true,
    lastUpdated: '2026-03-08T12:00:00Z',
  },
  {
    id: 'price-dal-fs',
    productId: 'prod-dal-4',
    shopId: 'shop-fresh-supermarket',
    price: 155, // Lowest
    inStock: true,
    lastUpdated: '2026-03-09T16:00:00Z',
  },
  {
    id: 'price-dal-rs',
    productId: 'prod-dal-4',
    shopId: 'shop-reliance-smart',
    price: 158,
    inStock: true,
    lastUpdated: '2026-03-10T08:25:00Z',
  },
  {
    id: 'price-dal-og',
    productId: 'prod-dal-4',
    shopId: 'shop-online-grocery',
    price: 172,
    inStock: true,
    lastUpdated: '2026-03-10T09:40:00Z',
  },

  // 5. Fresh Cow Milk (1 L)
  {
    id: 'price-milk-lm',
    productId: 'prod-milk-5',
    shopId: 'shop-local-mart',
    price: 32, // Lowest
    inStock: true,
    lastUpdated: '2026-03-10T06:00:00Z',
  },
  {
    id: 'price-milk-fs',
    productId: 'prod-milk-5',
    shopId: 'shop-fresh-supermarket',
    price: 35,
    inStock: true,
    lastUpdated: '2026-03-10T06:30:00Z',
  },
  {
    id: 'price-milk-rs',
    productId: 'prod-milk-5',
    shopId: 'shop-reliance-smart',
    price: 34,
    inStock: true,
    lastUpdated: '2026-03-10T07:00:00Z',
  },
  {
    id: 'price-milk-og',
    productId: 'prod-milk-5',
    shopId: 'shop-online-grocery',
    price: 36,
    inStock: true,
    lastUpdated: '2026-03-10T08:00:00Z',
  },

  // 6. Chakki Whole Wheat Flour (1 kg)
  {
    id: 'price-wheat-lm',
    productId: 'prod-wheat-6',
    shopId: 'shop-local-mart',
    price: 48,
    inStock: true,
    lastUpdated: '2026-03-08T12:30:00Z',
  },
  {
    id: 'price-wheat-fs',
    productId: 'prod-wheat-6',
    shopId: 'shop-fresh-supermarket',
    price: 49,
    inStock: true,
    lastUpdated: '2026-03-09T16:30:00Z',
  },
  {
    id: 'price-wheat-rs',
    productId: 'prod-wheat-6',
    shopId: 'shop-reliance-smart',
    price: 43, // Lowest
    inStock: true,
    lastUpdated: '2026-03-10T08:30:00Z',
  },
  {
    id: 'price-wheat-og',
    productId: 'prod-wheat-6',
    shopId: 'shop-online-grocery',
    price: 46,
    inStock: true,
    lastUpdated: '2026-03-10T09:45:00Z',
  },
];

export const CATEGORIES = [
  'All Categories',
  'Grains & Staples',
  'Pantry & Essentials',
  'Oils & Ghee',
  'Pulses & Lentils',
  'Dairy & Eggs',
  'Fruits & Vegetables',
  'Snacks & Beverages',
];
