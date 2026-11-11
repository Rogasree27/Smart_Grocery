import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Product,
  Shop,
  PriceEntry,
  CartItem,
  ProductPriceComparison,
  ShopPriceInfo,
  BasketAnalysis,
  SingleShopBasketTotal,
} from '../types/grocery';
import { INITIAL_PRODUCTS, INITIAL_SHOPS, INITIAL_PRICES } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'smart_grocery_products_v1',
  SHOPS: 'smart_grocery_shops_v1',
  PRICES: 'smart_grocery_prices_v1',
  CART: 'smart_grocery_cart_v1',
};

interface GroceryContextType {
  products: Product[];
  shops: Shop[];
  prices: PriceEntry[];
  cart: CartItem[];
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // Shop actions
  addShop: (shop: Omit<Shop, 'id' | 'createdAt'>) => Shop;
  updateShop: (id: string, shop: Partial<Shop>) => void;
  deleteShop: (id: string) => void;
  // Price actions
  setPrice: (productId: string, shopId: string, price: number, inStock?: boolean) => void;
  deletePrice: (id: string) => void;
  // Cart actions
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  // Comparisons & Calculations
  getProductPriceComparison: (productId: string) => ProductPriceComparison | null;
  allComparisons: ProductPriceComparison[];
  basketAnalysis: BasketAnalysis;
  stats: {
    totalProducts: number;
    totalShops: number;
    totalPriceEntries: number;
    totalCatalogueSavings: number;
    averageSavingsPercent: number;
    cheapestDealsCount: number;
  };
  resetToDefaultData: () => void;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export const GroceryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  // Load shops
  const [shops, setShops] = useState<Shop[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHOPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_SHOPS;
  });

  // Load prices
  const [prices, setPrices] = useState<PriceEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PRICES;
  });

  // Load cart (initial cart has 3 items so the user immediately sees the savings calculation on launch)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      { productId: 'prod-rice-1', quantity: 2 },
      { productId: 'prod-oil-3', quantity: 1 },
      { productId: 'prod-milk-5', quantity: 2 },
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops));
    } catch (e) {
      console.error('Failed to save shops', e);
    }
  }, [shops]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRICES, JSON.stringify(prices));
    } catch (e) {
      console.error('Failed to save prices', e);
    }
  }, [prices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  // Product actions
  const addProduct = (data: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // clean up prices for this product
    setPrices((prev) => prev.filter((pr) => pr.productId !== id));
    // clean up cart
    setCart((prev) => prev.filter((c) => c.productId !== id));
  };

  // Shop actions
  const addShop = (data: Omit<Shop, 'id' | 'createdAt'>): Shop => {
    const newShop: Shop = {
      ...data,
      id: `shop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setShops((prev) => [...prev, newShop]);
    return newShop;
  };

  const updateShop = (id: string, updates: Partial<Shop>) => {
    setShops((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteShop = (id: string) => {
    setShops((prev) => prev.filter((s) => s.id !== id));
    // clean up prices
    setPrices((prev) => prev.filter((pr) => pr.shopId !== id));
  };

  // Price actions
  const setPrice = (productId: string, shopId: string, price: number, inStock = true) => {
    setPrices((prev) => {
      const existingIndex = prev.findIndex((p) => p.productId === productId && p.shopId === shopId);
      const timestamp = new Date().toISOString();
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          price: Number(price),
          inStock,
          lastUpdated: timestamp,
        };
        return updated;
      } else {
        const newEntry: PriceEntry = {
          id: `price-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          productId,
          shopId,
          price: Number(price),
          inStock,
          lastUpdated: timestamp,
        };
        return [...prev, newEntry];
      }
    });
  };

  const deletePrice = (id: string) => {
    setPrices((prev) => prev.filter((p) => p.id !== id));
  };

  // Cart actions
  const addToCart = (productId: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Comparison logic for a single product
  const getProductPriceComparison = (productId: string): ProductPriceComparison | null => {
    const product = products.find((p) => p.id === productId);
    if (!product) return null;

    const productPrices = prices.filter((p) => p.productId === productId);
    if (productPrices.length === 0) {
      return {
        product,
        shopPrices: [],
        lowestPrice: 0,
        highestPrice: 0,
        averagePrice: 0,
        maxSavings: 0,
        maxSavingsPercentage: 0,
        cheapestShop: null,
        priciestShop: null,
      };
    }

    const validPrices = productPrices.map((pr) => pr.price);
    const lowestPrice = Math.min(...validPrices);
    const highestPrice = Math.max(...validPrices);
    const averagePrice = Math.round(validPrices.reduce((a, b) => a + b, 0) / validPrices.length);
    const maxSavings = highestPrice - lowestPrice;
    const maxSavingsPercentage = highestPrice > 0 ? Math.round((maxSavings / highestPrice) * 100) : 0;

    const shopPrices: ShopPriceInfo[] = productPrices
      .map((entry) => {
        const shop = shops.find((s) => s.id === entry.shopId);
        if (!shop) return null;
        const isLowest = entry.price === lowestPrice;
        const priceDiffFromLowest = entry.price - lowestPrice;
        const priceDiffPercentage =
          lowestPrice > 0 ? Math.round((priceDiffFromLowest / lowestPrice) * 100) : 0;
        return {
          shop,
          price: entry.price,
          inStock: entry.inStock,
          lastUpdated: entry.lastUpdated,
          isLowest,
          priceDiffFromLowest,
          priceDiffPercentage,
        };
      })
      .filter((item): item is ShopPriceInfo => item !== null)
      .sort((a, b) => a.price - b.price); // Sorted lowest to highest

    const cheapestShop = shopPrices.length > 0 ? shopPrices[0].shop : null;
    const priciestShop = shopPrices.length > 0 ? shopPrices[shopPrices.length - 1].shop : null;

    return {
      product,
      shopPrices,
      lowestPrice,
      highestPrice,
      averagePrice,
      maxSavings,
      maxSavingsPercentage,
      cheapestShop,
      priciestShop,
    };
  };

  // Comparisons for all products
  const allComparisons = useMemo(() => {
    return products
      .map((p) => getProductPriceComparison(p.id))
      .filter((comp): comp is ProductPriceComparison => comp !== null);
  }, [products, shops, prices]);

  // Overall catalogue stats
  const stats = useMemo(() => {
    let totalSavingsSum = 0;
    let savingsCount = 0;
    let dealsCount = 0;

    allComparisons.forEach((comp) => {
      if (comp.maxSavings > 0) {
        totalSavingsSum += comp.maxSavings;
        savingsCount++;
        dealsCount++;
      }
    });

    const averageSavingsPercent =
      savingsCount > 0
        ? Math.round(
            allComparisons.reduce((acc, c) => acc + c.maxSavingsPercentage, 0) / allComparisons.length
          )
        : 0;

    return {
      totalProducts: products.length,
      totalShops: shops.length,
      totalPriceEntries: prices.length,
      totalCatalogueSavings: totalSavingsSum,
      averageSavingsPercent,
      cheapestDealsCount: dealsCount,
    };
  }, [products, shops, prices, allComparisons]);

  // Basket analysis for Module 3 (Shopping List)
  const basketAnalysis: BasketAnalysis = useMemo(() => {
    const totalItems = cart.length;
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (cart.length === 0) {
      return {
        totalItems: 0,
        totalQuantity: 0,
        splitOptimalCost: 0,
        highestSingleShopCost: 0,
        cheapestSingleShop: null,
        singleShopComparisons: [],
        maxPotentialSavings: 0,
        singleShopSavings: 0,
      };
    }

    // 1. Calculate Split Optimal (buying each item at its absolute cheapest shop)
    let splitOptimalCost = 0;
    cart.forEach((item) => {
      const comp = getProductPriceComparison(item.productId);
      if (comp && comp.lowestPrice > 0) {
        splitOptimalCost += comp.lowestPrice * item.quantity;
      }
    });

    // 2. Calculate Basket Cost for each shop
    const singleShopComparisons: SingleShopBasketTotal[] = shops.map((shop) => {
      let totalCost = 0;
      let itemCount = 0;
      let missingItemsCount = 0;

      cart.forEach((item) => {
        const priceEntry = prices.find(
          (p) => p.productId === item.productId && p.shopId === shop.id && p.inStock
        );
        if (priceEntry) {
          totalCost += priceEntry.price * item.quantity;
          itemCount++;
        } else {
          // If shop doesn't carry it, estimate with product average or mark missing
          const comp = getProductPriceComparison(item.productId);
          totalCost += (comp?.averagePrice || 0) * item.quantity;
          missingItemsCount++;
        }
      });

      return {
        shop,
        totalCost,
        itemCount,
        missingItemsCount,
        isCheapest: false,
        savingsVsHighest: 0,
      };
    });

    // Sort single shop by total cost ascending
    singleShopComparisons.sort((a, b) => a.totalCost - b.totalCost);

    const highestSingleShopCost =
      singleShopComparisons.length > 0
        ? Math.max(...singleShopComparisons.map((s) => s.totalCost))
        : 0;

    const lowestSingleShopCost =
      singleShopComparisons.length > 0 ? singleShopComparisons[0].totalCost : 0;

    // Mark cheapest and compute savings vs highest
    singleShopComparisons.forEach((s) => {
      s.isCheapest = s.totalCost === lowestSingleShopCost;
      s.savingsVsHighest = highestSingleShopCost - s.totalCost;
    });

    const cheapestSingleShop = singleShopComparisons.length > 0 ? singleShopComparisons[0] : null;
    const maxPotentialSavings = Math.max(0, highestSingleShopCost - splitOptimalCost);
    const singleShopSavings = Math.max(0, highestSingleShopCost - lowestSingleShopCost);

    return {
      totalItems,
      totalQuantity,
      splitOptimalCost,
      highestSingleShopCost,
      cheapestSingleShop,
      singleShopComparisons,
      maxPotentialSavings,
      singleShopSavings,
    };
  }, [cart, shops, prices, products]);

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setShops(INITIAL_SHOPS);
    setPrices(INITIAL_PRICES);
    setCart([
      { productId: 'prod-rice-1', quantity: 2 },
      { productId: 'prod-oil-3', quantity: 1 },
      { productId: 'prod-milk-5', quantity: 2 },
    ]);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.SHOPS);
    localStorage.removeItem(STORAGE_KEYS.PRICES);
    localStorage.removeItem(STORAGE_KEYS.CART);
  };

  return (
    <GroceryContext.Provider
      value={{
        products,
        shops,
        prices,
        cart,
        addProduct,
        updateProduct,
        deleteProduct,
        addShop,
        updateShop,
        deleteShop,
        setPrice,
        deletePrice,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getProductPriceComparison,
        allComparisons,
        basketAnalysis,
        stats,
        resetToDefaultData,
      }}
    >
      {children}
    </GroceryContext.Provider>
  );
};

export const useGrocery = () => {
  const context = useContext(GroceryContext);
  if (!context) {
    throw new Error('useGrocery must be used within a GroceryProvider');
  }
  return context;
};
