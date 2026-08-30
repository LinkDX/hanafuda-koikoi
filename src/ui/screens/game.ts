import { createAI } from '../../ai';
import type { AILevel, AIStrategy } from '../../ai';
import { cardOf, matches } from '../../core/cards';
import type { CardId, CardType } from '../../core/cards';
import { advance, createMatch } from '../../core/engine';
import { createRng } from '../../core/rng';
import type { RuleConfig } from '../../core/rules';
import { computeRoundScore } from '../../core/scoring';
import type { Action, GameEvent, GameState, Player } from '../../core/state';
import { detectYaku } from '../../core/yaku';
import { toPlayerView } from '../../core/view';
import type { CardStyleId } from '../../art/styleTypes';
import type { MatchRecord, MatchRecordRound, StorageProvider } from '../../storage/provider';
import { withFlip } from '../animate';
import { showCardDetail } from '../components/cardDetail';
import { renderCard } from '../components/cardEl';
import { showCheatsheet } from '../components/cheatsheet';
import { button, el, showDialog } from '../components/dialogs';
import type { DialogHandle } from '../components/dialogs';
import { renderYakuPanel } from '../components/yakuPanel';
import { S } from '../strings';

export interface GameConfig {
  rules: RuleConfig;
  aiLevel: AILevel;
  style: CardStyleId;
  storage: StorageProvider;
  seed?: number;
  onExit(): void;
  onPlayAgain(): void;
}

const HUMAN: Player = 0;
const AI_PLAYER: Player = 1;
const AI_DELAY_MS = 550;

/** 動畫重播用的畫面狀態（跟引擎狀態解耦，逐事件推進） */
interface VisualState {
  hands: [CardId[], CardId[]];
  field: CardId[];
  captured: [CardId[], CardId[]];
  deckCount: number;
  /** 剛打出／翻出、尚未落定的牌 */
  spotlight?: { card: CardId; source: 'hand' | 'deck'; player: Player };
}

function visualFromState(state: GameState): VisualState {
  const rs = state.roundState;
  return {
    hands: [[...rs.hands[0]], [...rs.hands[1]]],
    field: [...rs.field],
    captured: [[...rs.captured[0]], [...rs.captured[1]]],
    deckCount: rs.deck.length,
  };
}

const reducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, reducedMotion() ? 0 : ms));

export class GameScreen {
  private state: GameState;
  private readonly ai: AIStrategy;
  private readonly root: HTMLElement;
  private readonly config: GameConfig;
  private selected: CardId | null = null;
  private dialog: DialogHandle | null = null;
  private aiTimer: ReturnType<typeof setTimeout> | null = null;
  private yakuPanelOpen = window.matchMedia('(min-width: 768px)').matches;
  private readonly roundLog: MatchRecordRound[] = [];
  private recorded = false;
  private visual!: VisualState;
  private animating = false;
  private destroyed = false;

  constructor(container: HTMLElement, config: GameConfig) {
    this.config = config;
    const seed = config.seed ?? Math.floor(Math.random() * 2 ** 32);
    this.ai = createAI(config.aiLevel, createRng(seed ^ 0x5f3759df));
    this.root = el('div', 'game');
    container.replaceChildren(this.root);
    this.state = advance(createMatch(config.rules, seed), { type: 'startMatch' }).state;
    this.visual = visualFromState(this.state);
    this.render();
    this.pump();
  }

  destroy(): void {
    this.destroyed = true;
    if (this.aiTimer) clearTimeout(this.aiTimer);
    this.dialog?.close();
  }

  private dispatch(action: Action): void {
    if (this.animating) return;
    const { state, events } = advance(this.state, action);
    this.state = state;
    this.selected = null;
    this.animating = true;
    void this.playEvents(events).then(() => {
      this.animating = false;
      if (this.destroyed) return;
      this.visual = visualFromState(this.state);
      this.render();
      this.pump();
    });
  }

  /** 逐事件重播：讓玩家看得到「打出→配對→翻牌→吃進」的過程 */
  private async playEvents(events: GameEvent[]): Promise<void> {
    for (const e of events) {
      if (this.destroyed) return;
      const v = this.visual;
      switch (e.type) {
        case 'roundDealt':
        case 'redeal':
          this.visual = visualFromState(this.state);
          this.render();
          await wait(350);
          break;
        case 'cardPlayed':
          if (e.source === 'hand') {
            v.hands[e.player] = v.hands[e.player].filter((c) => c !== e.card);
          } else {
            v.deckCount = Math.max(0, v.deckCount - 1);
          }
          v.spotlight = { card: e.card, source: e.source, player: e.player };
          this.render();
          await wait(e.source === 'hand' ? 520 : 620);
          break;
        case 'cardsCaptured':
          v.field = v.field.filter((c) => !e.cards.includes(c));
          delete v.spotlight;
          v.captured[e.player].push(...e.cards);
          this.render();
          await wait(560);
          break;
        case 'cardToField':
          delete v.spotlight;
          if (!v.field.includes(e.card)) v.field.push(e.card);
          this.render();
          await wait(430);
          break;
        case 'matchChoiceRequired':
          delete v.spotlight;
          this.render();
          break;
        case 'yakuFormed':
          await this.banner(`成役！${e.newYaku.map((y) => y.nameJa).join('・')}`, 900);
          break;
        case 'koikoiDeclared':
          await this.banner(e.player === HUMAN ? 'こいこい！' : `AI：こいこい！`, 900);
          break;
        case 'instantWin':
          await this.banner(S.instantWin[e.kind], 900);
          break;
        default:
          break;
      }
    }
  }

