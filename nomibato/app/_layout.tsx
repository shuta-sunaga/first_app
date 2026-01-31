import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GameProvider } from '../src/contexts/GameContext';
import { SettingsProvider, useSettings } from '../src/contexts/SettingsContext';
import { PurchaseProvider } from '../src/contexts/PurchaseContext';
import { AgeGateModal } from '../src/components/AgeGateModal';
import { DisclaimerModal } from '../src/components/DisclaimerModal';
import { COLORS } from '../src/constants/theme';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isLoading } = useSettings();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(async () => {
        await SplashScreen.hideAsync();
        setSplashDone(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading || !splashDone) {
    return (
      <View style={{ flex: 1, backgroundColor: '#2a1810' }} />
    );
  }

  return (
    <>
      <AgeGateModal />
      <DisclaimerModal />
      <PurchaseProvider>
      <GameProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.background },
            headerTintColor: COLORS.text,
            headerTitleStyle: { fontWeight: 'bold' },
            headerBackTitle: '戻る',
            contentStyle: { backgroundColor: COLORS.background },
          }}
        />
      </GameProvider>
      </PurchaseProvider>
    </>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
