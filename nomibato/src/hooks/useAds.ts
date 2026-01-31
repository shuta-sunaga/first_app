import { useCallback, useEffect, useRef } from 'react';
import { AD_UNIT_IDS, shouldShowInterstitial } from '../utils/ads';
import { usePurchase } from '../contexts/PurchaseContext';

let InterstitialAd: any = null;
let AdEventType: any = null;
let adsAvailable = false;

try {
  const ads = require('react-native-google-mobile-ads');
  InterstitialAd = ads.InterstitialAd;
  AdEventType = ads.AdEventType;
  adsAvailable = true;
} catch {
  // AdMob not available (e.g. Expo Go)
}

export function useInterstitialAd() {
  const { isPremium } = usePurchase();
  const adRef = useRef<any>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!adsAvailable || !InterstitialAd || !AD_UNIT_IDS.interstitial) return;

    const ad = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      loadedRef.current = true;
    });

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      loadedRef.current = false;
      ad.load();
    });

    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      loadedRef.current = false;
    });

    adRef.current = ad;
    ad.load();

    return () => {
      unsubLoaded();
      unsubClosed();
      unsubError();
    };
  }, []);

  const showIfReady = useCallback(() => {
    if (isPremium) return;
    if (!adsAvailable || !shouldShowInterstitial()) return;
    if (loadedRef.current && adRef.current) {
      adRef.current.show();
    }
  }, []);

  return { showIfReady };
}