  /** 場中央橫幅提示 */
  private async banner(text: string, ms: number): Promise<void> {
    const node = el('div', 'banner', text);
    this.root.appendChild(node);
    await wait(ms);
    node.remove();
  }

  /** 依 phase 決定下一步：AI 行動、對話框、或等待玩家輸入 */
  private pump(): void {
    const s = this.state;
    const rs = s.roundState;
    if (s.phase === 'roundEnd') {
      this.showRoundEnd();
      return;
    }
    if (s.phase === 'matchEnd') {
      this.showMatchEnd();
      return;
    }
    if (s.phase === 'awaitKoiKoi' && rs.turn === HUMAN) {
      this.showKoiKoiDialog();
      return;
    }
    if (rs.turn === AI_PLAYER) {
      this.scheduleAiMove();
    }
  }

  private scheduleAiMove(): void {
    if (this.aiTimer) clearTimeout(this.aiTimer);
    this.aiTimer = setTimeout(() => {
      void this.aiMove();
    }, AI_DELAY_MS);
  }

  private async aiMove(): Promise<void> {
    const s = this.state;
    const rs = s.roundState;
    if (rs.turn !== AI_PLAYER) return;
    const view = toPlayerView(s, AI_PLAYER);
    switch (s.phase) {
      case 'awaitHandCard': {
        const card = await this.ai.chooseHandCard(view);
        this.dispatch({ type: 'playHandCard', card });
        break;
      }
      case 'awaitHandMatchChoice':
      case 'awaitDeckMatchChoice': {
        const pending = rs.pendingCard!;
        const options = rs.field.filter((f) => matches(f, pending));
        const fieldCard = await this.ai.chooseFieldMatch(view, pending, options);
        this.dispatch({ type: 'chooseMatch', fieldCard });
        break;
      }
      case 'awaitKoiKoi': {
        const yaku = detectYaku(rs.captured[AI_PLAYER], s.rules);
        const declare = await this.ai.decideKoiKoi(view, {
          newYaku: s.pendingYaku ?? [],
          currentPoints: yaku.reduce((sum, y) => sum + y.points, 0),
        });
        this.dispatch({ type: 'koikoiDecision', declare });
        break;
      }
      default:
        break;
    }
  }

  // ---------- 渲染 ----------

  private render(): void {
    withFlip(document.body, () => this.renderInner());
  }

