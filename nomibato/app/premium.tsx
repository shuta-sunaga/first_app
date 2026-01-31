import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import { usePurchase } from '../src/contexts/PurchaseContext';

export default function PremiumScreen() {
  const { isPremium, products, purchase, restore, loading } = usePurchase();
  const router = useRouter();

  const monthlyProduct = products.find((p: any) => p.productId === 'nomibato_premium_monthly');
  const yearlyProduct = products.find((p: any) => p.productId === 'nomibato_premium_yearly');

  const handlePurchase = async (productId: string) => {
    try {
      await purchase(productId);
    } catch {
      Alert.alert('エラー', '購入処理に失敗しました。もう一度お試しください。');
    }
  };

  const handleRestore = async () => {
    try {
      await restore();
      Alert.alert('復元完了', '購入情報を復元しました。');
    } catch {
      Alert.alert('エラー', '復元に失敗しました。');
    }
  };

  if (isPremium) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'プレミアムプラン' }} />
        <View style={styles.successCard}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>プレミアム会員</Text>
          <Text style={styles.successDescription}>すべての広告が非表示になっています</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'プレミアムプラン' }} />

      <View style={styles.header}>
        <Text style={styles.title}>広告を非表示にする</Text>
        <Text style={styles.subtitle}>
          プレミアムプランに加入すると{'\n'}すべての広告が非表示になります
        </Text>
      </View>

      <View style={styles.plansContainer}>
        <TouchableOpacity
          style={styles.planCard}
          onPress={() => handlePurchase('nomibato_premium_monthly')}
          disabled={loading}
        >
          <Text style={styles.planName}>月額プラン</Text>
          <Text style={styles.planPrice}>
            {monthlyProduct?.localizedPrice || '¥200'}
          </Text>
          <Text style={styles.planPeriod}>/月</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.planCard, styles.planCardRecommended]}
          onPress={() => handlePurchase('nomibato_premium_yearly')}
          disabled={loading}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>おすすめ</Text>
          </View>
          <Text style={styles.planName}>年額プラン</Text>
          <Text style={styles.planPrice}>
            {yearlyProduct?.localizedPrice || '¥1,500'}
          </Text>
          <Text style={styles.planPeriod}>/年</Text>
          <Text style={styles.planSaving}>月額換算 ¥125（37%お得）</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SPACING.md }} />
      )}

      <TouchableOpacity style={styles.restoreButton} onPress={handleRestore} disabled={loading}>
        <Text style={styles.restoreText}>購入を復元</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          • サブスクリプションは自動更新されます{'\n'}
          • いつでもApp Store / Google Playの設定からキャンセルできます{'\n'}
          • 現在の期間終了の24時間前までにキャンセルしない場合、自動更新されます
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  plansContainer: {
    gap: SPACING.md,
  },
  planCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardRecommended: {
    borderColor: COLORS.primary,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  planName: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  planPeriod: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  planSaving: {
    fontSize: 13,
    color: COLORS.accent,
    marginTop: SPACING.sm,
    fontWeight: '600',
  },
  restoreButton: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    padding: SPACING.md,
  },
  restoreText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
  successCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  successIcon: {
    fontSize: 48,
    color: COLORS.success,
    marginBottom: SPACING.md,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  successDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  footer: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
});
