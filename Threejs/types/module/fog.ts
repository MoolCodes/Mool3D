export interface FogType {
  initFog: FnThreeParams<string, number, number, unknown>;
  initFogExp: FnTwoParams<string, number, unknown>;
}

export type ViewerFog = FogType;
