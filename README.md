# 花牌 こいこい（Hanafuda Koi-Koi）

日本花牌（花札）こいこい玩法的網頁遊戲。與三種等級的 AI 對戰，內建規則教學與出牌提示，支援 RWD 與 PWA，可安裝到手機離線遊玩。

> 🎴 線上遊玩：<https://USERNAME.github.io/hanafuda-koikoi/>（上線後更新）

## 特色

- **こいこい標準規則**：局數可選 3／6／12 月，花見酒・月見酒可開關
- **三級 AI**：初級（基本配對）、中級（役型意識啟發式）、高級（算牌機率＋阻擋＋こいこい風險期望值）
- **出牌提示**：選牌時高亮可配對場札、役型進度面板顯示各役還缺哪些牌
- **規則教學**：教學頁（牌組一覽、役型表、流程說明）＋遊戲內點牌看詳情、役型速查表
- **雙卡面風格**：傳統花札風／現代簡化風即時切換
- **對戰紀錄**：勝率、役達成統計（localStorage 保存，架構預留雲端同步）
- **PWA 離線遊玩**：安裝後無網路也能玩
- **繁體中文介面**：役名、牌名保留日文漢字並附中文說明

## 開發

```bash
npm install        # 安裝依賴
npm run dev        # 開發伺服器
npm test           # 執行測試（vitest）
npm run build      # 型別檢查＋建置
npm run preview    # 預覽 production build
npm run simulate   # CLI 模擬器（AI 對戰 soak test）
```

## 架構

- `src/core/` — 純遊戲邏輯（牌組、狀態機、役判定、計分），零 DOM 依賴
- `src/ai/` — AI 策略（可插拔 `AIStrategy` 介面）
- `src/art/` — SVG 卡面（雙風格 sprite）
- `src/ui/` — 畫面與元件（無框架，直接 DOM）
- `src/storage/` — 儲存抽象層（`StorageProvider`，現為 localStorage）

詳見 [docs/spec.md](docs/spec.md)。

## 部署

Push 到 `main` 後由 GitHub Actions 自動測試、建置並部署到 GitHub Pages。

## 版本

採 [Semantic Versioning](https://semver.org/lang/zh-TW/)，變更紀錄見 [CHANGELOG.md](CHANGELOG.md)。

## License

MIT
