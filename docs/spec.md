# 花牌 こいこい — 設計規格

本文件記錄實作的規則細節、架構、資料模型、AI 設計與儲存抽象。隨實作演進更新。

## 1. 遊戲規則（こいこい標準規則）

### 1.1 基本流程

- 雙人對戰（玩家 vs AI），使用 48 張花札。
- 一場比賽（match）由 3／6／12 局（月，round）組成，可於開局選擇。
- 每局發牌：雙方手牌 8 張、場札 8 張、牌堆 24 張。
- 每回合：出一張手牌 → 與場札配對（同月）→ 翻牌堆一張 → 與場札配對 → 檢查新成役。
- 配對規則：
  - 場上 **0 張**同月 → 出的牌留在場上
  - **1 張** → 兩張一起吃進
  - **2 張** → 必須擇一吃進
  - **3 張** → 四張全吃
- 成立新役時選擇：**こいこい**（繼續，期望更高分）或 **勝負**（結束本局結算）。
- 手牌出完仍無人勝負 → 流局：無得分，親（莊家）續任。
- 局勝者成為下一局的親。

### 1.2 即勝規則

- **手四（てし）**：發牌後手中有同月 4 張 → 即勝 6 點。
- **くっつき**：發牌後手中為 4 組對子 → 即勝 6 點。
- 雙方同時成立 → 親優先。
- **場札手四**：場上出現同月 4 張 → 重新發牌。

### 1.3 計分

- 依成立役的總點數計分，集中於 `computeRoundScore()`：
  - 總點數 **≥ 7 點 → ×2**（可開關，預設開）
  - **對手曾宣告こいこい → ×2**（可開關，預設開）
  - 兩者可疊加（×4）。
- 手牌出完自動勝負（最後一張成役時無こいこい選項）。

### 1.4 役型表

| 役 | 點數 | 條件 |
|---|---|---|
| 五光 | 10 | 光牌 5 張 |
| 四光 | 8 | 光牌 4 張（不含柳に小野道風） |
| 雨四光 | 7 | 光牌 4 張（含柳） |
| 三光 | 5 | 光牌 3 張（不含柳） |
| 花見酒 | 5 | 桜に幕＋菊に盃（變體可關） |
| 月見酒 | 5 | 芒に月＋菊に盃（變體可關） |
| 猪鹿蝶 | 5 | 萩に猪＋紅葉に鹿＋牡丹に蝶 |
| 赤短 | 5 | 松・梅・桜 的短冊 3 張 |
| 青短 | 5 | 牡丹・菊・紅葉 的短冊 3 張 |
| タネ | 1+ | タネ牌 5 張起，每多 1 張 +1 |
| タン | 1+ | 短冊 5 張起，每多 1 張 +1 |
| カス | 1+ | カス 10 張起，每多 1 張 +1 |

- 光役取最高者（五光 ⊃ 四光／雨四光 ⊃ 三光），不重複計。
- 菊に盃計入タネ；「盃兼カス」變體不採用。
- 赤短／青短同時計入タン張數。

## 2. 架構

```
src/core     純遊戲邏輯（零 DOM）：cards / deck / rng / yaku / scoring / rules / state / engine / view / instantWin
src/ai       AIStrategy 介面＋三級實作＋共用啟發式
src/art      SVG 卡面：primitives / motifs(12月份) / traditional / modern / sprites
src/ui       app 路由、screens（menu/game/rules/history/result）、components、animate、strings
src/storage  StorageProvider 抽象＋localStorage 實作＋紀錄統計
tests        vitest 測試
scripts      simulate.ts CLI 模擬器
```

分層原則：`core` 與 `ai` 不 import 任何 DOM／UI 模組，可於 node 環境測試與模擬。

### 2.1 狀態機

純 reducer：`advance(state, action) → { state, events[] }`。

- Phase：`matchStart → roundDeal → instantWinCheck → (awaitHandCard → [awaitHandMatchChoice] → deckFlip → [awaitDeckMatchChoice] → yakuCheck → [awaitKoiKoi])* → roundEnd → … → matchEnd`
- 內部 phase 由 driver（GameController）自動 `advance`；`await*` phase 等待人類輸入或 AI 決策。
- UI 訂閱 `GameEvent` 流渲染與動畫；透過 `toPlayerView()` 取得隱藏對手手牌的視圖。
- RNG 可 seed（`?seed=` dev 參數），確保可重現與可測試。

### 2.2 資料模型

- `CardId = 0..47`；`CardDef { month, type: 'hikari'|'tane'|'tanzaku'|'kasu', flags, nameJa, nameZh }`，48 張定義表為規則、卡面、文案的單一事實來源。
- 役型為資料表 `YakuDef { basePoints, extraPerCard?, requires?(rules), detect(captured) → { met, points, needed } }`；`needed`（還缺的牌）同時供 UI 進度面板與 AI 啟發式使用。

## 3. AI 設計

介面（全部只透過 `PlayerView`，看不到對手手牌與牌堆 — 不作弊）：

```ts
interface AIStrategy {
  chooseHandCard(view: PlayerView): Promise<CardId>;
  chooseFieldMatch(view: PlayerView, played: CardId, options: CardId[]): Promise<CardId>;
  decideKoiKoi(view: PlayerView, ctx: KoiKoiContext): Promise<boolean>;
}
```

