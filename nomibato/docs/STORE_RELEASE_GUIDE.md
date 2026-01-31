# ノミバト 本番リリースガイド

## 1. Apple App Store（iOS）

### 1-1. App Store Connectでサブスクリプション商品を作成

1. [App Store Connect](https://appstoreconnect.apple.com/) にログイン
2. 「マイApp」→「ノミバト」→「サブスクリプション」タブ
3. 「サブスクリプショングループ」を作成
   - グループ名: `ノミバトプレミアム`
4. 商品を2つ作成:

| 項目 | 月額プラン | 年額プラン |
|------|-----------|-----------|
| Product ID | `nomibato_premium_monthly` | `nomibato_premium_yearly` |
| 参照名 | プレミアム月額 | プレミアム年額 |
| 期間 | 1ヶ月 | 1年 |
| 価格 | ¥200 (Tier 1) | ¥1,500 (Tier 8) |
| 説明 | すべての広告が非表示になります | すべての広告が非表示になります（年間37%お得） |

5. 「審査用情報」にスクリーンショットを添付
6. ステータスが「提出準備完了」になるまで待つ

### 1-2. EAS Submit設定

1. App Store Connect → 「ユーザーとアクセス」→「統合」→「App Store Connect API」
2. APIキーを生成（Admin権限）
3. 以下を実行:
```bash
eas credentials
# → iOS → production → App Store Connect API Key を設定
```

4. `eas.json` の `ascAppId` を実際のApp IDに更新

### 1-3. 審査提出チェックリスト

- [x] 「購入を復元」ボタン（premium画面 + settings画面）
- [x] サブスクリプションの自動更新説明
- [x] 価格・期間の明記
- [ ] プライバシーポリシーURL設定
- [ ] App Review用のデモ手順記載

---

## 2. Google Play Store（Android）

### 2-1. Google Play Consoleでサブスクリプション商品を作成

1. [Google Play Console](https://play.google.com/console/) にログイン
2. 「ノミバト」→「収益化」→「サブスクリプション」
3. 商品を2つ作成:

| 項目 | 月額プラン | 年額プラン |
|------|-----------|-----------|
| Product ID | `nomibato_premium_monthly` | `nomibato_premium_yearly` |
| 名前 | プレミアム月額 | プレミアム年額 |
| 請求対象期間 | 1ヶ月 | 1年 |
| 基本プラン価格 | ¥200 | ¥1,500 |
| 説明 | すべての広告が非表示になります | すべての広告が非表示になります |

4. 各商品で「基本プラン」を作成し、価格を設定
5. 有効化する

### 2-2. EAS Submit設定

1. Google Cloud Console → サービスアカウント作成
2. Google Play Console → 「設定」→「APIアクセス」→ サービスアカウントをリンク
3. サービスアカウントのJSONキーを `nomibato/google-service-account.json` に保存
4. `.gitignore` に `google-service-account.json` を追加済みであることを確認

---

## 3. ビルド & 提出コマンド

```bash
# iOS本番ビルド
eas build --platform ios --profile production

# Android本番ビルド
eas build --platform android --profile production

# 両プラットフォーム同時
eas build --platform all --profile production

# ストアに提出
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

---

## 4. サンドボックステスト

### iOS
1. App Store Connect →「ユーザーとアクセス」→「Sandbox」→ テスターを追加
2. iPhoneの「設定」→「App Store」→「サンドボックスアカウント」にログイン
3. アプリ内で購入テスト（実際に課金されない）

### Android
1. Google Play Console →「設定」→「ライセンステスト」にテスターのGmailを追加
2. 内部テストトラックにAPKをアップロード
3. テスターとしてインストールして購入テスト

---

## 5. リリース後の確認

- [ ] 月額プランの購入が正常に完了する
- [ ] 年額プランの購入が正常に完了する
- [ ] 購入後に全広告が非表示になる
- [ ] アプリ再起動後もプレミアム状態が維持される
- [ ] 「購入を復元」が正常に動作する
- [ ] サブスク解約後、期間終了時に広告が再表示される