  /** 掛上「看牌詳情」手勢（右鍵／長按） */
  private attachDetail(cardEl: HTMLElement, card: CardId): void {
    cardEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showCardDetail(card, this.state.rules, this.config.style);
    });
  }

  private renderInner(): void {
    const s = this.state;
    const rs = s.roundState;
    const v = this.visual;
    const style = this.config.style;

    this.root.replaceChildren();

    // 狀態列
    const status = el('header', 'status');
    status.appendChild(el('span', 'status__round', S.round(s.round, s.rules.totalRounds)));
    const scores = el('span', 'status__scores');
    scores.textContent = `${S.you} ${s.scores[HUMAN]} : ${s.scores[AI_PLAYER]} ${S.ai}（${S.aiLevels[this.config.aiLevel]}）`;
    status.appendChild(scores);
    const statusRight = el('span', 'status__right');
    statusRight.appendChild(el('span', 'status__deck', S.deckCount(v.deckCount)));
    statusRight.appendChild(button('役?', 'btn btn--small', () => showCheatsheet(s.rules, style)));
    status.appendChild(statusRight);
    this.root.appendChild(status);

    // 對手區
    const oppZone = el('section', 'zone zone--opp');
    oppZone.appendChild(this.renderCaptured(v.captured[AI_PLAYER], 'opp'));
    const oppHand = el('div', 'hand hand--opp');
    for (let i = 0; i < v.hands[AI_PLAYER].length; i++) {
      oppHand.appendChild(renderCard(0, style, { faceDown: true }));
    }
    if (rs.oya === AI_PLAYER) oppZone.appendChild(el('span', 'oya-mark', S.oyaMark));
    if (rs.koikoiDeclared[AI_PLAYER] > 0) oppZone.appendChild(el('span', 'koikoi-mark', 'こいこい中'));
    oppZone.appendChild(oppHand);
    this.root.appendChild(oppZone);

    // 場中央
    const table = el('section', 'table');
    if (v.spotlight) {
      const spot = el('div', 'spotlight');
      const who = v.spotlight.source === 'deck'
        ? '翻牌堆'
        : v.spotlight.player === HUMAN ? `${S.you}打出` : 'AI 打出';
      spot.appendChild(el('div', 'spotlight__label', who));
      spot.appendChild(renderCard(v.spotlight.card, style));
      table.appendChild(spot);
    }
    const fieldEl = el('div', 'field');
    const awaitingChoice = !this.animating &&
      (s.phase === 'awaitHandMatchChoice' || s.phase === 'awaitDeckMatchChoice') && rs.turn === HUMAN;
    const choiceOptions = awaitingChoice && rs.pendingCard !== undefined
      ? rs.field.filter((f) => matches(f, rs.pendingCard!))
      : [];
    for (const c of v.field) {
      const cardEl = renderCard(c, style, { interactive: awaitingChoice && choiceOptions.includes(c) });
      if (this.selected !== null && matches(c, this.selected)) cardEl.classList.add('card--matchable');
      if (choiceOptions.includes(c)) {
        cardEl.classList.add('card--choice');
        cardEl.addEventListener('click', () => this.dispatch({ type: 'chooseMatch', fieldCard: c }));
      }
      this.attachDetail(cardEl, c);
      fieldEl.appendChild(cardEl);
    }
    if (awaitingChoice && rs.pendingCard !== undefined) {
      const pendingWrap = el('div', 'pending');
      pendingWrap.appendChild(el('div', 'pending__hint', S.chooseMatch));
      pendingWrap.appendChild(renderCard(rs.pendingCard, style));
      table.appendChild(pendingWrap);
    }
    table.appendChild(fieldEl);
    this.root.appendChild(table);

    // 我方區
    const myZone = el('section', 'zone zone--mine');
    const myHand = el('div', 'hand hand--mine');
    const myTurn = !this.animating && s.phase === 'awaitHandCard' && rs.turn === HUMAN;
    for (const c of v.hands[HUMAN]) {
      const cardEl = renderCard(c, style, { interactive: myTurn });
      if (this.selected === c) cardEl.classList.add('card--selected');
      if (myTurn) {
        cardEl.addEventListener('click', () => this.onHandCardClick(c));
      }
      this.attachDetail(cardEl, c);
      myHand.appendChild(cardEl);
    }
    myZone.appendChild(myHand);
    if (rs.oya === HUMAN) myZone.appendChild(el('span', 'oya-mark', S.oyaMark));
    if (rs.koikoiDeclared[HUMAN] > 0) myZone.appendChild(el('span', 'koikoi-mark', 'こいこい中'));
    myZone.appendChild(this.renderCaptured(v.captured[HUMAN], 'mine'));
    myZone.appendChild(renderYakuPanel(
      v.captured[HUMAN],
      s.rules,
      this.selected,
      rs.field,
      this.yakuPanelOpen,
      (open) => { this.yakuPanelOpen = open; },
    ));
    this.root.appendChild(myZone);

    // 回合指示
    const hint = el('div', 'turn-hint');
    if (myTurn) hint.textContent = S.yourTurn;
    else if (!this.animating && rs.turn === AI_PLAYER && s.phase !== 'roundEnd' && s.phase !== 'matchEnd') {
      hint.textContent = S.aiThinking;
    }
    this.root.appendChild(hint);
  }

  private renderCaptured(captured: readonly CardId[], who: 'opp' | 'mine'): HTMLElement {
    const wrap = el('div', `captured captured--${who}`);
    const groups: CardType[] = ['hikari', 'tane', 'tanzaku', 'kasu'];
    for (const type of groups) {
      const cards = captured.filter((c) => cardOf(c).type === type);
      if (cards.length === 0) continue;
      const group = el('div', 'captured__group');
      group.appendChild(el('span', 'captured__label', `${S.captured[type]} ${cards.length}`));
      const row = el('div', 'captured__cards');
      for (const c of cards) row.appendChild(renderCard(c, this.config.style));
      group.appendChild(row);
      wrap.appendChild(group);
    }
    return wrap;
  }

  private onHandCardClick(card: CardId): void {
    if (this.selected === card) {
      this.dispatch({ type: 'playHandCard', card });
      return;
    }
    const hasMatch = this.state.roundState.field.some((f) => matches(f, card));
    this.selected = card;
    this.render();
    // 無配對的牌：再點一下丟出；有配對：高亮場札供確認
    void hasMatch;
  }

  // ---------- 對話框 ----------

  private showKoiKoiDialog(): void {
    const s = this.state;
    const content = el('div');
    content.appendChild(el('h2', 'dialog__title', S.koikoiTitle));
    const yakuList = el('ul', 'yaku-list');
    for (const y of s.pendingYaku ?? []) {
      yakuList.appendChild(el('li', 'yaku-list__item', `${y.nameJa}（${y.nameZh}）— ${y.points} ${S.scoreUnit}`));
    }
    content.appendChild(yakuList);
    const all = detectYaku(s.roundState.captured[HUMAN], s.rules);
    const currentPoints = all.reduce((sum, y) => sum + y.points, 0);
    const preview = computeRoundScore(all, {
      opponentDeclaredKoiKoi: s.roundState.koikoiDeclared[AI_PLAYER] > 0,
    }, s.rules);
    content.appendChild(el('p', 'dialog__desc', `目前合計 ${currentPoints} 點（結算可得 ${preview.total} 點）`));
    content.appendChild(el('p', 'dialog__desc', S.koikoiPrompt));
    const actions = el('div', 'dialog__actions');
    actions.appendChild(button(S.shoubu, 'btn btn--primary', () => {
      this.dialog?.close();
      this.dispatch({ type: 'koikoiDecision', declare: false });
    }));
    actions.appendChild(button(S.koikoi, 'btn btn--danger', () => {
      this.dialog?.close();
      this.dispatch({ type: 'koikoiDecision', declare: true });
    }));
    content.appendChild(actions);
    this.dialog = showDialog(content);
  }

  private showRoundEnd(): void {
    const s = this.state;
    const result = s.roundResult;
    // 記錄本局（同一局只記一次；render 可能重播 phase）
    if (this.roundLog.length < s.round) {
      this.roundLog.push({
        winner: result?.winner ?? null,
        points: result?.breakdown?.total ?? 0,
        yaku: (result?.breakdown?.yaku ?? []).map((y) => ({ id: y.id, points: y.points })),
        koikoi: [...s.roundState.koikoiDeclared],
      });
    }
    const content = el('div');
    if (!result || result.winner === null) {
      content.appendChild(el('h2', 'dialog__title', S.roundDraw));
    } else {
      const name = result.winner === HUMAN ? S.you : S.ai;
      if (result.instantWin) {
        content.appendChild(el('h2', 'dialog__title', S.instantWin[result.instantWin]));
      } else {
        content.appendChild(el('h2', 'dialog__title', S.roundWin(name, result.breakdown?.total ?? 0)));
      }
      const list = el('ul', 'yaku-list');
      for (const y of result.breakdown?.yaku ?? []) {
        list.appendChild(el('li', 'yaku-list__item', `${y.nameJa} — ${y.points} ${S.scoreUnit}`));
      }
      for (const m of result.breakdown?.multipliers ?? []) {
        list.appendChild(el('li', 'yaku-list__item yaku-list__item--mult', S.multiplierNames[m] ?? m));
      }
      content.appendChild(list);
    }
    const actions = el('div', 'dialog__actions');
    actions.appendChild(button(S.nextRound, 'btn btn--primary', () => {
      this.dialog?.close();
      this.dispatch({ type: 'acknowledgeRound' });
    }));
    content.appendChild(actions);
    this.dialog = showDialog(content);
  }

  private showMatchEnd(): void {
    const s = this.state;
    this.recordMatch();
    const content = el('div');
    content.appendChild(el('h2', 'dialog__title', S.matchEnd));
    const [me, ai] = s.scores;
    const title = me === ai ? S.matchDraw : S.matchWinner(me > ai ? S.you : S.ai);
    content.appendChild(el('p', 'dialog__desc', `${title}（${S.you} ${me} : ${ai} ${S.ai}）`));
    const actions = el('div', 'dialog__actions');
    actions.appendChild(button(S.backToMenu, 'btn', () => {
      this.dialog?.close();
      this.config.onExit();
    }));
    actions.appendChild(button(S.playAgain, 'btn btn--primary', () => {
      this.dialog?.close();
      this.config.onPlayAgain();
    }));
    content.appendChild(actions);
    this.dialog = showDialog(content);
  }

  /** 場末寫入對戰紀錄（一場只記一次） */
  private recordMatch(): void {
    if (this.recorded) return;
    this.recorded = true;
    const s = this.state;
    const [me, ai] = s.scores;
    const record: MatchRecord = {
      schemaVersion: 1,
      id: `m-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      timestamp: Date.now(),
      aiLevel: this.config.aiLevel,
      totalRounds: s.rules.totalRounds,
      finalScores: [me, ai],
      winner: me === ai ? null : me > ai ? HUMAN : AI_PLAYER,
      rounds: [...this.roundLog],
    };
    void this.config.storage.addMatch(record);
  }
}
