import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useState } from 'react';
import { usePurchase } from '../contexts/PurchaseContext';

let BannerAd: any = null;
let BannerAdSize: any = null;
let AD_UNIT_IDS: any = null;

try {
  const ads = require('react-native-google-mobile-ads');
  BannerAd = ads.BannerAd;
  BannerAdSize = ads.BannerAdSize;
  AD_UNIT_IDS = require('../utils/ads').AD_UNIT_IDS;
} catch {
  // AdMob not available (e.g. Expo Go)
}

export function BannerAdView() {
  const { isPremium } = usePurchase();
  const [adError, setAdError] = useState<string | null>(null);

  if (isPremium) {
    return null;
  }

  if (!BannerAd) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Ad Space</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={AD_UNIT_IDS.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={(error: any) => {
          setAdError(error?.message || 'Ad failed to load');
        }}
      />
      {__DEV__ && adError && (
        <Text style={styles.errorText}>Ad Error: {adError}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  placeholder: {
    height: 50,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  placeholderText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 11,
    marginTop: SPACING.xs,
  },
});
