# Changelog

本檔案格式依 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)，版本號依 [Semantic Versioning](https://semver.org/lang/zh-TW/)。

## [Unreleased]

## [0.2.0] - 2026-08-30

### Added

- 核心遊戲邏輯：48 張牌資料表、役型判定（含變體開關）、計分、純 reducer 狀態機（手四／くっつき／場札重發／こいこい／親輪替）
- AI 初級（貪心配對）與中級（役型意識啟發式＋防守）
- 可玩 UI：主選單（局數／AI 等級／變體）、對戰盤面（現代簡化風卡面）、配對選擇／こいこい／結算對話框
- 出牌配對高亮提示（基本版）
- CLI 模擬器（soak test）

## [0.1.0] - 2026-08-30

### Added

- 專案 scaffold：Vite + TypeScript（strict）+ vitest + vite-plugin-pwa
- GitHub Actions CI（測試＋建置＋Pages 部署流程）
- README、CHANGELOG、設計文件（docs/spec.md）初版
