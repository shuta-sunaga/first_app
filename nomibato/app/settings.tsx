import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import { useSettings } from '../src/contexts/SettingsContext';
import { usePurchase } from '../src/contexts/PurchaseContext';

export default function SettingsScreen() {
  const { settings, setSoftDrinkMode } = useSettings();
  const { isPremium, restore } = usePurchase();
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: '設定' }} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>プレミアムプラン</Text>
        {isPremium ? (
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>プレミアム会員 ✓</Text>
              <Text style={styles.rowDescription}>すべての広告が非表示です</Text>
            </View>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/premium')}>
              <Text style={styles.linkText}>広告を非表示にする</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.linkRow, { marginTop: 1 }]} onPress={() => restore()}>
              <Text style={[styles.linkText, { color: COLORS.textSecondary }]}>購入を復元</Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>ソフトドリンクモード</Text>
            <Text style={styles.rowDescription}>
              ONにすると罰ゲームからお酒が除外されます
            </Text>
          </View>
          <Switch
            value={settings.softDrinkMode}
            onValueChange={setSoftDrinkMode}
            trackColor={{ false: COLORS.surface, true: COLORS.primary }}
            thumbColor={COLORS.text}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>免責事項</Text>
        <View style={styles.card}>
          <Text style={styles.disclaimer}>
            • このアプリは飲酒を強制するものではありません
          </Text>
          <Text style={styles.disclaimer}>
            • お酒は適量を心がけ、楽しい飲み会にしましょう
          </Text>
          <Text style={styles.disclaimer}>
            • 飲酒運転は法律で禁止されています
          </Text>
          <Text style={styles.disclaimer}>
            • 未成年者の飲酒は法律で禁止されています
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>法的情報</Text>
        <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/privacy')}>
          <Text style={styles.linkText}>プライバシーポリシー</Text>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.linkRow, { marginTop: 1 }]} onPress={() => router.push('/terms')}>
          <Text style={styles.linkText}>利用規約</Text>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.versionText}>ノミバト v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  rowText: {
    flex: 1,
    marginRight: SPACING.md,
  },
  rowTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  rowDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  disclaimer: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.xs,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  linkText: {
    fontSize: 16,
    color: COLORS.text,
  },
  linkArrow: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  versionText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
