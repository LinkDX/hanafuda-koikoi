import type { Rng } from '../core/rng';
import { createLevel1 } from './level1';
import { createLevel2 } from './level2';
import type { AILevel, AIStrategy } from './types';

export type { AILevel, AIStrategy, KoiKoiContext } from './types';

export function createAI(level: AILevel, rng: Rng): AIStrategy {
  switch (level) {
    case 1: return createLevel1(rng);
    case 2: return createLevel2(rng);
    case 3: throw new Error('高級 AI 尚未實作');
  }
}
