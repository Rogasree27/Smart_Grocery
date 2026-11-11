export type ShopType = 'local' | 'supermarket' | 'online';

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string; // e.g. "1 kg", "1 L", "500 g", "Pack of 6"
  image: string;
  description: string;
  createdAt: string;
}

export interface Shop {
  id: string;
  name: string;
  type: ShopType;
  location: string;
  contactPhone?: string;
  websiteOrApp?: string;
  rating?: number;
  deliveryTime?: string;
  createdAt: string;
}

export interface PriceEntry {
  id: string;
  productId: string;
  shopId: string;
  price: number; // in INR (₹)
  inStock: boolean;
  lastUpdated: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ShopPriceInfo {
  shop: Shop;
  price: number;
  inStock: boolean;
  lastUpdated: string;
  isLowest: boolean;
  priceDiffFromLowest: number;
  priceDiffPercentage: number;
}

export interface ProductPriceComparison {
  product: Product;
  shopPrices: ShopPriceInfo[];
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  maxSavings: number;
  maxSavingsPercentage: number;
  cheapestShop: Shop | null;
  priciestShop: Shop | null;
}

export interface SingleShopBasketTotal {
  shop: Shop;
  totalCost: number;
  itemCount: number;
  missingItemsCount: number;
  isCheapest: boolean;
  savingsVsHighest: number;
}

export interface BasketAnalysis {
  totalItems: number;
  totalQuantity: number;
  splitOptimalCost: number;
  highestSingleShopCost: number;
  cheapestSingleShop: SingleShopBasketTotal | null;
  singleShopComparisons: SingleShopBasketTotal[];
  maxPotentialSavings: number; // Split optimal vs worst single shop
  singleShopSavings: number; // Best single shop vs worst single shop
}
