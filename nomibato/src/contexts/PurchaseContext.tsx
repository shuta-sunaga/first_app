import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREMIUM_KEY = '@nomibato_premium';

let iapModule: any = null;
try {
  iapModule = require('react-native-iap');
} catch {
  // react-native-iap not available
}

const PRODUCT_IDS = [
  'nomibato_premium_monthly',
  'nomibato_premium_yearly',
];

interface PurchaseContextValue {
  isPremium: boolean;
  products: any[];
  purchase: (productId: string) => Promise<void>;
  restore: () => Promise<void>;
  loading: boolean;
}

const PurchaseContext = createContext<PurchaseContextValue>({
  isPremium: false,
  products: [],
  purchase: async () => {},
  restore: async () => {},
  loading: false,
});

export function PurchaseProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const purchaseListenerRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      // Check cached premium status
      const cached = await AsyncStorage.getItem(PREMIUM_KEY);
      if (cached === 'true') {
        setIsPremium(true);
      }

      if (!iapModule) return;

      try {
        await iapModule.initConnection();
        const subs = await iapModule.getSubscriptions({ skus: PRODUCT_IDS });
        setProducts(subs);
      } catch {
        // IAP init failed
      }

      // Listen for purchases
      purchaseListenerRef.current = iapModule.purchaseUpdatedListener?.(
        async (purchase: any) => {
          try {
            if (purchase.transactionReceipt) {
              setIsPremium(true);
              await AsyncStorage.setItem(PREMIUM_KEY, 'true');
              await iapModule.finishTransaction({ purchase, isConsumable: false });
            }
          } catch {
            // finish transaction failed
          }
        },
      );
    })();

    return () => {
      purchaseListenerRef.current?.remove?.();
      iapModule?.endConnection?.();
    };
  }, []);

  const purchase = useCallback(async (productId: string) => {
    if (!iapModule) return;
    setLoading(true);
    try {
      await iapModule.requestSubscription({ sku: productId });
    } finally {
      setLoading(false);
    }
  }, []);

  const restore = useCallback(async () => {
    if (!iapModule) return;
    setLoading(true);
    try {
      const purchases = await iapModule.getAvailablePurchases();
      const hasActive = purchases.some((p: any) =>
        PRODUCT_IDS.includes(p.productId),
      );
      if (hasActive) {
        setIsPremium(true);
        await AsyncStorage.setItem(PREMIUM_KEY, 'true');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PurchaseContext.Provider value={{ isPremium, products, purchase, restore, loading }}>
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  return useContext(PurchaseContext);
}