- **初級**：可配對就吃（取最高牌值），否則丟同月夥伴最少的牌；10–20% 隨機擾動；永不こいこい。
- **中級**：對每個（手牌, 場牌）組合打分 = 牌值 + 役型推進差分 − 餵給對手的威脅；こいこい採保守規則式。
- **高級（啟發式期望值）**：
  - 算牌：未見牌 = 全牌 − 己手 − 場札 − 雙方吃牌，`P(夥伴出現) = 未見夥伴/未見總數` 加權役型推進期望值。
  - 阻擋：對手可見役型差 1 張時重罰餵牌、優先搶吃。
  - こいこい決策：估計續玩期望淨得分（含翻倍規則、剩餘回合、對手成役風險）vs 立即結算。
  - 同步計算（<5ms）；介面為 async，日後可加 Web Worker + Monte Carlo 等級。

## 4. 卡面 SVG

- 每風格建一個 sprite（48 個 `<symbol viewBox="0 0 200 320">`）注入一次，卡牌皆為 `<use>`；切換風格即換 href 前綴。
- 傳統風：12 個月份植物 motif ＋ ~15 個特殊物件（鶴、幕、猪鹿蝶、雁、盃、鳳凰…）＋ 48 條圖層組合表。
- 現代風：牌種底色＋月份漢字＋簡化植物 glyph＋牌種徽章，全程式生成。

## 5. 儲存抽象與對戰紀錄

```ts
interface StorageProvider {
  getMatches(): Promise<MatchRecord[]>;
  addMatch(r: MatchRecord): Promise<void>;
  clearMatches(): Promise<void>;
  getSettings(): Promise<StoredSettings | null>;
  saveSettings(s: StoredSettings): Promise<void>;
  getSavedGame(): Promise<SavedGame | null>;
  saveGame(s: SavedGame): Promise<void>;
  clearSavedGame(): Promise<void>;
  clear(): Promise<void>;
}
```

- `MatchRecord v1`：`{ schemaVersion, id, timestamp, aiLevel, totalRounds, finalScores, winner, rounds: [{ winner, yaku[], points, koikoi }] }`
- `SavedGame v1`（進行中對局）：`{ schemaVersion, timestamp, aiLevel, style, state: GameState, roundLog }` — 每個動作後保存，refresh／離開可續玩；終局或開新局時清除。引擎狀態為純 JSON 可序列化物件，直接還原即可繼續。
- 聚合統計（各等級勝率、總場數、單局最高分、役達成次數）由紀錄計算。
- 現行實作 localStorage（key `hkk:records:v1`、`hkk:settings:v1`、`hkk:game:v1`，try/catch 防私密模式）。
- 介面刻意 async：日後以 Firebase 實作同介面即可跨裝置同步，遊戲／UI 層不需改動。

## 6. UI / RWD / PWA

- **版面有界原則**：牌寬 `--card-w` 同時受視窗寬與高約束（手機 `min(15vw, (100dvh−272px)/11)`、平板 `min(5.5vw, …)`、桌面 `min(10.5vw, (100vh−240px)/9.5)`）；場札逾 10 張加 `.field--dense` 固定 8 欄；吃牌區固定高度單列、過寬時內部橫捲（同組逾 8 張加大重疊）；展示槽（打出／待配對）絕對定位於場中央永久保留區。任何牌數變化都不改變版面框架。
- 手機直向（<768px）：縱向排列撐滿視窗，役型面板為 `<details>` 摺疊；平板（768–1023）：吃牌移至手牌側邊；桌面（≥1024）：雙欄格線、役型面板固定右欄自帶捲動。tap target ≥ 44px。
- 提示：點手牌高亮同月場札（`.matchable`）；役型面板顯示進度與缺牌。
- 親／こいこい狀態以狀態列徽章呈現（不覆蓋牌面）。
- **事件重播動畫**：`advance()` 回傳的 `GameEvent[]` 逐一套用到與引擎解耦的 `VisualState`，每步重繪＋停頓（打出聚光燈→吃進→翻牌堆→成役橫幅）。移動補間採 FLIP：長距離（跨區）用 fixed 飛行層複製體（不被 overflow 容器裁切，落地才顯示真牌），同區小補位就地補間；翻牌自山札牌堆錨點飛出、AI 出牌自其手牌中央牌背錨點飛出。停頓節奏屬資訊性，`prefers-reduced-motion` 下仍保留（縮短），僅停用裝飾動畫。
- PWA icons 由 `npx tsx scripts/gen-icons.ts`（sharp）自 SVG 生成。
- PWA：vite-plugin-pwa `autoUpdate` 全資產 precache，無外部資源，完全離線。
- 部署：GitHub Actions → GitHub Pages，`base: '/hanafuda-koikoi/'`。

## 7. 測試策略

- 單元：cards 不變量、yaku 全役型與覆蓋規則、scoring 翻倍疊加、engine 劇本局與分支、instantWin 邊角。
- Property test：隨機全場 ×500 不拋錯、48 張守恆、必然終局。
- AI：合法性（隨機盤面 ×200）、中級阻擋行為、高級 EV sanity、勝率門檻（高級 vs 初級 ≥65%、vs 中級 ≥55%）。
- storage：CRUD、schema 版本、統計正確性。
- Soak：`npm run simulate` 萬場無例外，役頻率合理。

## 8. 版本策略

- semver：0.1.0 scaffold → 每里程碑升 minor → 1.0.0 功能完整上線；release 打 tag `vX.Y.Z` 並更新 CHANGELOG。
- 重大規則變更或存檔 schema 不相容 → major；新功能 → minor；修錯 → patch。
