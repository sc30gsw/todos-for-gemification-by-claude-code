## コーディング規約
### はじめに
本コーディング規約はNext.jsのドキュメントはもちろん、[Next.jsの考え方](https://zenn.dev/akfm/books/nextjs-basic-principle/viewer/intro)に基づいているため、一読することをお勧めします

### 共通
- routingの機能および、Suspenseを活用し、適切なチャンク化を行うこと
- slotsの概念やComposition Patternを活用し、Client Module Graphを小さくし、Clientに送信されるJSバンドルを小さくすること（RSC内に移せる記述は移し、Server Module Graphを大きくする方針とする）
- 本プロジェクトでは[React Compiler](https://ja.react.dev/learn/react-compiler)を使用しているため、原則、`useMemo`や`useCallback`などのメモ化のhooksは不要とします
- PR前に実装者は`bun run build:clean`を実行し、ビルドが通ることを確認すること

### 命名について
- ファイル名・フォルダ名（dynamic routesを除く）はケバブケースを、変数名や関数名はキャメルケースを使用する

### 関数定義について
- propsなど、個々人の記述に差異がでないよう関数宣言を使用してください（例: export default async function sample() {}）

### コンポーネント・ディレクトリ戦略について
- コンポーネント戦略は[AHA Programming](https://kentcdodds.com/blog/aha-programming)に従い、性急な抽象化は避けた設計を行うこと
- ディレクトリ戦略は[bulletproof-react](https://github.com/alan2207/bulletproof-react)に従い、実装すること
  - ※ 具体的なディレクトリ構成は「ディレクトリ構成」の項に記載

### データフェッチについて
- RequestMemorizationおよび、並列フェッチ・preloadを活用しデータフェッチのウォーターフォールを避けること
- データフェッチはデータフェッチ コロケーションに従い、末端のリーフコンポーネントで行うこと
- fetchには`src/lib/fetcher.ts`にてfetch関数を拡張した関数を使用すること
  - 使用時は、HonoのPRCによる機能を使用し、urlと`InferResponseType`などで型安全なfetchを実現すること

### cacheについて
- React.cacheやNextのcache tagを使用し、適切なcache管理を行うこと
- 原則、fetchにはcache: 'force-cache'を指定したうえで、tag付けを行うこと（SSRの場合はcache: 'no-store'を指定すること）
  - Next.js v15からはfetchの拡張がなくなり、デフォルトがcache: 'no-store'となっているが、本プロジェクトでは明示的にオプションを記載する

### server actionsについて
- Mutationの処理のみに使用してください
  - ※ 絶対にClient Componentでfetchの代替に使用しないでください（左記を実装する場合、[tanstack-query](https://tanstack.com/query/latest)や[SWR](https://swr.vercel.app/ja)などのClient Fetch Libraryの導入を検討してください）

## ディレクトリ構成
ディレクトリ構成は[bulletproof-react](https://github.com/alan2207/bulletproof-react)に従い、以下の構成とします。

```
/frontend
  ├ public : 画像などアセット類
  ├ src
  |  ├ app: ルーティング定義
  |  |  ├ api: Route Handler
  |  |  |  └[[...route]] : optional catch-all segmentsによるAPIルート
  |  |  |     └ route.ts: HonoのAPI Route定義
  |  |  ├ layout.tsx: ルートレイアウト
  |  |  ├ page.tsx : ルートページコンポーネント
  |  |  ├ loading.tsx: ルートローディングUI
  |  |  ├ error.tsx : ルートエラーページ（グローバルエラーページ）
  |  |  ├ not-found.tsx : 404ページ
  |  |  ├ unauthorized.tsx : 401ページ
  |  |  ├ globals.css : グローバルスタイル
  |  |  ├ favicon.ico : ファビコン
  |  |  └ sample-route（サンプルルーティング）※ `sample`の部分には画面ごとに本来のパス名が入る
  |  |     ├ layout.tsx : 当該ルーティングにおける共通レイアウト
  |  |     ├ loading.tsx : 当該ルーティングにおけるローディングUI
  |  |     ├ error.tsx : 当該ルーティングにおけるエラーページ
  |  |     └ page.tsx : 当該ルーティングにおけるページコンポーネント
  |  ├ components : アプリ全体で使われるコンポーネント実装
  |  |  ├ providers: アプリ全体で使われるProvider郡
  |  |  |  ├ nuqs-provider.tsx : nuqsのadapterを提供する
  |  |  |  └ *-provider.tsx : その他、任意のProvider
  |  |  └ shadcn
  |  |     └ ui: shadcn/uiのコンポーネント
  |  |       ├ button.tsx : shadcn/uiのButton
  |  |       ├ input.tsx : shadcn/uiのInput
  |  |       ├ card.tsx : shadcn/uiのCard
  |  |       └ *** : shadcn/uiのコンポーネント
  |  ├ features : 当該ルーティングにおける機能実装
  |  |  ├ users: 機能に関連するディレクトリをまとめる親ディレクトリ（機能に関連した命名を行う）
  |  |  |   ├ actions : server actionsを格納（server actionsは原則1ファイル（モジュール）1関数としてください）
  |  |  |   |  ├ user-search.ts : ユーザー検索を行うserver actions
  |  |  |   |  └ *.ts : 任意のserver actions
  |  |  |   ├ api : API関連の処理を格納
  |  |  |   |  └ route.ts : APIの実装を行うファイル
  |  |  |   ├ components : 当該機能で使用するコンポーネントをまとめるディレクトリ
  |  |  |   |  ├ user-list.ts : ユーザー一覧をfetch・表示するコンポーネント
  |  |  |   |  └ *.ts : 任意のコンポーネント
  |  |  |   ├ hooks : 当該機能で使用するhooksをまとめるディレクトリ
  |  |  |   |  ├ use-user-search.ts : ユーザー検索で使用するhooks
  |  |  |   |  └ *.ts : 任意の定数ファイル
  |  |  |   ├ types : 当該機能で使用する型定義をまとめるディレクトリ
  |  |  |   |  ├ schema : zod schemaをまとめるディレクトリ
  |  |  |   |  |  ├ user-search-schema.ts : user検索で使用するzod schema
  |  |  |   |  |  └ *.ts : 任意のzod schema
  |  |  |   |  ├ search-params : nuqsのsearch paramsの型定義をまとめるディレクトリ
  |  |  |   |  |  ├ user-search-params.ts : user検索で使用するsearch paramsの型定義
  |  |  |   |  |  └ *.ts : 任意のsearch paramsの型定義
  |  |  |   |  ├ user.ts : userに関する型定義
  |  |  |   |  └ *.ts : 任意の型定義ファイル
  |  |  |   └ utils : 当該機能で使用するユーティリティ定義をまとめるディレクトリ
  |  |  └ *: 任意の機能ディレクトリ
  |  ├ hooks : アプリ全体で使われるカスタムフック(use-***.ts)
  |  ├ middleware.ts : [ミドルウェア実装](https://nextjs.org/docs/app/building-your-application/routing/middleware)
  ├  ├ types : アプリ全体で使われる型定義
  ├  |   └ *.ts: 任意の型定義
  ├  ├ constants : アプリ全体で使われる定数
  ├  ├ utils : アプリ全体で使われるユーティリティ実装
  ├  └ lib :アプリ全体で使用されるライブラリの設定定義や共通ヘルパー関数
  ├ tests: E2Eテストコード
  |  ├ screenshots: テストで取得したスクリーンショットを格納（Visual Regression Testing用）
  |  |   └ *.png : 任意の画面または要素のスクリーンショット
  |  └ example.spec.ts : 画面ごとのテストコード
  ├ .env.* : 環境変数定義ファイル
  ├ .env.test : テスト用の環境変数定義ファイル
  ├ biome.json : Linter・Formatterの設定ファイル
  ├ components.json : shadcn/uiの設定ファイル
  ├ next.config.ts : next.jsの設定ファイル
  ├ package.json : パッケージマネージャーの設定ファイル
  ├ playwright.config.ts : Playwrightの設定ファイル
  ├ postcss.config.mjs : postcssの設定ファイル（主にtailwind cssのプラグイン設定を記述）
  └ tsconfig.json : typescriptの設定ファイル
```