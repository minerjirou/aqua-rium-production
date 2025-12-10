# Aqua-Rium Production — Astro + Cloudflare Pages + R2

アクアリアムプロダクション（架空）のサイト実装テンプレートです。Astro 5 をベースに、Cloudflare Pages と R2（公開バケット）で運用できます。

主な特徴
- Cloudflare Pages で静的ホスティング（`astro build` → `dist/`）
- 画像は R2 の公開ドメインから配信（`PUBLIC_R2_BASE_URL`）
- メンバー/ニュースは Content Collections（Markdown）で管理
- メンバープロフィール拡張（読み/担当色/キャッチ/自己紹介/詳細情報/YouTube埋め込み 等）
- 世代（◯期生）は `category` で管理、カード/詳細に表示
- タグの中央管理（YAML）と自動統合（ニュース用/メンバー用）
- 画像ギャラリー（モーダル・スワイプ・キーボード操作）
- SEO（OG/Twitter、canonical、JSON‑LD、sitemap、robots.txt）
- ダークモード固定（切替は撤去し、常にダーク）

対応バージョン
- Node.js >= 18.17（推奨 20 以上）

---

セットアップ
1) 依存関係のインストール
- `npm install`

2) 環境変数（.env または Pages の Environment Variables）
```
PUBLIC_R2_BASE_URL=https://<your-public-domain-or-r2.dev>
AGENCY_NAME=アクアリアムプロダクション (Aqua-Rium Production)
SITE=https://<your-production-domain>
```
- 注意: `PUBLIC_R2_BASE_URL` は必ず `https://...` の完全URL（プロトコル必須）
- R2 は「Public access」を有効化し、`…r2.dev` かカスタムドメインを使用

3) 開発/ビルド
- 開発: `npm run dev`
- ビルド: `npm run build`
- プレビュー: `npm run preview`

---

ディレクトリ構成（抜粋）
- `src/content/member/*` … メンバーのMarkdown
- `src/content/news/*` … ニュースのMarkdown
- `src/content/tags.yml` … 中央管理のタグ（news 用 `tags:` / member 用 `memberTags:`）
- `src/pages/*` … ページ（一覧/詳細/タグ/カテゴリ/ページネーション）
- `src/components/*` … UI コンポーネント
- `src/layouts/*` … レイアウト/共通ヘッダ
- `src/utils/r2.ts` … 画像URL生成（相対→R2公開URLへ展開）
- `src/utils/tags.ts` … YAML 読み込みとタグ統合ユーティリティ

---

コンテンツ・スキーマ概要（`src/content/config.ts`）
- member（主要フィールド）
  - `name: string`
  - `avatar: string`（R2キー or `/public` 相対パス、例: `members/luca/Luca_Avatar.png`）
  - `reading?: string`（ふりがな）
  - `color?: string`（担当カラー `#RRGGBB`）
  - `catchphrase?: string`, `greeting?: string`
  - `origin?: string`, `heightCm?: number`, `birthday?: string`, `zodiac?: string`
  - `likes?: string[]`, `dislikes?: string[]`, `features?: string`
  - `xHandle?: string`, `youtubeChannelId?: string`, `youtubeEmbed?: string`
  - `socials: { name: string; url: string }[]`
  - `fanTags: string[]`（活動タグ。表示/ページ生成は中央管理の `memberTags` を許可リストとして使用）
  - `awards: { year: string; title: string }[]`
  - `outfits: { name: string; image: string }[]`
  - `order: number`
  - `category?: string`（◯期生 表示に使用）

- news
  - `title: string`
  - `date: date`
  - `summary?: string`
  - `tags: string[]`
  - `category?: string`

---

タグ管理（中央管理 + 自動統合）
- 中央管理ファイル: `src/content/tags.yml`
```
tags:
  - リリース
  - メンバー
  - イベント
  - コラボ

memberTags:
  - 歌
  - 雑談
  - ゲーム
```
- ニュース一覧/タグページ: YAMLの `tags` と記事 `tags` の和集合を表示・生成
- メンバー一覧/タグページ: YAMLの `memberTags` のみを表示・生成（許可制）。
  - コンテンツの `fanTags` に同名が含まれているメンバーのみ、そのタグページへ出現

---

画像の扱い
- 相対パス（例: `members/luca/Luca_Summer.png`）を Frontmatter に記述
- 実際の `<img src>` は `PUBLIC_R2_BASE_URL` を前置して生成（`src/utils/r2.ts`）
- `PUBLIC_R2_BASE_URL` 未設定のときは `/public` を参照（開発簡便化）
- 画像が存在しない場合は、プレースホルダー（`/images/placeholder-*.svg`）を表示

---

ダークモード
- サイト全体をダークモード固定にしています（`<html class="dark">`）。
- ライト用クラスは残してありますが、実際の表示はダークが優先されます。

---

デプロイ（Cloudflare Pages）
1) プロジェクト作成
- Framework: Astro（自動検出）
- Build command: `npm run build`
- Output directory: `dist`

2) 環境変数（Production / Preview 両方）
- `PUBLIC_R2_BASE_URL=https://<r2.dev または カスタムドメイン>`
- `AGENCY_NAME=アクアリアムプロダクション (Aqua-Rium Production)`
- `SITE=https://<本番ドメイン>`

3) R2 側
- バケットを Public access 有効化
- 公開URL（例: `https://pub-xxxx.r2.dev` または `https://assets.example.com`）を `PUBLIC_R2_BASE_URL` に設定

トラブルシューティング
- 画像が表示されない
  - `PUBLIC_R2_BASE_URL` が `https://` 付きの公開URLか確認
  - S3エンドポイント（`…cloudflarestorage.com`）は認証必須のため使用不可
  - オブジェクトキー（大文字小文字含む）と Frontmatter のパスが完全一致しているか
  - 直リンク `PUBLIC_R2_BASE_URL/...` が 200 で開けるか

スクリプト
- `npm run dev` … 開発サーバー
- `npm run build` … ビルド
- `npm run preview` … ローカルプレビュー
- `npm run gen:og` … 例示的なOG画像生成（必要に応じて）

ライセンス
- 本テンプレートはデモ用途を想定。記載の人物・団体等は架空です。

