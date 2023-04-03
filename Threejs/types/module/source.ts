interface loadTextureParams {
  path: string;
  onLoad?: Fn<any>;
  onProgress?: Fn<any>;
  onError?: Fn<any>;
}

export interface SourceType {
  loadTexture: FnParamsReturn<loadTextureParams, any>;
}

export type ViewerSource = SourceType;
