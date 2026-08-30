export interface RuleConfig {
  /** 一場比賽的局數（月） */
  totalRounds: 3 | 6 | 12;
  /** 花見酒（桜に幕＋菊に盃）是否成役 */
  hanamiZake: boolean;
  /** 月見酒（芒に月＋菊に盃）是否成役 */
  tsukimiZake: boolean;
  /** 總點數 7 點以上加倍 */
  sevenPointDouble: boolean;
  /** 對手宣告こいこい後被反殺加倍 */
  koikoiOpponentDouble: boolean;
}

export const DEFAULT_RULES: RuleConfig = {
  totalRounds: 12,
  hanamiZake: true,
  tsukimiZake: true,
  sevenPointDouble: true,
  koikoiOpponentDouble: true,
};
